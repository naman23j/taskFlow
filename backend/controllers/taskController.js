const Board = require('../models/Board');
const Task = require('../models/Task');
const { asyncHandler, isValidDate } = require('../utils/helpers');
const { suggestEstimate, generateMockEstimate } = require('../utils/aiService');

const allowedStatuses = ['todo', 'in-progress', 'done'];
const allowedPriorities = ['low', 'medium', 'high'];

async function verifyBoardOwnership(boardId, userId) {
  const board = await Board.findById(boardId);
  if (!board) {
    return { status: 404, board: null };
  }

  if (board.owner.toString() !== userId) {
    return { status: 403, board: null };
  }

  return { status: 200, board };
}

async function verifyTaskOwnership(boardId, taskId, userId) {
  const task = await Task.findById(taskId);
  if (!task) {
    return { status: 404, task: null };
  }

  if (task.board.toString() !== boardId || task.owner.toString() !== userId) {
    return { status: 403, task: null };
  }

  return { status: 200, task };
}

function serializeTask(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    estimatedEffort: task.estimatedEffort,
    estimatedDueDate: task.estimatedDueDate,
    subtasks: task.subtasks,
    tags: task.tags,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    owner: task.owner.toString(),
    board: task.board.toString(),
  };
}

const listBoardTasks = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const access = await verifyBoardOwnership(boardId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Board not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { status, priority, overdue, sortBy = 'createdAt', order = 'desc' } = req.query;
  const query = {
    board: boardId,
    owner: req.user.userId,
  };

  if (status && allowedStatuses.includes(status)) {
    query.status = status;
  }

  if (priority && allowedPriorities.includes(priority)) {
    query.priority = priority;
  }

  if (overdue === 'true') {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: 'done' };
  }

  const sortFields = ['dueDate', 'priority', 'createdAt', 'updatedAt'];
  const sortKey = sortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = order === 'asc' ? 1 : -1;

  const tasks = await Task.find(query).sort({ [sortKey]: sortDirection });

  res.status(200).json({
    tasks: tasks.map(serializeTask),
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const access = await verifyBoardOwnership(boardId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Board not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { title, description = '', priority = 'medium', dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority' });
  }

  if (dueDate && !isValidDate(dueDate)) {
    return res.status(400).json({ success: false, message: 'Invalid due date' });
  }

  const task = await Task.create({
    title: title.trim(),
    description: description.trim(),
    board: boardId,
    owner: req.user.userId,
    status: 'todo',
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
  });

  res.status(201).json({
    task: serializeTask(task),
  });
});

const getTask = asyncHandler(async (req, res) => {
  const { boardId, taskId } = req.params;
  const access = await verifyTaskOwnership(boardId, taskId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  res.status(200).json({ task: serializeTask(access.task) });
});

const updateTask = asyncHandler(async (req, res) => {
  const { boardId, taskId } = req.params;
  const access = await verifyTaskOwnership(boardId, taskId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { title, description, status, priority, dueDate, estimatedEffort, estimatedDueDate, subtasks, tags } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty' });
    }
    access.task.title = title.trim();
  }

  if (description !== undefined) {
    access.task.description = description.trim();
  }

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    access.task.status = status;
  }

  if (priority !== undefined) {
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }
    access.task.priority = priority;
  }

  if (dueDate !== undefined) {
    if (dueDate && !isValidDate(dueDate)) {
      return res.status(400).json({ success: false, message: 'Invalid due date' });
    }
    access.task.dueDate = dueDate ? new Date(dueDate) : null;
  }

  if (estimatedEffort !== undefined) {
    access.task.estimatedEffort = String(estimatedEffort).trim();
  }

  if (estimatedDueDate !== undefined) {
    if (estimatedDueDate && !isValidDate(estimatedDueDate)) {
      return res.status(400).json({ success: false, message: 'Invalid estimated due date' });
    }
    access.task.estimatedDueDate = estimatedDueDate ? new Date(estimatedDueDate) : null;
  }

  if (subtasks !== undefined && Array.isArray(subtasks)) {
    access.task.subtasks = subtasks.map((subtask) => ({
      title: String(subtask.title || '').trim(),
      completed: Boolean(subtask.completed),
    })).filter((subtask) => subtask.title);
  }

  if (tags !== undefined && Array.isArray(tags)) {
    access.task.tags = tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  await access.task.save();

  res.status(200).json({ task: serializeTask(access.task) });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { boardId, taskId } = req.params;
  const access = await verifyTaskOwnership(boardId, taskId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  await access.task.deleteOne();

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

const suggestTaskEstimate = asyncHandler(async (req, res) => {
  console.log('[AI Estimate Flow] Controller: Incoming request body:', req.body);
  const { title, description = '' } = req.body;

  if (!title || !title.trim()) {
    console.warn('[AI Estimate Flow] Controller: Bad Request - Title is required');
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  let estimate;
  try {
    console.log('[AI Estimate Flow] Controller: Calling suggestEstimate()...');
    estimate = await suggestEstimate(title.trim(), description.trim());
  } catch (error) {
    console.error('[AI Estimate Flow] Controller: Exception caught from suggestEstimate:', error.message);
    console.warn('[AI Estimate Flow] Controller: Generating mock fallback due to suggestEstimate exception.');
    estimate = generateMockEstimate(title.trim(), description.trim());
  }

  if (!estimate) {
    console.warn('[AI Estimate Flow] Controller: suggestEstimate returned falsy value. Generating mock fallback.');
    estimate = generateMockEstimate(title.trim(), description.trim());
  }

  const suggestedDueDate = estimate.suggestedDueDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const finalResponse = {
    estimatedEffort: estimate.estimatedEffort,
    suggestedDueDate: suggestedDueDate.slice(0, 10),
    reasoning: estimate.reasoning,
  };

  console.log('[AI Estimate Flow] Controller: Final response sent to frontend:', finalResponse);
  return res.status(200).json(finalResponse);
});

module.exports = {
  listBoardTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  suggestTaskEstimate,
};

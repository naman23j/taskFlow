const Board = require('../models/Board');
const Task = require('../models/Task');
const { asyncHandler } = require('../utils/helpers');

function serializeBoard(board, taskCount = 0) {
  return {
    id: board._id.toString(),
    title: board.title,
    description: board.description,
    owner: board.owner.toString(),
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
    taskCount,
  };
}

async function getOwnedBoard(boardId, userId) {
  const board = await Board.findById(boardId);
  if (!board) {
    return { status: 404, board: null };
  }

  if (board.owner.toString() !== userId) {
    return { status: 403, board: null };
  }

  return { status: 200, board };
}

const listBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ owner: req.user.userId }).sort({ createdAt: -1 });
  const counts = await Promise.all(
    boards.map(async (board) => ({
      boardId: board._id.toString(),
      count: await Task.countDocuments({ board: board._id, owner: req.user.userId }),
    }))
  );
  const countMap = new Map(counts.map((entry) => [entry.boardId, entry.count]));

  res.status(200).json({
    boards: boards.map((board) => serializeBoard(board, countMap.get(board._id.toString()) || 0)),
  });
});

const createBoard = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const board = await Board.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    owner: req.user.userId,
  });

  res.status(201).json({
    board: serializeBoard(board, 0),
  });
});

const getBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const access = await getOwnedBoard(boardId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Board not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const tasks = await Task.find({ board: boardId, owner: req.user.userId }).sort({ createdAt: -1 });

  res.status(200).json({
    board: serializeBoard(access.board, tasks.length),
    tasks: tasks.map((task) => ({
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
    })),
  });
});

const updateBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const access = await getOwnedBoard(boardId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Board not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { title, description } = req.body;
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title cannot be empty' });
  }

  if (title !== undefined) {
    access.board.title = title.trim();
  }

  if (description !== undefined) {
    access.board.description = description.trim();
  }

  await access.board.save();

  res.status(200).json({
    board: serializeBoard(access.board),
  });
});

const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const access = await getOwnedBoard(boardId, req.user.userId);

  if (access.status === 404) {
    return res.status(404).json({ success: false, message: 'Board not found' });
  }

  if (access.status === 403) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  await Task.deleteMany({ board: boardId, owner: req.user.userId });
  await access.board.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Board deleted successfully',
  });
});

module.exports = {
  listBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
};

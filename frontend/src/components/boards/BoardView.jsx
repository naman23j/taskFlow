import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../../context/BoardContext';
import { Badge, Button, PageShell, Section, Stack, SubtleText, Toolbar } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import CreateTaskModal from '../tasks/CreateTaskModal';
import TaskColumn from '../tasks/TaskColumn';
import TaskDetailView from '../tasks/TaskDetailView';

function BoardView() {
  const { boardId } = useParams();
  const { currentBoard, tasks, loading, error, fetchBoard, createTask, updateTask, deleteTask, suggestEstimate } = useBoard();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'createdAt', order: 'desc' });

  useEffect(() => {
    fetchBoard(boardId).catch(() => {});
  }, [boardId, fetchBoard]);

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => !filters.status || task.status === filters.status)
      .filter((task) => !filters.priority || task.priority === filters.priority)
      .sort((left, right) => {
        const sortKey = filters.sortBy;
        const leftValue = left[sortKey] ? new Date(left[sortKey]).getTime() : 0;
        const rightValue = right[sortKey] ? new Date(right[sortKey]).getTime() : 0;
        return filters.order === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      });
  }, [tasks, filters]);

  const groupedTasks = useMemo(() => ({
    todo: visibleTasks.filter((task) => task.status === 'todo'),
    'in-progress': visibleTasks.filter((task) => task.status === 'in-progress'),
    done: visibleTasks.filter((task) => task.status === 'done'),
  }), [visibleTasks]);

  const handleSaveTask = async (payload) => {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(boardId, editingTask.id, payload);
      } else {
        await createTask(boardId, payload);
      }
      setEditingTask(null);
      setTaskModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveTask = async (task, status) => {
    await updateTask(boardId, task.id, { status });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(boardId, taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <PageShell>
      <Section>
        {loading ? (
          <Stack style={{ justifyItems: 'center', padding: '32px 0' }}>
            <LoadingSpinner />
            <SubtleText>Loading board...</SubtleText>
          </Stack>
        ) : null}
        <ErrorAlert message={error} />
        {currentBoard ? (
          <Stack>
            <Toolbar>
              <Stack>
                <h1 style={{ margin: 0 }}>{currentBoard.title}</h1>
                <SubtleText>{currentBoard.description || 'No description provided.'}</SubtleText>
              </Stack>
              <Button type="button" onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}>
                Create Task
              </Button>
            </Toolbar>
            <Toolbar>
              <Badge>{currentBoard.taskCount || tasks.length} tasks</Badge>
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select value={filters.sortBy} onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value }))}>
                <option value="createdAt">Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
              <select value={filters.order} onChange={(event) => setFilters((current) => ({ ...current, order: event.target.value }))}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </Toolbar>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <TaskColumn
                title="To Do"
                tasks={groupedTasks.todo}
                emptyLabel="No tasks in To Do yet."
                onEdit={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
                onSelect={setSelectedTask}
              />
              <TaskColumn
                title="In Progress"
                tasks={groupedTasks['in-progress']}
                emptyLabel="No tasks in progress."
                onEdit={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
                onSelect={setSelectedTask}
              />
              <TaskColumn
                title="Done"
                tasks={groupedTasks.done}
                emptyLabel="Nothing completed yet."
                onEdit={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
                onSelect={setSelectedTask}
              />
            </div>
          </Stack>
        ) : null}
      </Section>

      <CreateTaskModal
        open={taskModalOpen}
        initialTask={editingTask}
        busy={saving}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onSuggest={suggestEstimate}
      />



      <TaskDetailView
        open={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
          setTaskModalOpen(true);
        }}
        onDelete={handleDeleteTask}
      />
    </PageShell>
  );
}

export default BoardView;

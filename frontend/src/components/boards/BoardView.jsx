import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useBoard } from '../../context/BoardContext';
import { Badge, Button, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import CreateTaskModal from '../tasks/CreateTaskModal';
import TaskColumn from '../tasks/TaskColumn';
import TaskDetailView from '../tasks/TaskDetailView';

const BoardHeaderSection = styled(Section)`
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #09090b 0%, #18181b 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)'};
  position: relative;
  overflow: hidden;

  @media (max-width: 600px) {
    gap: 14px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  transition: all 150ms ease;
  min-height: 34px;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 480px) {
    flex: 1;
    min-width: 120px;
    font-size: 0.75rem;
    padding: 6px 10px;
  }
`;

const BoardTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.2rem, 3.5vw, 1.9rem);
  font-weight: 900;
  letter-spacing: -0.02em;
`;

const HeaderToolbar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: nowrap;

  @media (max-width: 520px) {
    flex-wrap: wrap;
  }
`;

const BoardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const ColumnGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    overflow-x: auto;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.border};
      border-radius: 99px;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    overflow-x: visible;
  }
`;

const AddTaskBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#000' : '#fff')};
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px -4px ${({ theme }) => theme.colors.shadow};
  }
  &:active { transform: translateY(0); }

  @media (max-width: 520px) {
    width: 100%;
    justify-content: center;
    border-radius: 10px;
  }
`;

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
      <BoardHeaderSection>
        {loading ? (
          <Stack style={{ justifyItems: 'center', padding: '32px 0' }}>
            <LoadingSpinner />
            <SubtleText>Loading board…</SubtleText>
          </Stack>
        ) : null}
        <ErrorAlert message={error} />
        {currentBoard ? (
          <Stack style={{ gap: '14px' }}>
            <HeaderToolbar>
              <BoardMeta>
                <BoardTitle>{currentBoard.title}</BoardTitle>
                <SubtleText style={{ fontSize: '0.83rem' }}>{currentBoard.description || 'No description provided.'}</SubtleText>
              </BoardMeta>
              <AddTaskBtn
                type="button"
                onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                id="create-task-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </AddTaskBtn>
            </HeaderToolbar>

            <FilterBar>
              <Badge>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {currentBoard.taskCount || tasks.length} tasks
              </Badge>
              <FilterSelect
                value={filters.status}
                onChange={(e) => setFilters((c) => ({ ...c, status: e.target.value }))}
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </FilterSelect>
              <FilterSelect
                value={filters.priority}
                onChange={(e) => setFilters((c) => ({ ...c, priority: e.target.value }))}
              >
                <option value="">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </FilterSelect>
              <FilterSelect
                value={filters.sortBy}
                onChange={(e) => setFilters((c) => ({ ...c, sortBy: e.target.value }))}
              >
                <option value="createdAt">Sort: Created</option>
                <option value="dueDate">Sort: Due Date</option>
                <option value="priority">Sort: Priority</option>
              </FilterSelect>
              <FilterSelect
                value={filters.order}
                onChange={(e) => setFilters((c) => ({ ...c, order: e.target.value }))}
              >
                <option value="desc">↓ Newest</option>
                <option value="asc">↑ Oldest</option>
              </FilterSelect>
            </FilterBar>
          </Stack>
        ) : null}
      </BoardHeaderSection>

      {currentBoard ? (
        <ColumnGrid>
          <TaskColumn
            title="To Do"
            tasks={groupedTasks.todo}
            emptyLabel="No tasks here yet."
            onEdit={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onSelect={setSelectedTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={groupedTasks['in-progress']}
            emptyLabel="Nothing in progress."
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
        </ColumnGrid>
      ) : null}

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

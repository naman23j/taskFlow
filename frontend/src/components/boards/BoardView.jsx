import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useBoard } from '../../context/BoardContext';
import { Badge, Button, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import CreateTaskModal from '../tasks/CreateTaskModal';
import TaskColumn from '../tasks/TaskColumn';
import TaskDetailView from '../tasks/TaskDetailView';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const UnifiedSection = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};
  border: 1.5px solid ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'};
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-height: 550px;
  box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.35)'
      : '0 8px 32px rgba(0,0,0,0.08)'};
  animation: ${fadeUp} 350ms ease both;

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 20px;
    gap: 20px;
    min-height: 450px;
  }
`;

const HeroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  border: 1.5px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.06)' : '#f8f9fb'};
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#1a1a2e'};
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  transition: all 150ms ease;
  min-height: 34px;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover {
    background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : '#edf0f4'};
    border-color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'};
  }

  option {
    background: ${({ theme }) => theme.name === 'dark' ? '#1e2230' : '#ffffff'};
    color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#1a1a2e'};
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
  font-size: clamp(1.55rem, 4vw, 2.3rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.05;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #ffffff 30%, #a1a1aa 100%)'
      : 'linear-gradient(135deg, #0a0a0a 30%, #374151 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'};
  font-size: 0.875rem;
  line-height: 1.65;
  font-weight: 400;
`;

const HeaderToolbar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: nowrap;
  width: 100%;

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

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12.5px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  letter-spacing: 0.01em;
`;

/* Column-specific accent colours (light / dark variants) */
const COL_TODO = {
  light: { bg: '#eff6ff', border: '#000000ff', header: '#dbeafe', title: '#1d4ed8', badge: '#93c5fd', badgeText: '#1e3a8a' },
  dark: { bg: '#eff6ff', border: 'rgba(0, 0, 0, 1)', header: '#dbeafe', title: '#6594c9ff', badge: 'rgba(59,130,246,0.2)', badgeText: '#93c5fd' },
};
const COL_PROGRESS = {
  light: { bg: '#fffbeb', border: '#000000ff', header: '#fef3c7', title: '#b45309', badge: '#fcd34d', badgeText: '#78350f' },
  dark: { bg: '#fffbeb', border: 'rgba(0, 0, 0, 1)', header: '#fef3c7', title: '#fbbf24', badge: 'rgba(251,191,36,0.2)', badgeText: '#fbbf24' },
};
const COL_DONE = {
  light: { bg: '#f0fdf4', border: '#000000ff', header: '#dcfce7', title: '#15803d', badge: '#86efac', badgeText: '#14532d' },
  dark: { bg: '#f0fdf4', border: 'rgba(0, 0, 0, 1)', header: 'rgba(180, 233, 214, 0.1)', title: '#34d399', badge: 'rgba(52,211,153,0.2)', badgeText: '#34d399' },
};

const ColumnGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);

  /* ── Column shell ── */
  & > section {
    border-radius: 16px !important;
    box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 4px 20px rgba(0,0,0,0.25)'
      : '0 2px 12px rgba(0,0,0,0.06)'} !important;

    /* ── Column header ── */
    & > div:first-child {
      border-radius: 14px 14px 0 0 !important;

      h3 { font-weight: 800 !important; font-size: 0.78rem !important; letter-spacing: 0.07em !important; text-transform: uppercase !important; }
    }

    /* ── Task cards inside ColumnBody ── */
    & > div:nth-child(2) > section {
      border-radius: 12px !important;

      &:hover {
        transform: translateY(-2px) !important;
        box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 8px 24px rgba(0,0,0,0.35)'
      : '0 6px 20px rgba(0,0,0,0.1)'} !important;
      }

      h3   { font-weight: 700 !important; }

      /* Separator line inside card */
      div[class*="Separator"] {
        background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} !important;
      }

      /* Danger (delete) button */
      button[title="Delete task"] {
        color: #ef4444 !important;
        background: rgba(239,68,68,0.08) !important;
        border-color: rgba(239,68,68,0.18) !important;

        &:hover { background: rgba(239,68,68,0.16) !important; }
      }

      /* Move chips – inactive */
      div[class*="MoveBar"] > button {
        background: transparent !important;

        &:hover:not([disabled]) {
          background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} !important;
        }
      }
    }

    /* Empty-state placeholder */
    & > div:nth-child(2) > div {
      svg { opacity: 0.3 !important; }
    }
  }

  /* ── TO DO column (index 1) ── */
  & > section:nth-child(1) {
    background: ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.bg : COL_TODO.light.bg} !important;
    border: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.border : COL_TODO.light.border} !important;

    & > div:first-child {
      background: ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.header : COL_TODO.light.header} !important;
      border-bottom: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.border : COL_TODO.light.border} !important;
      h3 { color: ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.title : COL_TODO.light.title} !important; }
      span {
        background: ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.badge : COL_TODO.light.badge} !important;
        color: ${({ theme }) =>
    theme.name === 'dark' ? COL_TODO.dark.badgeText : COL_TODO.light.badgeText} !important;
        border: none !important; box-shadow: none !important;
      }
    }

    & > div:nth-child(2) > section {
      background: ${({ theme }) =>
    theme.name === 'dark' ? '#ffffff' : '#ffffff'} !important;
      border: 1px solid ${({ theme }) =>
    theme.name === 'dark' ? '#bfdbfe' : '#bfdbfe'} !important;
      h3 { color: #1e3a8a !important; }
      p  { color: #3b5998 !important; }
      button { color: #1d4ed8 !important;
        background: rgba(59,130,246,0.06) !important;
        border-color: rgba(59,130,246,0.15) !important;
      }
      div[class*="MoveBar"] > button[disabled] {
        background: #1d4ed8 !important;
        color: #ffffff !important; opacity: 1 !important;
      }
    }
  }

  /* ── IN PROGRESS column (index 2) ── */
  & > section:nth-child(2) {
    background: ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.bg : COL_PROGRESS.light.bg} !important;
    border: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.border : COL_PROGRESS.light.border} !important;

    & > div:first-child {
      background: ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.header : COL_PROGRESS.light.header} !important;
      border-bottom: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.border : COL_PROGRESS.light.border} !important;
      h3 { color: ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.title : COL_PROGRESS.light.title} !important; }
      span {
        background: ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.badge : COL_PROGRESS.light.badge} !important;
        color: ${({ theme }) =>
    theme.name === 'dark' ? COL_PROGRESS.dark.badgeText : COL_PROGRESS.light.badgeText} !important;
        border: none !important; box-shadow: none !important;
      }
    }

    & > div:nth-child(2) > section {
      background: #ffffff !important;
      border: 1px solid #fcd34d !important;
      h3 { color: #78350f !important; }
      p  { color: #92400e !important; }
      button { color: #b45309 !important;
        background: rgba(251,191,36,0.08) !important;
        border-color: rgba(251,191,36,0.3) !important;
      }
      div[class*="MoveBar"] > button[disabled] {
        background: #d97706 !important;
        color: #000000 !important; opacity: 1 !important;
      }
    }
  }

  /* ── DONE column (index 3) ── */
  & > section:nth-child(3) {
    background: ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.bg : COL_DONE.light.bg} !important;
    border: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.border : COL_DONE.light.border} !important;

    & > div:first-child {
      background: ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.header : COL_DONE.light.header} !important;
      border-bottom: 1.5px solid ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.border : COL_DONE.light.border} !important;
      h3 { color: ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.title : COL_DONE.light.title} !important; }
      span {
        background: ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.badge : COL_DONE.light.badge} !important;
        color: ${({ theme }) =>
    theme.name === 'dark' ? COL_DONE.dark.badgeText : COL_DONE.light.badgeText} !important;
        border: none !important; box-shadow: none !important;
      }
    }

    & > div:nth-child(2) > section {
      background: #ffffff !important;
      border: 1px solid #86efac !important;
      h3 { color: #14532d !important; }
      p  { color: #166534 !important; }
      button { color: #15803d !important;
        background: rgba(52,211,153,0.07) !important;
        border-color: rgba(52,211,153,0.3) !important;
      }
      div[class*="MoveBar"] > button[disabled] {
        background: #16a34a !important;
        color: #ffffff !important; opacity: 1 !important;
      }
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    overflow-x: auto;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'} !important;
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
  padding: 10px 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#0f172a'};
  color: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 4px 16px rgba(255,255,255,0.1)'
      : '0 4px 16px rgba(0,0,0,0.18)'};
  letter-spacing: 0.01em;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover {
    background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.9)' : '#1e293b'};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 8px 24px rgba(255,255,255,0.15)'
      : '0 8px 24px rgba(0,0,0,0.22)'};
  }

  &:active { transform: translateY(0); }

  @media (max-width: 520px) {
    width: 100%;
    justify-content: center;
    border-radius: 12px;
  }
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  margin: 0;
  width: 100%;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px 6px 10px;
  border-radius: 999px;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)'};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
  letter-spacing: 0.01em;

  svg {
    transition: transform 160ms ease;
  }

  &:hover {
    background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
    border-color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
    color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'};

    svg { transform: translateX(-3px); }
  }

  &:active { transform: scale(0.97); }
`;

function BoardView() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { currentBoard, tasks, loading, error, fetchBoard, createTask, updateTask, deleteTask, suggestEstimate } = useBoard();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'createdAt', order: 'desc' });

  useEffect(() => {
    fetchBoard(boardId).catch(() => { });
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
      <UnifiedSection>
        {loading ? (
          <Stack style={{ justifyItems: 'center', padding: '32px 0' }}>
            <LoadingSpinner />
            <SubtleText>Loading board…</SubtleText>
          </Stack>
        ) : null}
        <ErrorAlert message={error} />
        {currentBoard ? (
          <Stack style={{ gap: '18px' }}>
            <BackBtn type="button" onClick={() => navigate(-1)} id="back-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </BackBtn>
            <HeaderToolbar>
              <BoardMeta>
                <BoardTitle>{currentBoard.title}</BoardTitle>
                <HeroDesc>{currentBoard.description || 'No description provided.'}</HeroDesc>
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
              <StatBadge>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {currentBoard.taskCount || tasks.length} tasks
              </StatBadge>
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

        <Separator />

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
      </UnifiedSection>

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

import styled, { keyframes } from 'styled-components';
import { Badge, Button, Card, Stack, SubtleText, Toolbar } from '../shared/ui';
import { formatDate, isOverdue } from '../../utils/dateFormatting';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const TaskCardShell = styled(Card)`
  animation: ${slideIn} 300ms ease both;
  cursor: default;
  border: 1.5px solid ${({ $overdue, theme }) =>
    $overdue ? 'rgba(239, 68, 68, 0.4)' : theme.colors.border};
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px -8px ${({ theme }) => theme.colors.shadow};
    border-color: ${({ $overdue, theme }) =>
      $overdue ? 'rgba(239, 68, 68, 0.6)' : theme.colors.muted};
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

const SmallButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : theme.colors.border};
  background: ${({ $variant, theme }) =>
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.08)' : 'transparent'};
  color: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.colors.danger : theme.colors.text};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${({ $variant, theme }) =>
      $variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : theme.colors.surfaceAlt};
    transform: translateY(-1px);
  }
`;

const MoveBar = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const MoveChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  padding: 4px 9px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? (theme.name === 'dark' ? '#000' : '#fff') : theme.colors.muted};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  transition: all 150ms ease;
  opacity: ${({ $active }) => ($active ? 0.5 : 1)};

  &:hover:not([disabled]) {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Separator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 2px 0;
`;

function priorityTone(priority) {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'success';
}

const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

function TaskCard({ task, onEdit, onDelete, onMove, onSelect }) {
  const overdue = isOverdue(task.dueDate);

  return (
    <TaskCardShell $overdue={overdue}>
      <Stack style={{ gap: '10px' }}>
        <Toolbar style={{ alignItems: 'flex-start', gap: '8px' }}>
          <Title>{task.title}</Title>
          <Badge $tone={priorityTone(task.priority)}>{task.priority}</Badge>
        </Toolbar>

        {task.description ? (
          <SubtleText style={{ fontSize: '0.82rem', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.description}
          </SubtleText>
        ) : null}

        <ActionBar>
          <Badge $tone={overdue ? 'danger' : undefined}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(task.dueDate)}
          </Badge>
          {task.estimatedEffort ? (
            <Badge>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {task.estimatedEffort}
            </Badge>
          ) : null}
        </ActionBar>

        <Separator />

        <ActionBar>
          <SmallButton type="button" onClick={() => onSelect(task)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            View
          </SmallButton>
          <SmallButton type="button" onClick={() => onEdit(task)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </SmallButton>
          <SmallButton type="button" $variant="danger" onClick={() => onDelete(task.id)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </SmallButton>
        </ActionBar>

        <MoveBar>
          {['todo', 'in-progress', 'done'].map((status) => (
            <MoveChip
              key={status}
              type="button"
              $active={task.status === status}
              disabled={task.status === status}
              onClick={() => task.status !== status && onMove(task, status)}
            >
              {STATUS_LABELS[status]}
            </MoveChip>
          ))}
        </MoveBar>
      </Stack>
    </TaskCardShell>
  );
}

export default TaskCard;

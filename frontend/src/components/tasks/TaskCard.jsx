import styled, { keyframes } from 'styled-components';
import { Badge, Card, Stack, SubtleText, Toolbar } from '../shared/ui';
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
  padding: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px -8px ${({ theme }) => theme.colors.shadow};
    border-color: ${({ $overdue, theme }) =>
      $overdue ? 'rgba(239, 68, 68, 0.6)' : theme.colors.muted};
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  word-break: break-word;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
`;

const SmallButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  padding: 5px 9px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : theme.colors.border};
  background: ${({ $variant }) =>
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
  gap: 3px;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? (theme.name === 'dark' ? '#000' : '#fff') : theme.colors.muted};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  transition: all 150ms ease;
  opacity: ${({ $active }) => ($active ? 0.65 : 1)};

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

const MetaBadges = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
`;

function priorityTone(priority) {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'success';
}

const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

// Priority icon indicators
function PriorityDot({ priority }) {
  const colors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };
  return (
    <span style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: colors[priority] || colors.low,
      display: 'inline-block',
      flexShrink: 0,
      boxShadow: `0 0 5px ${colors[priority] || colors.low}`,
    }} />
  );
}

function TaskCard({ task, onEdit, onDelete, onMove, onSelect }) {
  const overdue = isOverdue(task.dueDate);

  return (
    <TaskCardShell $overdue={overdue}>
      <Stack style={{ gap: '10px' }}>
        {/* Title + Priority */}
        <TitleRow>
          <Title>{task.title}</Title>
          <Badge $tone={priorityTone(task.priority)} style={{ flexShrink: 0, fontSize: '0.7rem', padding: '3px 9px' }}>
            <PriorityDot priority={task.priority} />
            {task.priority}
          </Badge>
        </TitleRow>

        {/* Description snippet */}
        {task.description ? (
          <SubtleText style={{
            fontSize: '0.8rem',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}>
            {task.description}
          </SubtleText>
        ) : null}

        {/* Meta: due date + effort */}
        <MetaBadges>
          <Badge $tone={overdue ? 'danger' : undefined} style={{ fontSize: '0.72rem', padding: '3px 9px', gap: '4px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(task.dueDate)}
          </Badge>
          {task.estimatedEffort ? (
            <Badge style={{ fontSize: '0.72rem', padding: '3px 9px', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {task.estimatedEffort}
            </Badge>
          ) : null}
        </MetaBadges>

        <Separator />

        {/* Action buttons */}
        <ActionBar>
          <SmallButton type="button" onClick={() => onSelect(task)} title="View details">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            View
          </SmallButton>
          <SmallButton type="button" onClick={() => onEdit(task)} title="Edit task">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </SmallButton>
          <SmallButton type="button" $variant="danger" onClick={() => onDelete(task.id)} title="Delete task">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </SmallButton>
        </ActionBar>

        {/* Status move chips */}
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

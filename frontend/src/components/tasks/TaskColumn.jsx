import styled, { keyframes } from 'styled-components';
import TaskCard from './TaskCard';
import { Card, Stack, SubtleText, Badge } from '../shared/ui';

const STATUS_COLORS = {
  'To Do': { dot: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)' },
  'In Progress': { dot: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
  'Done': { dot: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
};

const ColumnShell = styled(Card)`
  min-height: 340px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  background: ${({ $bg }) => $bg || 'transparent'};
  border-bottom: 1px solid ${({ $border }) => $border || 'transparent'};
`;

const ColumnTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color || 'currentColor'};
  flex-shrink: 0;
  box-shadow: 0 0 6px ${({ $color }) => $color || 'currentColor'};
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-transform: uppercase;
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 6px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ColumnBody = styled.div`
  flex: 1;
  padding: 14px 12px;
  display: grid;
  gap: 10px;
  align-content: start;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 8px;
  opacity: 0.5;
  text-align: center;
`;

function TaskColumn({ title, tasks, emptyLabel, onEdit, onDelete, onMove, onSelect }) {
  const colors = STATUS_COLORS[title] || {};

  return (
    <ColumnShell>
      <ColumnHeader $bg={colors.bg} $border={colors.border}>
        <ColumnTitleRow>
          <StatusDot $color={colors.dot} />
          <ColumnTitle>{title}</ColumnTitle>
        </ColumnTitleRow>
        <CountBadge>{tasks.length}</CountBadge>
      </ColumnHeader>
      <ColumnBody>
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onSelect={onSelect}
            />
          ))
        ) : (
          <EmptyState>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="12" y2="15" />
            </svg>
            <SubtleText style={{ fontSize: '0.82rem' }}>{emptyLabel}</SubtleText>
          </EmptyState>
        )}
      </ColumnBody>
    </ColumnShell>
  );
}

export default TaskColumn;

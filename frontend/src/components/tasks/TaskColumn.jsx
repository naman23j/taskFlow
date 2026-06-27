import styled, { keyframes } from 'styled-components';
import TaskCard from './TaskCard';
import { Card, Stack, SubtleText } from '../shared/ui';

const STATUS_COLORS = {
  'To Do':       { dot: '#3b82f6', bg: 'rgba(59, 130, 246, 0.07)',  border: 'rgba(59, 130, 246, 0.18)' },
  'In Progress': { dot: '#f59e0b', bg: 'rgba(245, 158, 11, 0.07)', border: 'rgba(245, 158, 11, 0.18)' },
  'Done':        { dot: '#10b981', bg: 'rgba(16, 185, 129, 0.07)', border: 'rgba(16, 185, 129, 0.18)' },
};

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 4px currentColor; }
  50%       { box-shadow: 0 0 10px currentColor; }
`;

const ColumnShell = styled(Card)`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  overflow: hidden;
  min-width: 0;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  background: ${({ $bg }) => $bg || 'transparent'};
  border-bottom: 1px solid ${({ $border }) => $border || 'transparent'};
`;

const ColumnTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color || 'currentColor'};
  flex-shrink: 0;
  color: ${({ $color }) => $color || 'currentColor'};
  animation: ${pulse} 3s ease infinite;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 6px;
  padding: 0 6px;
  font-size: 0.72rem;
  font-weight: 800;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ColumnBody = styled.div`
  flex: 1;
  padding: 12px 10px;
  display: grid;
  gap: 8px;
  align-content: start;
  min-height: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  gap: 10px;
  opacity: 0.45;
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="12" y2="15" />
            </svg>
            <SubtleText style={{ fontSize: '0.8rem' }}>{emptyLabel}</SubtleText>
          </EmptyState>
        )}
      </ColumnBody>
    </ColumnShell>
  );
}

export default TaskColumn;

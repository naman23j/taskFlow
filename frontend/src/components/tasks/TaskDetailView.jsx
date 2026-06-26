import styled from 'styled-components';
import { Badge, Button, ModalCard, ModalOverlay, Stack, SubtleText } from '../shared/ui';
import { formatDate, isOverdue } from '../../utils/dateFormatting';

const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const TaskTitle = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  flex: 1;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const MetaValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Separator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const DescriptionBox = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

function priorityTone(priority) {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'success';
}

function statusLabel(status) {
  if (status === 'in-progress') return 'In Progress';
  if (status === 'done') return 'Done';
  return 'To Do';
}

function TaskDetailView({ open, task, onClose, onEdit, onDelete }) {
  if (!open || !task) {
    return null;
  }

  const overdue = isOverdue(task.dueDate);

  return (
    <ModalOverlay>
      <ModalCard>
        <Stack style={{ gap: '20px' }}>
          <DetailHeader>
            <TaskTitle>{task.title}</TaskTitle>
            <CloseButton type="button" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </DetailHeader>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge>{statusLabel(task.status)}</Badge>
            <Badge $tone={priorityTone(task.priority)}>{task.priority} priority</Badge>
            {task.estimatedEffort && <Badge>⏱ {task.estimatedEffort}</Badge>}
            {task.dueDate && (
              <Badge $tone={overdue ? 'danger' : undefined}>
                📅 {formatDate(task.dueDate)}{overdue ? ' (overdue)' : ''}
              </Badge>
            )}
          </div>

          <Separator />

          <Stack style={{ gap: '6px' }}>
            <MetaLabel>Description</MetaLabel>
            {task.description ? (
              <DescriptionBox>{task.description}</DescriptionBox>
            ) : (
              <SubtleText>No description provided.</SubtleText>
            )}
          </Stack>

          <Separator />

          <ActionRow>
            <Button type="button" $variant="secondary" onClick={onClose} id="detail-close-btn" style={{ minHeight: '40px' }}>
              Close
            </Button>
            <Button type="button" $variant="secondary" onClick={() => onDelete(task.id)} id="detail-delete-btn" style={{ minHeight: '40px', color: 'red', borderColor: 'rgba(239,68,68,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete
            </Button>
            <Button type="button" onClick={() => onEdit(task)} id="detail-edit-btn" style={{ minHeight: '40px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Task
            </Button>
          </ActionRow>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default TaskDetailView;

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
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  flex: 1;
  word-break: break-word;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
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
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetaLabel = styled.span`
  font-size: 0.72rem;
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
  font-size: 0.88rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    & > * { width: 100%; }
  }
`;

const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 40px;
  border-radius: 999px;
  border: 1.5px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.06);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.86rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.55);
    transform: translateY(-1px);
  }

  @media (max-width: 480px) { width: 100%; justify-content: center; }
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
  if (!open || !task) return null;

  const overdue = isOverdue(task.dueDate);

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalCard>
        <Stack style={{ gap: '18px' }}>
          <DetailHeader>
            <TaskTitle>{task.title}</TaskTitle>
            <CloseButton type="button" onClick={onClose} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </DetailHeader>

          <BadgeRow>
            <Badge>{statusLabel(task.status)}</Badge>
            <Badge $tone={priorityTone(task.priority)}>
              {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority} priority
            </Badge>
            {task.estimatedEffort && (
              <Badge>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {task.estimatedEffort}
              </Badge>
            )}
            {task.dueDate && (
              <Badge $tone={overdue ? 'danger' : undefined}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(task.dueDate)}{overdue ? ' • overdue' : ''}
              </Badge>
            )}
          </BadgeRow>

          <Separator />

          <Stack style={{ gap: '6px' }}>
            <MetaLabel>Description</MetaLabel>
            {task.description ? (
              <DescriptionBox>{task.description}</DescriptionBox>
            ) : (
              <SubtleText style={{ fontSize: '0.85rem' }}>No description provided.</SubtleText>
            )}
          </Stack>

          <Separator />

          <ActionRow>
            <Button type="button" $variant="secondary" onClick={onClose} id="detail-close-btn">
              Close
            </Button>
            <DeleteBtn type="button" onClick={() => onDelete(task.id)} id="detail-delete-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete
            </DeleteBtn>
            <Button type="button" onClick={() => onEdit(task)} id="detail-edit-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

import styled, { keyframes } from 'styled-components';
import { Badge, Button, Card, Stack, SubtleText } from '../shared/ui';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const BoardCardShell = styled.div`
  animation: ${slideIn} 300ms ease both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  border-radius: 20px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  cursor: default;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) =>
      theme.name === 'dark'
        ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
        : 'linear-gradient(90deg, #09090b, #52525b)'};
    opacity: 0;
    transition: opacity 250ms ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px ${({ theme }) => theme.colors.shadow};
    border-color: ${({ theme }) => theme.colors.muted};

    &::before {
      opacity: 1;
    }
  }
`;

const BoardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const BoardIconWrap = styled.div`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #1c1c1f 0%, #27272a 100%)'
      : 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  flex-shrink: 0;
  transition: all 200ms ease;

  ${BoardCardShell}:hover & {
    background: ${({ theme }) =>
      theme.name === 'dark'
        ? 'linear-gradient(135deg, #27272a 0%, #3f3f46 100%)'
        : 'linear-gradient(135deg, #e4e4e7 0%, #d4d4d8 100%)'};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TitleGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0 0 3px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
`;

const TaskCountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
  flex-shrink: 0;
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
`;

const OpenBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#000' : '#fff')};
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  min-height: 40px;
  letter-spacing: 0.01em;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px -4px ${({ theme }) => theme.colors.shadow};
  }

  &:active { transform: translateY(0); }
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1.5px solid ${({ $danger, theme }) =>
    $danger ? 'rgba(239,68,68,0.3)' : theme.colors.border};
  background: ${({ $danger }) =>
    $danger ? 'rgba(239,68,68,0.06)' : 'transparent'};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.muted};
  cursor: pointer;
  transition: all 160ms ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? 'rgba(239,68,68,0.14)' : theme.colors.surfaceAlt};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.text};
    border-color: ${({ $danger, theme }) =>
      $danger ? 'rgba(239,68,68,0.55)' : theme.colors.muted};
    transform: translateY(-1px);
  }

  &:active { transform: translateY(0); }
`;

function BoardCard({ board, onEdit, onDelete, onOpen }) {
  return (
    <BoardCardShell>
      <BoardHeader>
        <BoardIconWrap>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        </BoardIconWrap>

        <TitleGroup>
          <Title title={board.title}>{board.title}</Title>
          <Description>{board.description || 'No description added yet.'}</Description>
        </TitleGroup>

        <TaskCountBadge>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          {board.taskCount || 0}
        </TaskCountBadge>
      </BoardHeader>

      <ActionRow>
        <OpenBtn type="button" onClick={() => onOpen(board.id)} id={`open-board-${board.id}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open Board
        </OpenBtn>

        <IconBtn
          type="button"
          onClick={() => onEdit(board)}
          id={`edit-board-${board.id}`}
          title="Edit board"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </IconBtn>

        <IconBtn
          type="button"
          $danger
          onClick={() => onDelete(board.id)}
          id={`delete-board-${board.id}`}
          title="Delete board"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </IconBtn>
      </ActionRow>
    </BoardCardShell>
  );
}

export default BoardCard;

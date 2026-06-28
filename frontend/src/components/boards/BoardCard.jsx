import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Shell = styled.article`
  animation: ${slideIn} 300ms ease both;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 0 0 1px #e5e7eb,
    0 2px 16px -4px rgba(0, 0, 0, 0.1);
  padding: 32px 22px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  cursor: default;
  position: relative;
  overflow: hidden;
  transition: box-shadow 220ms ease, transform 220ms ease;

  /* Accent top stripe — hidden until hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2.5px;
    background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(90deg, #7c8cf8, #a78bfa)'
      : 'linear-gradient(90deg, #5b6af0, #7c8cf8)'};
    opacity: 0;
    transition: opacity 220ms ease;
    border-radius: 20px 20px 0 0;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 0 0 1px #d1d5db,
      0 12px 36px -8px rgba(0, 0, 0, 0.15);

    &::before { opacity: 1; }
  }
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

/* Board icon — subtle light gradient tile */
const BoardIcon = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  flex-shrink: 0;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  color: #4b5563;
  transition: all 200ms ease;

  ${Shell}:hover & {
    background: linear-gradient(145deg, #e5e7eb, #d1d5db);
    color: #111827;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0 0 4px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.97rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  color: #000000;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
`;

/* Task count pill */
const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #4b5563;
  background: #f3f4f6;
  box-shadow: 0 0 0 1px #e5e7eb;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

/* Actions row */
const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
`;

const OpenBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0 18px;
  height: 38px;
  cursor: pointer;
  transition: all 180ms ease;
  letter-spacing: 0.01em;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.2);
  }
  &:active { transform: translateY(0); }
`;

const RoundIconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 160ms ease;
  flex-shrink: 0;
  color: ${({ $danger }) => $danger ? '#dc2626' : '#4b5563'};
  background: ${({ $danger }) => $danger ? '#fee2e2' : '#f3f4f6'};
  box-shadow: 0 0 0 1px ${({ $danger }) => $danger ? 'rgba(220,38,38,0.25)' : '#e5e7eb'};

  &:hover {
    background: ${({ $danger }) => $danger ? '#fca5a5' : '#e5e7eb'};
    box-shadow: 0 0 0 1.5px ${({ $danger }) => $danger ? '#dc2626' : '#9ca3af'};
    transform: scale(1.06);
    color: ${({ $danger }) => $danger ? '#b91c1c' : '#111827'};
  }

  &:active { transform: scale(1); }
`;

function BoardCard({ board, onEdit, onDelete, onOpen }) {
  return (
    <Shell>
      <Top>
        <BoardIcon>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </BoardIcon>

        <Info>
          <Title title={board.title}>{board.title}</Title>
          <Desc>{board.description || 'No description added yet.'}</Desc>
        </Info>

        {/* Pill chip showing task count — matches reference image */}
        <CountPill>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          {board.taskCount ?? 0}
        </CountPill>
      </Top>

      <Actions>
        <OpenBtn type="button" onClick={() => onOpen(board.id)} id={`open-board-${board.id}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open Board
        </OpenBtn>

        <RoundIconBtn
          type="button"
          onClick={() => onEdit(board)}
          id={`edit-board-${board.id}`}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </RoundIconBtn>

        <RoundIconBtn
          type="button"
          $danger
          onClick={() => onDelete(board.id)}
          id={`delete-board-${board.id}`}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </RoundIconBtn>
      </Actions>
    </Shell>
  );
}

export default BoardCard;

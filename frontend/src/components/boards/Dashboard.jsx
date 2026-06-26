import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import { useBoard } from '../../context/BoardContext';
import { Button, Grid, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import ConfirmDialog from '../shared/ConfirmDialog';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* Hero */
const HeroSection = styled.div`
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(9, 9, 11, 0.65)'
      : 'rgba(255, 255, 255, 0.75)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 32px 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  animation: ${fadeUp} 350ms ease both;
  box-shadow: 0 4px 28px -6px ${({ theme }) => theme.colors.shadow};

  @media (max-width: 600px) {
    padding: 22px 18px;
    flex-direction: column;
    border-radius: 18px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 0;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.5rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.05;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #fff 30%, #a1a1aa 100%)'
      : 'linear-gradient(135deg, #09090b 30%, #52525b 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.01em;
`;

const StatNum = styled.span`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
`;

const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#000' : '#fff')};
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  box-shadow: 0 4px 16px -4px ${({ theme }) => theme.colors.shadow};
  letter-spacing: 0.01em;

  &:hover {
    opacity: 0.88;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -6px ${({ theme }) => theme.colors.shadow};
  }

  &:active { transform: translateY(0); }
`;

/* Board grid */
const BoardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  animation: ${fadeUp} 350ms 80ms ease both;
`;

/* Empty state */
const EmptyWrap = styled.div`
  border-radius: 22px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(9,9,11,0.5)' : 'rgba(255,255,255,0.6)'};
  backdrop-filter: blur(8px);
  padding: 72px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
  animation: ${fadeUp} 350ms ease both;
`;

const EmptyIconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.muted};
`;

function Dashboard() {
  const navigate = useNavigate();
  const { boards, loading, error, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBoards().catch(() => {});
  }, [fetchBoards]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingBoard) {
        await updateBoard(editingBoard.id, payload);
      } else {
        await createBoard(payload);
      }
      setEditingBoard(null);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteBoard(deleteTarget);
    setDeleteTarget('');
  };

  return (
    <PageShell>
      <HeroSection>
        <HeroLeft>
          <PageTitle>My Boards</PageTitle>
          <SubtleText style={{ maxWidth: '480px' }}>
            Organize your projects, track tasks, and get AI-powered time estimates in one place.
          </SubtleText>
          {!loading && boards.length > 0 && (
            <StatsRow>
              <StatPill>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <StatNum>{boards.length}</StatNum>
                {boards.length === 1 ? 'board' : 'boards'}
              </StatPill>
              <StatPill>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <StatNum>{boards.reduce((a, b) => a + (b.taskCount || 0), 0)}</StatNum>
                total tasks
              </StatPill>
            </StatsRow>
          )}
        </HeroLeft>

        <CreateBtn
          type="button"
          onClick={() => { setEditingBoard(null); setModalOpen(true); }}
          id="create-board-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Board
        </CreateBtn>
      </HeroSection>

      <ErrorAlert message={error} />

      {loading ? (
        <Stack style={{ justifyItems: 'center', padding: '56px 0', gap: '14px' }}>
          <LoadingSpinner />
          <SubtleText>Loading your boards…</SubtleText>
        </Stack>
      ) : boards.length ? (
        <BoardGrid>
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onEdit={(b) => { setEditingBoard(b); setModalOpen(true); }}
              onDelete={(id) => setDeleteTarget(id)}
              onOpen={(id) => navigate(`/boards/${id}`)}
            />
          ))}
        </BoardGrid>
      ) : (
        <EmptyWrap>
          <EmptyIconWrap>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          </EmptyIconWrap>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem' }}>No boards yet</h2>
            <SubtleText>Create your first board to start organizing work.</SubtleText>
          </div>
          <CreateBtn
            type="button"
            onClick={() => setModalOpen(true)}
            id="create-first-board-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create your first board
          </CreateBtn>
        </EmptyWrap>
      )}

      <CreateBoardModal
        open={modalOpen}
        initialBoard={editingBoard}
        busy={saving}
        onClose={() => { setModalOpen(false); setEditingBoard(null); }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete board"
        message="This will permanently remove the board and all of its tasks. This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget('')}
      />
    </PageShell>
  );
}

export default Dashboard;

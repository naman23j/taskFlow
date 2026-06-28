import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import { useBoard } from '../../context/BoardContext';
import { Button, PageShell, Stack, SubtleText } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import ConfirmDialog from '../shared/ConfirmDialog';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const UnifiedSection = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'};
  border: 1.5px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'};
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-height: 580px;
  box-shadow: ${({ theme }) => theme.name === 'dark' ? '0 8px 32px rgba(0,0,0,0.08)' : '0 12px 40px rgba(0,0,0,0.35)'};
  animation: ${fadeUp} 350ms ease both;

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 20px;
    gap: 20px;
    min-height: 480px;
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

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.55rem, 4vw, 2.3rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.05;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #0a0a0a 30%, #374151 100%)'
      : 'linear-gradient(135deg, #ffffff 30%, #a1a1aa 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)'};
  font-size: 0.875rem;
  line-height: 1.65;
  font-weight: 400;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.18)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'};
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)'};
  letter-spacing: 0.01em;
`;

const StatNum = styled.span`
  font-weight: 900;
  color: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};
  font-size: 0.85rem;
`;

const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'};
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  box-shadow: ${({ theme }) => theme.name === 'dark' ? '0 4px 16px rgba(0,0,0,0.15)' : '0 4px 16px rgba(255,255,255,0.12)'};
  letter-spacing: 0.01em;

  &:hover {
    background: ${({ theme }) => theme.name === 'dark' ? '#1a1a1a' : 'rgba(255,255,255,0.88)'};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.name === 'dark' ? '0 8px 24px rgba(0,0,0,0.25)' : '0 8px 24px rgba(255,255,255,0.2)'};
  }

  &:active { transform: translateY(0); }

  @media (max-width: 400px) {
    width: 100%;
    justify-content: center;
    border-radius: 12px;
  }
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'};
  margin: 0;
  width: 100%;
`;

const BoardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  animation: ${fadeUp} 350ms 80ms ease both;

  /* ── Board card overrides inside the hero section ── */
  & > article {
    background: ${({ theme }) =>
    theme.name === 'dark'
      ? '#0d0d0d'
      : '#ffffff'} !important;
    border: 1px solid ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.1)'} !important;
    box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 4px 20px rgba(0,0,0,0.35)'
      : '0 2px 12px rgba(0,0,0,0.07)'} !important;
    min-height: 205px !important;
    padding: 28px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    gap: 20px !important;

    &:hover {
      border-color: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(0,0,0,0.18)'} !important;
      box-shadow: ${({ theme }) =>
    theme.name === 'dark'
      ? '0 12px 30px rgba(0,0,0,0.5)'
      : '0 8px 24px rgba(0,0,0,0.12)'} !important;
    }

    /* Board title */
    h3 {
      color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'} !important;
    }

    /* Board description */
    p {
      color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)'} !important;
    }

    /* Accent top line gradient */
    &::before {
      background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(90deg, #7c8cf8, #a78bfa)'
      : 'linear-gradient(90deg, #5b6af0, #7c8cf8)'} !important;
    }

    /* Board icon tile */
    div:first-child {
      background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.05)'} !important;
      color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.75)' : '#4b5563'} !important;
    }

    &:hover div:first-child {
      background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(91,106,240,0.1)'} !important;
      color: #5b6af0 !important;
    }

    /* Task count badge */
    span {
      background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.05)'} !important;
      border: 1px solid ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(0,0,0,0.1)'} !important;
      color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.9)' : '#374151'} !important;
      box-shadow: none !important;
    }

    /* Open Board button */
    button {
      background: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#111827'} !important;
      color: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'} !important;

      &:hover {
        background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.9)' : '#1f2937'} !important;
      }
    }

    /* Edit icon button */
    button[title="Edit"] {
      background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'} !important;
      color: ${({ theme }) =>
    theme.name === 'dark' ? '#ffffff' : '#374151'} !important;
      box-shadow: 0 0 0 1px ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'} !important;

      &:hover {
        background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} !important;
        color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#000000'} !important;
        box-shadow: 0 0 0 1.5px ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'} !important;
      }
    }

    /* Delete icon button */
    button[title="Delete"] {
      background: rgba(220,38,38,0.08) !important;
      color: #dc2626 !important;
      box-shadow: 0 0 0 1px rgba(220,38,38,0.2) !important;

      &:hover {
        background: rgba(220,38,38,0.15) !important;
        box-shadow: 0 0 0 1.5px #dc2626 !important;
      }
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const EmptyWrap = styled.div`
  border-radius: 20px;
  border: 2px dashed ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'};
  backdrop-filter: blur(8px);
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  animation: ${fadeUp} 350ms ease both;
  color: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};

  h2 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.name === 'dark' ? '#000000' : '#ffffff'};
  }

  p {
    color: ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'} !important;
  }

  @media (max-width: 480px) {
    padding: 48px 20px;
    border-radius: 16px;
  }
`;

const EmptyIconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
`;

function Dashboard() {
  const navigate = useNavigate();
  const { boards, loading, error, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBoards().catch(() => { });
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
      <UnifiedSection>
        <HeroHeader>
          <HeroLeft>
            <PageTitle>My Boards</PageTitle>
            <HeroDesc style={{ maxWidth: '440px' }}>
              Organize your projects, track tasks, and get AI-powered time estimates in one place.
            </HeroDesc>
            {!loading && boards.length > 0 && (
              <StatsRow>
                <StatPill>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <StatNum>{boards.length}</StatNum>
                  {boards.length === 1 ? 'board' : 'boards'}
                </StatPill>
                <StatPill>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Board
          </CreateBtn>
        </HeroHeader>

        <Separator />

        <ErrorAlert message={error} />

        {loading ? (
          <Stack style={{ justifyItems: 'center', padding: '48px 0', gap: '14px' }}>
            <LoadingSpinner />
            <SubtleText style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading your boards…</SubtleText>
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </EmptyIconWrap>
            <div>
              <h2>No boards yet</h2>
              <p style={{ margin: '0' }}>Create your first board to start organizing work.</p>
            </div>
            <CreateBtn
              type="button"
              onClick={() => setModalOpen(true)}
              id="create-first-board-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create your first board
            </CreateBtn>
          </EmptyWrap>
        )}
      </UnifiedSection>

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

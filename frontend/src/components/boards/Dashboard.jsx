import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import { useBoard } from '../../context/BoardContext';
import { Button, Grid, PageShell, Section, Stack, SubtleText, Toolbar } from '../shared/ui';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import ConfirmDialog from '../shared/ConfirmDialog';

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
    if (!deleteTarget) {
      return;
    }
    await deleteBoard(deleteTarget);
    setDeleteTarget('');
  };

  return (
    <PageShell>
      <Section>
        <Toolbar>
          <Stack>
            <h1 style={{ margin: 0 }}>My Boards</h1>
            <SubtleText>Organize projects, tasks, and AI estimates in one place.</SubtleText>
          </Stack>
          <Button type="button" onClick={() => { setEditingBoard(null); setModalOpen(true); }}>Create Board</Button>
        </Toolbar>
        <ErrorAlert message={error} />
        {loading ? (
          <Stack style={{ justifyItems: 'center', padding: '32px 0' }}>
            <LoadingSpinner />
            <SubtleText>Loading boards...</SubtleText>
          </Stack>
        ) : boards.length ? (
          <Grid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onEdit={(currentBoard) => {
                  setEditingBoard(currentBoard);
                  setModalOpen(true);
                }}
                onDelete={(boardId) => setDeleteTarget(boardId)}
                onOpen={(boardId) => navigate(`/boards/${boardId}`)}
              />
            ))}
          </Grid>
        ) : (
          <Section style={{ background: 'transparent', borderStyle: 'dashed' }}>
            <Stack>
              <h2 style={{ margin: 0 }}>No boards yet</h2>
              <SubtleText>Create your first board to start organizing work.</SubtleText>
              <Button type="button" onClick={() => setModalOpen(true)}>Create your first board</Button>
            </Stack>
          </Section>
        )}
      </Section>

      <CreateBoardModal
        open={modalOpen}
        initialBoard={editingBoard}
        busy={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingBoard(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete board"
        message="This will remove the board and all of its tasks."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget('')}
      />
    </PageShell>
  );
}

export default Dashboard;

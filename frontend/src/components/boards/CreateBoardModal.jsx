import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, FieldGroup, Input, Label, ModalCard, ModalOverlay, Stack, TextArea } from '../shared/ui';

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
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
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    & > * { width: 100%; }
  }
`;

function CreateBoardModal({ open, initialBoard, onClose, onSave, busy }) {
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    if (open) {
      setForm({
        title: initialBoard?.title || '',
        description: initialBoard?.description || '',
      });
    }
  }, [open, initialBoard]);

  if (!open) return null;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave({ title: form.title, description: form.description });
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalCard>
        <Stack style={{ gap: '20px' }}>
          <ModalHeader>
            <ModalTitle>{initialBoard ? 'Edit Board' : 'Create Board'}</ModalTitle>
            <CloseButton type="button" onClick={onClose} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <Stack style={{ gap: '16px' }}>
              <FieldGroup>
                <Label>
                  Board Title *
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g. Marketing Sprint"
                    required
                  />
                </Label>
                <Label>
                  Description
                  <TextArea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="Describe the project or sprint."
                    style={{ minHeight: '80px' }}
                  />
                </Label>
              </FieldGroup>
              <ButtonRow>
                <Button type="button" $variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy || !form.title}>
                  {busy ? (
                    <>
                      <svg style={{ animation: 'spin 0.9s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                      </svg>
                      {initialBoard ? 'Save Changes' : 'Create Board'}
                    </>
                  )}
                </Button>
              </ButtonRow>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </Stack>
          </form>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default CreateBoardModal;

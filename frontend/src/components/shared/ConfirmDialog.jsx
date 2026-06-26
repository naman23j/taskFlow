import styled from 'styled-components';
import { Button, ModalOverlay, ModalCard, Stack, SubtleText } from './ui';

const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const WarningIcon = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.danger};
  flex-shrink: 0;
`;

const DialogTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 800;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <ModalCard style={{ maxWidth: '400px', padding: '28px' }}>
        <Stack style={{ gap: '20px' }}>
          <DialogHeader>
            <WarningIcon>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </WarningIcon>
            <div>
              <DialogTitle id="confirm-title">{title}</DialogTitle>
              <SubtleText style={{ fontSize: '0.875rem' }}>{message}</SubtleText>
            </div>
          </DialogHeader>
          <ButtonRow>
            <Button type="button" $variant="secondary" onClick={onCancel} id="confirm-cancel-btn" style={{ minHeight: '40px' }}>
              Cancel
            </Button>
            <Button type="button" $variant="danger" onClick={onConfirm} id="confirm-delete-btn" style={{ minHeight: '40px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete
            </Button>
          </ButtonRow>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default ConfirmDialog;

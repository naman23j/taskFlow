import { Button, FieldGroup, ModalOverlay, ModalCard, Stack, SubtleText, Toolbar } from './ui';

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <ModalCard>
        <Stack>
          <h2 id="confirm-title" style={{ margin: 0 }}>{title}</h2>
          <FieldGroup>
            <SubtleText>{message}</SubtleText>
          </FieldGroup>
          <Toolbar>
            <Button type="button" $variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" $variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </Toolbar>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default ConfirmDialog;

import { useEffect, useState } from 'react';
import { Button, FieldGroup, Input, Label, ModalCard, ModalOverlay, Stack, TextArea, Toolbar } from '../shared/ui';

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

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave({ title: form.title, description: form.description });
  };

  return (
    <ModalOverlay>
      <ModalCard>
        <Stack>
          <h2 style={{ margin: 0 }}>{initialBoard ? 'Edit Board' : 'Create Board'}</h2>
          <form onSubmit={handleSubmit}>
            <Stack>
              <FieldGroup>
                <Label>
                  Title
                  <Input name="title" value={form.title} onChange={handleChange} maxLength={100} placeholder="Marketing Sprint" />
                </Label>
                <Label>
                  Description
                  <TextArea name="description" value={form.description} onChange={handleChange} maxLength={500} placeholder="Describe the project or sprint." />
                </Label>
              </FieldGroup>
              <Toolbar>
                <Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Board'}</Button>
              </Toolbar>
            </Stack>
          </form>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default CreateBoardModal;

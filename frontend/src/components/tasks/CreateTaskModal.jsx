import { useEffect, useState } from 'react';
import { Button, FieldGroup, FormRow, Input, Label, ModalCard, ModalOverlay, Select, Stack, TextArea, Toolbar, SubtleText } from '../shared/ui';

function CreateTaskModal({ open, initialTask, onClose, onSave, onSuggest, busy }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedEffort: '',
  });
  const [suggestion, setSuggestion] = useState(null);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        priority: initialTask?.priority || 'medium',
        dueDate: initialTask?.dueDate ? String(initialTask.dueDate).slice(0, 10) : '',
        estimatedEffort: initialTask?.estimatedEffort || '',
      });
      setSuggestion(null);
      setSuggesting(false);
    }
  }, [open, initialTask]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave({
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate || null,
      estimatedEffort: form.estimatedEffort,
    });
  };

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const response = await onSuggest(form.title, form.description);
      setSuggestion(response);
      setForm((current) => ({
        ...current,
        estimatedEffort: response.estimatedEffort || current.estimatedEffort,
        dueDate: response.suggestedDueDate || current.dueDate,
      }));
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalCard>
        <Stack>
          <h2 style={{ margin: 0 }}>{initialTask ? 'Edit Task' : 'Create Task'}</h2>
          <SubtleText>Ask the AI helper for a quick estimate if you want a starting point.</SubtleText>
          <form onSubmit={handleSubmit}>
            <Stack>
              <FieldGroup>
                <Label>
                  Title
                  <Input name="title" value={form.title} onChange={handleChange} maxLength={200} placeholder="Write release notes" />
                </Label>
                <Label>
                  Description
                  <TextArea name="description" value={form.description} onChange={handleChange} maxLength={1000} placeholder="Add any useful context." />
                </Label>
                <FormRow $columns={3}>
                  <Label>
                    Priority
                    <Select name="priority" value={form.priority} onChange={handleChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </Label>
                  <Label>
                    Due Date
                    <Input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
                  </Label>
                  <Label>
                    Effort
                    <Input name="estimatedEffort" value={form.estimatedEffort} onChange={handleChange} placeholder="M or 2h" />
                  </Label>
                </FormRow>
              </FieldGroup>

              <Toolbar>
                <Button type="button" $variant="secondary" onClick={handleSuggest} disabled={suggesting || !form.title}>
                  {suggesting ? 'Thinking...' : 'Suggest Estimate'}
                </Button>
                <Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Task'}</Button>
              </Toolbar>

              {suggestion ? (
                <SubtleText>
                  AI suggests {suggestion.estimatedEffort} and {suggestion.suggestedDueDate}. {suggestion.reasoning}
                </SubtleText>
              ) : null}
            </Stack>
          </form>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default CreateTaskModal;

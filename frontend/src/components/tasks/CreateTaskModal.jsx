import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, FieldGroup, FormRow, Input, Label, ModalCard, ModalOverlay, Select, Stack, TextArea, SubtleText } from '../shared/ui';
import ErrorAlert from '../shared/ErrorAlert';

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
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
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const AISuggestionBox = styled.div`
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.06);
`;

const AISuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #8b5cf6;
`;

const AISuggestionText = styled.p`
  margin: 0;
  font-size: 0.83rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.55;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    & > * { width: 100%; }
  }
`;

const AIBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1.5px solid rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.07);
  color: #8b5cf6;
  font-size: 0.84rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 160ms ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(139, 92, 246, 0.14);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SpinAnim = styled.svg`
  animation: spin 0.9s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

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
  const [error, setError] = useState('');

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
      setError('');
    }
  }, [open, initialTask]);

  if (!open) return null;

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
    setError('');
    setSuggestion(null);
    try {
      const response = await onSuggest(form.title, form.description);
      setSuggestion(response);
      setForm((current) => ({
        ...current,
        estimatedEffort: response.estimatedEffort || current.estimatedEffort,
        dueDate: response.suggestedDueDate || current.dueDate,
      }));
    } catch (suggestError) {
      setError(suggestError.message || 'Unable to generate suggestion.');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalCard>
        <Stack style={{ gap: '20px' }}>
          <ModalHeader>
            <Stack style={{ gap: '3px' }}>
              <ModalTitle>{initialTask ? 'Edit Task' : 'Create Task'}</ModalTitle>
              <SubtleText style={{ fontSize: '0.79rem' }}>
                Use AI Estimate to auto-fill effort and due date.
              </SubtleText>
            </Stack>
            <CloseButton type="button" onClick={onClose} aria-label="Close modal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <Stack style={{ gap: '20px' }}>
              <ErrorAlert message={error} />
              <FieldGroup>
                <Label>
                  Task Title *
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="e.g., Write release notes"
                    id="task-title"
                    required
                  />
                </Label>
                <Label>
                  Description
                  <TextArea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={1000}
                    placeholder="Add context, requirements, or acceptance criteria…"
                    id="task-description"
                    style={{ minHeight: '96px' }}
                  />
                </Label>
                <FormRow $columns={2}>
                  <Label>
                    Priority
                    <Select name="priority" value={form.priority} onChange={handleChange} id="task-priority">
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </Select>
                  </Label>
                  <Label>
                    Due Date
                    <Input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} id="task-due-date" />
                  </Label>
                </FormRow>
                <Label>
                  Estimated Effort
                  <Input
                    name="estimatedEffort"
                    value={form.estimatedEffort}
                    onChange={handleChange}
                    placeholder="e.g. 2h, 3 days, 1 sprint"
                    id="task-effort"
                  />
                </Label>
              </FieldGroup>

              {suggestion ? (
                <AISuggestionBox>
                  <AISuggestionHeader>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    AI Suggestion Applied
                  </AISuggestionHeader>
                  <AISuggestionText>{suggestion.reasoning}</AISuggestionText>
                </AISuggestionBox>
              ) : null}

              <ButtonGroup>
                <AIBtn
                  type="button"
                  onClick={handleSuggest}
                  disabled={suggesting || !form.title}
                  id="suggest-estimate-btn"
                >
                  {suggesting ? (
                    <>
                      <SpinAnim width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </SpinAnim>
                      Thinking…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      AI Estimate
                    </>
                  )}
                </AIBtn>
                <Button type="button" $variant="secondary" onClick={onClose} id="cancel-task-btn">
                  Cancel
                </Button>
                <Button type="submit" disabled={busy || !form.title} id="save-task-btn">
                  {busy ? (
                    <>
                      <SpinAnim width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </SpinAnim>
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Task
                    </>
                  )}
                </Button>
              </ButtonGroup>
            </Stack>
          </form>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default CreateTaskModal;

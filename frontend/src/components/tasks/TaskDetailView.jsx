import { Badge, Button, ModalCard, ModalOverlay, Stack, SubtleText, Toolbar } from '../shared/ui';
import { formatDate } from '../../utils/dateFormatting';

function TaskDetailView({ open, task, onClose, onEdit, onDelete }) {
  if (!open || !task) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalCard>
        <Stack>
          <h2 style={{ margin: 0 }}>{task.title}</h2>
          <SubtleText>{task.description || 'No description provided.'}</SubtleText>
          <Toolbar>
            <Badge>{task.status}</Badge>
            <Badge>{task.priority}</Badge>
            <Badge>{formatDate(task.dueDate)}</Badge>
          </Toolbar>
          <Toolbar>
            <Button type="button" $variant="secondary" onClick={() => onEdit(task)}>Edit</Button>
            <Button type="button" $variant="secondary" onClick={() => onDelete(task.id)}>Delete</Button>
            <Button type="button" onClick={onClose}>Close</Button>
          </Toolbar>
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default TaskDetailView;

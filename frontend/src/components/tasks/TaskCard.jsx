import styled from 'styled-components';
import { Badge, Button, Card, Stack, SubtleText, Toolbar } from '../shared/ui';
import { formatDate, isOverdue } from '../../utils/dateFormatting';

const Title = styled.h3`
  margin: 0;
`;

function priorityTone(priority) {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'success';
}

function TaskCard({ task, onEdit, onDelete, onMove, onSelect }) {
  const overdue = isOverdue(task.dueDate);

  return (
    <Card style={{ borderColor: overdue ? 'rgba(220, 38, 38, 0.45)' : undefined }}>
      <Stack>
        <Toolbar>
          <Title>{task.title}</Title>
          <Badge $tone={priorityTone(task.priority)}>{task.priority}</Badge>
        </Toolbar>
        <SubtleText>{task.description || 'No description provided.'}</SubtleText>
        <Toolbar>
          <Badge $tone={overdue ? 'danger' : undefined}>{formatDate(task.dueDate)}</Badge>
          {task.estimatedEffort ? <Badge>{task.estimatedEffort}</Badge> : null}
        </Toolbar>
        <Toolbar>
          <Button type="button" $variant="secondary" onClick={() => onSelect(task)}>
            Details
          </Button>
          <Button type="button" $variant="secondary" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button type="button" $variant="secondary" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </Toolbar>
        <Toolbar>
          <Button type="button" $variant="secondary" onClick={() => onMove(task, 'todo')}>To Do</Button>
          <Button type="button" $variant="secondary" onClick={() => onMove(task, 'in-progress')}>In Progress</Button>
          <Button type="button" $variant="secondary" onClick={() => onMove(task, 'done')}>Done</Button>
        </Toolbar>
      </Stack>
    </Card>
  );
}

export default TaskCard;

import styled from 'styled-components';
import { Badge, Button, Card, Stack, SubtleText, Toolbar } from '../shared/ui';

const Title = styled.h3`
  margin: 0;
`;

function BoardCard({ board, onEdit, onDelete, onOpen }) {
  return (
    <Card>
      <Stack>
        <Toolbar>
          <div>
            <Title>{board.title}</Title>
            <SubtleText>{board.description || 'No description added yet.'}</SubtleText>
          </div>
          <Badge>{board.taskCount || 0} tasks</Badge>
        </Toolbar>
        <Toolbar>
          <Button type="button" $variant="secondary" onClick={() => onEdit(board)}>
            Edit
          </Button>
          <Button type="button" $variant="secondary" onClick={() => onDelete(board.id)}>
            Delete
          </Button>
          <Button type="button" onClick={() => onOpen(board.id)}>
            Open
          </Button>
        </Toolbar>
      </Stack>
    </Card>
  );
}

export default BoardCard;

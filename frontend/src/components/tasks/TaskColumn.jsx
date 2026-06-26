import styled from 'styled-components';
import TaskCard from './TaskCard';
import { Card, Stack, SubtleText } from '../shared/ui';

const ColumnShell = styled(Card)`
  min-height: 320px;
`;

const ColumnTitle = styled.h3`
  margin: 0;
`;

function TaskColumn({ title, tasks, emptyLabel, onEdit, onDelete, onMove, onSelect }) {
  return (
    <ColumnShell>
      <Stack>
        <ColumnTitle>{title}</ColumnTitle>
        {tasks.length ? (
          <Stack>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                onSelect={onSelect}
              />
            ))}
          </Stack>
        ) : (
          <SubtleText>{emptyLabel}</SubtleText>
        )}
      </Stack>
    </ColumnShell>
  );
}

export default TaskColumn;

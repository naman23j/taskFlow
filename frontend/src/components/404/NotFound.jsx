import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PageShell, Section, Stack, SubtleText } from '../shared/ui';

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 6vw, 4.5rem);
`;

function NotFound() {
  return (
    <PageShell>
      <Section style={{ minHeight: '60vh', placeItems: 'center', textAlign: 'center' }}>
        <Stack style={{ justifyItems: 'center', maxWidth: '560px' }}>
          <Title>404</Title>
          <SubtleText>The page you are looking for does not exist.</SubtleText>
          <Link to="/dashboard">Back to dashboard</Link>
        </Stack>
      </Section>
    </PageShell>
  );
}

export default NotFound;

import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import { PageShell, Section, Stack, SubtleText } from '../shared/ui';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <PageShell>
        <Section style={{ placeItems: 'center' }}>
          <Stack style={{ justifyItems: 'center' }}>
            <LoadingSpinner />
            <SubtleText>Checking your session...</SubtleText>
          </Stack>
        </Section>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;

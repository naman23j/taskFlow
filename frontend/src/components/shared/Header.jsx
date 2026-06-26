import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Button, Toolbar } from './ui';

const Shell = styled.header`
  width: min(1180px, calc(100% - 24px));
  margin: 0 auto 20px;
  padding: 16px 0 4px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
  font-size: 1.15rem;
`;

const Mark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #8b5cf6);
  color: white;
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
`;

const Meta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Shell>
      <Toolbar>
        <Brand to={isAuthenticated ? '/dashboard' : '/login'}>
          <Mark>T</Mark>
          TaskFlow
        </Brand>
        <Meta>
          {isAuthenticated ? <span>Signed in as {user?.name}</span> : null}
          <ThemeToggle />
          {isAuthenticated ? (
            <Button type="button" onClick={handleLogout} $variant="secondary">
              Logout
            </Button>
          ) : (
            <Button type="button" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Meta>
      </Toolbar>
    </Shell>
  );
}

export default Header;

import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const slideDown = keyframes`
  from { transform: translateY(-14px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const Shell = styled.header`
  width: min(1200px, calc(100% - 28px));
  margin: 0 auto 24px;
  padding-top: 16px;
  animation: ${slideDown} 420ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;

  @media (max-width: 480px) {
    width: calc(100% - 20px);
    margin-bottom: 16px;
    padding-top: 12px;
  }
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 7px 7px 16px;
  border-radius: 999px;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(22, 25, 32, 0.88)'
      : 'rgba(255, 255, 255, 0.92)'};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.colors.border},
    0 4px 28px -6px ${({ theme }) => theme.colors.shadow};

  @media (max-width: 480px) {
    border-radius: 18px;
    padding: 8px 10px 8px 14px;
    gap: 6px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity 160ms ease;
  &:hover { opacity: 0.75; }
`;

const LogoMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#0d0f12' : '#fff')};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);

  ${Brand}:hover & {
    transform: rotate(-8deg) scale(1.1);
  }
`;

const BrandName = styled.span`
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.025em;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(130deg, #eef0f6 20%, #9aa3b8 100%)'
      : 'linear-gradient(130deg, #1a1a2e 20%, #4a5568 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 360px) {
    display: none;
  }
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const HSep = styled.div`
  width: 1px;
  height: 18px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 2px;

  @media (max-width: 360px) { display: none; }
`;

const ProfileChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  cursor: default;
  transition: background 160ms ease;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const AvatarCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  flex-shrink: 0;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #5b6af0, #8b5cf6)'
      : 'linear-gradient(135deg, #1a1a2e, #4a5568)'};
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const UserName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 520px) {
    display: none;
  }
`;

const NavAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 34px;
  border-radius: 999px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
  white-space: nowrap;

  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : 'transparent'};
  color: ${({ $primary, theme }) =>
    $primary
      ? theme.name === 'dark' ? '#0d0f12' : '#fff'
      : theme.colors.text};
  box-shadow: ${({ $primary, theme }) =>
    $primary
      ? `0 2px 12px -3px ${theme.colors.shadowMd}`
      : `0 0 0 1px ${theme.colors.borderStrong}`};

  &:hover {
    transform: translateY(-1px);
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.primaryHover : theme.colors.surfaceAlt};
    box-shadow: ${({ $primary, theme }) =>
      $primary
        ? `0 4px 16px -4px ${theme.colors.shadowMd}`
        : `0 0 0 1.5px ${theme.colors.muted}, 0 3px 10px -4px ${theme.colors.shadow}`};
  }

  &:active { transform: translateY(0); }

  @media (max-width: 400px) {
    padding: 0 10px;
    font-size: 0.75rem;
    gap: 4px;
  }
`;

const LogoutLabel = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <Shell>
      <NavBar>
        <Brand to={isAuthenticated ? '/dashboard' : '/login'}>
          <LogoMark>T</LogoMark>
          <BrandName>TaskFlow</BrandName>
        </Brand>

        <RightCluster>
          {isAuthenticated && user?.name ? (
            <>
              <ProfileChip title={user.name}>
                <AvatarCircle>{initials}</AvatarCircle>
                <UserName>{user.name}</UserName>
              </ProfileChip>
              <HSep />
            </>
          ) : null}

          <ThemeToggle />

          {isAuthenticated ? (
            <NavAction type="button" onClick={handleLogout} id="logout-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <LogoutLabel>Logout</LogoutLabel>
            </NavAction>
          ) : (
            <NavAction $primary type="button" onClick={() => navigate('/login')} id="header-login-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </NavAction>
          )}
        </RightCluster>
      </NavBar>
    </Shell>
  );
}

export default Header;

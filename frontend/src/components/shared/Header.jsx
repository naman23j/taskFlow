import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui';

const slideDown = keyframes`
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Shell = styled.header`
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto 32px;
  padding-top: 20px;
  animation: ${slideDown} 400ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  /* Glassmorphism card */
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'rgba(9, 9, 11, 0.75)'
      : 'rgba(255, 255, 255, 0.82)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  border-radius: 20px;
  padding: 10px 16px 10px 12px;
  box-shadow:
    0 4px 24px -4px ${({ theme }) => theme.colors.shadow},
    inset 0 1px 0 ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)'};

  @media (max-width: 580px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    border-radius: 16px;
    padding: 14px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: opacity 150ms ease;

  &:hover { opacity: 0.8; }
`;

const LogoMark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#000' : '#fff')};
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 12px ${({ theme }) => theme.colors.shadow};
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);

  ${Brand}:hover & {
    transform: rotate(-6deg) scale(1.08);
  }
`;

const BrandName = styled.span`
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.18rem;
  letter-spacing: -0.025em;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)'
      : 'linear-gradient(135deg, #09090b 0%, #52525b 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/* ─── Right side ──────────────────────────────────────────────────── */
const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 580px) {
    justify-content: space-between;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 2px;

  @media (max-width: 400px) { display: none; }
`;

/* Profile chip */
const ProfileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  cursor: default;
  transition: all 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.muted};
    background: ${({ theme }) =>
      theme.name === 'dark' ? '#27272a' : '#e4e4e7'};
  }

  @media (max-width: 420px) { display: none; }
`;

const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      : 'linear-gradient(135deg, #09090b, #52525b)'};
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
`;

const UserName = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Logout / Login */
const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 160ms ease;
  white-space: nowrap;
  min-height: 38px;

  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : 'transparent'};
  color: ${({ $primary, theme }) =>
    $primary
      ? theme.name === 'dark' ? '#000' : '#fff'
      : theme.colors.text};
  border: 1.5px solid ${({ $primary, theme }) =>
    $primary ? 'transparent' : theme.colors.border};

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.primaryHover : theme.colors.surfaceAlt};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -3px ${({ theme }) => theme.colors.shadow};
    border-color: ${({ $primary, theme }) =>
      $primary ? 'transparent' : theme.colors.muted};
  }

  &:active { transform: translateY(0); }
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
        {/* Brand */}
        <Brand to={isAuthenticated ? '/dashboard' : '/login'}>
          <LogoMark>T</LogoMark>
          <BrandName>TaskFlow</BrandName>
        </Brand>

        {/* Right cluster */}
        <RightCluster>
          {/* Profile chip — only when logged in */}
          {isAuthenticated && user?.name ? (
            <>
              <ProfileChip>
                <Avatar>{initials}</Avatar>
                <UserName>{user.name}</UserName>
              </ProfileChip>
              <Divider />
            </>
          ) : null}

          <ThemeToggle />

          {isAuthenticated ? (
            <NavBtn type="button" onClick={handleLogout} id="logout-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </NavBtn>
          ) : (
            <NavBtn $primary type="button" onClick={() => navigate('/login')} id="header-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </NavBtn>
          )}
        </RightCluster>
      </NavBar>
    </Shell>
  );
}

export default Header;

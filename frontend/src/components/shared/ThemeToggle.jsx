import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const Track = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 58px;
  height: 32px;
  padding: 3px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  position: relative;
  transition: all 250ms ease;
  outline: none;
  user-select: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent};
  }
`;

const BackgroundIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: ${({ theme }) => theme.colors.muted};
  opacity: 0.6;
  transition: opacity 250ms ease;
  z-index: 1;
`;

const Thumb = styled.div`
  position: absolute;
  left: 3px;
  top: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background 300ms, box-shadow 300ms;
  z-index: 2;

  transform: ${({ $isDark }) => ($isDark ? 'translateX(26px)' : 'translateX(0)')};

  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
      : 'linear-gradient(135deg, #fbbf24, #f59e0b)'};

  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 2px 8px rgba(99, 102, 241, 0.4)'
      : '0 2px 8px rgba(245, 158, 11, 0.4)'};
  
  color: #ffffff;
`;

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '13px', height: '13px' }}
  >
    <circle cx="12" cy="12" r="5" fill="currentColor" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '12px', height: '12px' }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';

  return (
    <Track
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle"
    >
      <BackgroundIcon>
        <SunIcon />
      </BackgroundIcon>
      <BackgroundIcon>
        <MoonIcon />
      </BackgroundIcon>
      <Thumb $isDark={isDark}>
        {isDark ? <MoonIcon /> : <SunIcon />}
      </Thumb>
    </Track>
  );
}

export default ThemeToggle;


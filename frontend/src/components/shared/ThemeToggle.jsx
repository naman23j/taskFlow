import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const appear = keyframes`
  from { transform: scale(0.5) rotate(-30deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const ToggleButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${appear} 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 1rem;
`;

const Track = styled.span`
  display: inline-flex;
  width: 34px;
  height: 18px;
  background: ${({ $dark, theme }) => $dark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
  border-radius: 9px;
  border: 1px solid ${({ $dark, theme }) => $dark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(251, 191, 36, 0.5)'};
  position: relative;
  transition: all 300ms ease;
  flex-shrink: 0;
`;

const Thumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $dark }) => $dark ? 'calc(100% - 16px)' : '2px'};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $dark }) => $dark ? 'rgb(139, 92, 246)' : 'rgb(251, 191, 36)'};
  transition: left 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background 300ms ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
`;

function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <IconWrapper key={themeName}>
        {isDark ? '🌙' : '☀️'}
      </IconWrapper>
      <Track $dark={isDark}>
        <Thumb $dark={isDark} />
      </Track>
    </ToggleButton>
  );
}

export default ThemeToggle;

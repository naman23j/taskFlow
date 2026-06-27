import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

/* Pill track — matches the reference image exactly */
const Track = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
  cursor: pointer;
  border: none;
  transition: all 200ms ease;
  user-select: none;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.colors.borderStrong};
  }
`;

const Icon = styled.span`
  font-size: 0.85rem;
  line-height: 1;
  transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
`;

/* Sliding thumb inside the track */
const Thumb = styled.span`
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  background: ${({ $dark }) =>
    $dark
      ? 'linear-gradient(135deg, #5b6af0, #8b5cf6)'
      : 'linear-gradient(135deg, #f59e0b, #fb923c)'};
  box-shadow: ${({ $dark }) =>
    $dark
      ? '0 2px 10px rgba(91,106,240,0.5)'
      : '0 2px 10px rgba(245,158,11,0.5)'};
`;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Track
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle"
    >
      <Icon style={{ transform: isDark ? 'scale(0.8) rotate(-20deg)' : 'scale(1) rotate(0deg)' }}>
        {isDark ? '🌙' : '☀️'}
      </Icon>
      <Thumb $dark={isDark} />
    </Track>
  );
}

export default ThemeToggle;

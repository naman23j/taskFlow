import { Button } from './ui';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();

  return (
    <Button type="button" $variant="secondary" onClick={toggleTheme} aria-label="Toggle color theme">
      {themeName === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}

export default ThemeToggle;

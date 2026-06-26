import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => theme.name};
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(37, 99, 235, 0.22), transparent 35%),
      radial-gradient(circle at top right, rgba(22, 163, 74, 0.16), transparent 28%),
      ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: background 180ms ease, color 180ms ease;
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

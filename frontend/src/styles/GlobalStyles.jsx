import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600&display=swap');

  :root {
    color-scheme: ${({ theme }) => theme.name};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    /* Plus Jakarta Sans for everything — matches that Google design */
    font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 300ms ease, color 300ms ease;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    font-size: 15px;

    /* Subtle grid pattern */
    background-image: ${({ theme }) =>
      theme.name === 'dark'
        ? `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
           linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`
        : `linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
           linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)`};
    background-size: 44px 44px;
    background-attachment: fixed;
  }

  /* Headings use Plus Jakarta Sans — same as in the image */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  button { cursor: pointer; }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }

  /* Thin scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 99px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.muted};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

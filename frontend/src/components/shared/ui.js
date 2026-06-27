import styled, { keyframes } from 'styled-components';

/* ─── Animations ───────────────────────────────────────────────────── */
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

/* ─── Layout ───────────────────────────────────────────────────────── */
export const PageShell = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  gap: 18px;
  animation: ${fadeIn} 350ms ease both;

  @media (max-width: 768px) {
    padding: 0 14px;
    gap: 14px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    gap: 12px;
  }
`;

/* Card — shadow only, NO hard border */
export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.colors.border},
    0 4px 20px -4px ${({ theme }) => theme.colors.shadow};
  padding: 24px;
  transition: box-shadow 220ms ease, transform 220ms ease;

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 16px;
  }
`;

export const Section = styled(Card)`
  display: grid;
  gap: 20px;
`;

export const Heading = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
`;

export const SubtleText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.65;
  font-weight: 400;
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 580px) {
    flex-direction: column;
    align-items: stretch;
    & > * { width: 100%; }
  }
`;

export const Stack = styled.div`
  display: grid;
  gap: 12px;
`;

/* ─── Button ───────────────────────────────────────────────────────── */
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 20px;
  height: 40px;
  border-radius: 999px;           /* pill shape — Google style */
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  user-select: none;

  /* Variant: primary (default) */
  background: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return 'transparent';
    if ($variant === 'ghost') return 'transparent';
    if ($variant === 'danger') return theme.colors.danger;
    return theme.colors.primary;
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return theme.colors.text;
    if ($variant === 'ghost') return theme.colors.muted;
    if ($variant === 'danger') return '#fff';
    return theme.name === 'dark' ? '#0d0f12' : '#ffffff';
  }};
  box-shadow: ${({ $variant }) =>
    $variant === 'secondary' || $variant === 'ghost'
      ? '0 0 0 1.5px var(--btn-border, currentColor)'
      : 'none'};

  /* Ring for secondary/ghost */
  --btn-border: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return theme.colors.borderStrong;
    if ($variant === 'ghost') return theme.colors.border;
    return 'transparent';
  }};

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) => {
      if ($variant === 'secondary') return theme.colors.surfaceAlt;
      if ($variant === 'ghost') return theme.colors.surfaceAlt;
      if ($variant === 'danger') return '#b91c1c';
      return theme.colors.primaryHover;
    }};
    transform: translateY(-1px);
    box-shadow: ${({ $variant, theme }) =>
      $variant === 'secondary' || $variant === 'ghost'
        ? `0 0 0 1.5px ${theme.colors.borderStrong}, 0 4px 12px -3px ${theme.colors.shadow}`
        : `0 6px 20px -4px ${theme.colors.shadowMd}`};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  @media (max-width: 480px) {
    height: 44px;
    padding: 0 18px;
  }
`;

/* Compact icon-only round button */
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, transform 150ms ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
    transform: scale(1.08);
  }
`;

/* ─── Form controls ────────────────────────────────────────────────── */
const inputBase = `
  width: 100%;
  outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 160ms ease;
`;

export const Input = styled.input`
  ${inputBase}
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px -1px ${({ theme }) => theme.colors.shadow};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.7;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(124,140,248,0.18)' : 'rgba(91,106,240,0.14)'};
  }
`;

export const TextArea = styled.textarea`
  ${inputBase}
  min-height: 112px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px -1px ${({ theme }) => theme.colors.shadow};
  resize: vertical;
  line-height: 1.6;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.7;
  }

  &:hover { border-color: ${({ theme }) => theme.colors.borderStrong}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(124,140,248,0.18)' : 'rgba(91,106,240,0.14)'};
  }
`;

export const Select = styled.select`
  ${inputBase}
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(124,140,248,0.18)' : 'rgba(91,106,240,0.14)'};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(${({ $columns = 1 }) => $columns}, minmax(0, 1fr));

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Pill Chip / Badge ─────────────────────────────────────────────
   Matches the style in the reference image: subtle border, icon + text, pill shape
   ────────────────────────────────────────────────────────────────── */
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 13px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;

  /* Tinted background based on tone */
  background: ${({ $tone, theme }) => {
    if ($tone === 'success') return theme.colors.successBg;
    if ($tone === 'warning') return theme.colors.warningBg;
    if ($tone === 'danger')  return theme.colors.dangerBg;
    return theme.colors.surfaceAlt;
  }};
  color: ${({ $tone, theme }) => {
    if ($tone === 'success') return theme.colors.success;
    if ($tone === 'warning') return theme.colors.warning;
    if ($tone === 'danger')  return theme.colors.danger;
    return theme.colors.muted;
  }};

  /* Very subtle ring — like the chips in the image */
  box-shadow: 0 0 0 1px ${({ $tone, theme }) => {
    if ($tone === 'success') return 'rgba(13,158,110,0.25)';
    if ($tone === 'warning') return 'rgba(217,119,6,0.25)';
    if ($tone === 'danger')  return 'rgba(220,38,38,0.25)';
    return theme.colors.border;
  }};
`;

/* ─── Modal ─────────────────────────────────────────────────────────── */
const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 100;
  animation: ${fadeIn} 200ms ease both;

  @media (max-width: 600px) {
    padding: 0;
    align-items: flex-end;
  }
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  max-height: min(90vh, 860px);
  overflow-y: auto;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.colors.border},
    0 24px 64px -12px ${({ theme }) => theme.colors.shadowLg};
  padding: 28px;
  animation: ${scaleIn} 280ms cubic-bezier(0.34, 1.56, 0.64, 1) both;

  @media (max-width: 600px) {
    max-height: 92svh;
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    padding: 22px 16px 32px;
    animation: ${slideUp} 280ms cubic-bezier(0.4, 0, 0.2, 1) both;
  }
`;

/* ─── Divider ───────────────────────────────────────────────────────── */
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 2px 0;
`;

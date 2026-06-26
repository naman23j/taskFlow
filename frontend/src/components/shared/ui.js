import styled, { keyframes } from 'styled-components';

/* ─── Keyframes ─────────────────────────────────────────────────── */
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ─── Layout ─────────────────────────────────────────────────────── */
export const PageShell = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  gap: 24px;
  animation: ${fadeIn} 350ms ease both;

  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 16px;
  }
`;

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  box-shadow: 0 2px 16px -2px ${({ theme }) => theme.colors.shadow};
  padding: 24px;
  transition: transform 200ms ease, box-shadow 200ms ease;

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

export const Section = styled(Card)`
  display: grid;
  gap: 20px;
`;

export const Heading = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

export const SubtleText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
  line-height: 1.6;
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
    & > * {
      width: 100%;
    }
  }
`;

export const Stack = styled.div`
  display: grid;
  gap: 12px;
`;

/* ─── Button ─────────────────────────────────────────────────────── */
export const Button = styled.button`
  border: 1.5px solid ${({ $variant, theme }) => {
    if ($variant === 'secondary') return theme.colors.border;
    if ($variant === 'ghost') return 'transparent';
    return 'transparent';
  }};
  border-radius: 12px;
  padding: 10px 20px;
  min-height: 42px;
  min-width: 80px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  background: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return 'transparent';
    if ($variant === 'ghost') return 'transparent';
    if ($variant === 'danger') return theme.colors.danger;
    return theme.colors.primary;
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return theme.colors.text;
    if ($variant === 'ghost') return theme.colors.muted;
    if ($variant === 'danger') return 'white';
    return theme.name === 'dark' ? '#000000' : '#ffffff';
  }};
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  user-select: none;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.08);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) => {
      if ($variant === 'secondary') return theme.colors.surfaceAlt;
      if ($variant === 'ghost') return theme.colors.surfaceAlt;
      if ($variant === 'danger') return theme.colors.danger;
      return theme.colors.primaryHover;
    }};
    border-color: ${({ $variant, theme }) => {
      if ($variant === 'secondary') return theme.colors.muted;
      return 'transparent';
    }};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px -4px ${({ theme }) => theme.colors.shadow};

    &::after {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
    box-shadow: none;
  }

  @media (max-width: 480px) {
    min-height: 44px;
    padding: 10px 16px;
    font-size: 0.875rem;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: all 150ms ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* ─── Inputs ─────────────────────────────────────────────────────── */
export const Input = styled.input`
  width: 100%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 0.9rem;
  outline: none;
  transition: all 150ms ease;
  min-height: 44px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.55;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 9, 11, 0.06)'};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  transition: all 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.55;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 9, 11, 0.06)'};
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 0.9rem;
  outline: none;
  transition: all 150ms ease;
  min-height: 44px;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 9, 11, 0.06)'};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(${({ $columns = 1 }) => $columns}, minmax(0, 1fr));

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Badge ──────────────────────────────────────────────────────── */
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: capitalize;
  background: ${({ $tone, theme }) => {
    if ($tone === 'success') return 'rgba(16, 185, 129, 0.12)';
    if ($tone === 'warning') return 'rgba(245, 158, 11, 0.12)';
    if ($tone === 'danger') return 'rgba(239, 68, 68, 0.12)';
    return theme.colors.surfaceAlt;
  }};
  color: ${({ $tone, theme }) => {
    if ($tone === 'success') return theme.colors.success;
    if ($tone === 'warning') return theme.colors.warning;
    if ($tone === 'danger') return theme.colors.danger;
    return theme.colors.muted;
  }};
  border: 1px solid ${({ $tone, theme }) => {
    if ($tone === 'success') return 'rgba(16, 185, 129, 0.2)';
    if ($tone === 'warning') return 'rgba(245, 158, 11, 0.2)';
    if ($tone === 'danger') return 'rgba(239, 68, 68, 0.2)';
    return theme.colors.border;
  }};
`;

/* ─── Modal ──────────────────────────────────────────────────────── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 50;
  animation: ${fadeIn} 200ms ease both;
`;

export const ModalCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: min(90vh, 850px);
  overflow-y: auto;
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 32px;
  animation: ${scaleIn} 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both;

  @media (max-width: 600px) {
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
    padding: 24px 16px;
  }
`;

/* ─── Divider ─────────────────────────────────────────────────────── */
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

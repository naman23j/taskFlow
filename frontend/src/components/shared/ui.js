import styled from 'styled-components';

export const PageShell = styled.main`
  width: min(1180px, calc(100% - 24px));
  margin: 0 auto;
  display: grid;
  gap: 20px;
`;

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  box-shadow: 0 24px 60px ${({ theme }) => theme.colors.shadow};
  padding: 20px;
`;

export const Section = styled(Card)`
  display: grid;
  gap: 16px;
`;

export const Heading = styled.h1`
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 3rem);
  line-height: 1.05;
`;

export const SubtleText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
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
`;

export const Stack = styled.div`
  display: grid;
  gap: 12px;
`;

export const Button = styled.button`
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 700;
  transition: transform 120ms ease, background 120ms ease, color 120ms ease, opacity 120ms ease;
  background: ${({ $variant, theme }) => {
    if ($variant === 'secondary') return theme.colors.surfaceAlt;
    if ($variant === 'danger') return theme.colors.danger;
    return theme.colors.primary;
  }};
  color: ${({ $variant }) => ($variant === 'secondary' ? 'inherit' : 'white')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  &:hover {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) => ($variant === 'secondary' ? theme.colors.surfaceAlt : theme.colors.primaryHover)};
  }
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 12px 14px;
`;

export const Label = styled.label`
  display: grid;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 10px;
`;

export const FormRow = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(${({ $columns = 1 }) => $columns}, minmax(0, 1fr));

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 700;
  background: ${({ $tone, theme }) => {
    if ($tone === 'success') return 'rgba(34, 197, 94, 0.16)';
    if ($tone === 'warning') return 'rgba(245, 158, 11, 0.16)';
    if ($tone === 'danger') return 'rgba(248, 113, 113, 0.18)';
    return theme.colors.surfaceAlt;
  }};
  color: ${({ $tone, theme }) => {
    if ($tone === 'success') return theme.colors.success;
    if ($tone === 'warning') return theme.colors.warning;
    if ($tone === 'danger') return theme.colors.danger;
    return theme.colors.muted;
  }};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.62);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 50;
`;

export const ModalCard = styled(Card)`
  width: min(720px, 100%);
  max-height: min(90vh, 900px);
  overflow: auto;
`;

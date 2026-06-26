import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(37, 99, 235, 0.18);
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.9s linear infinite;
`;

function LoadingSpinner({ label = 'Loading' }) {
  return <Spinner aria-label={label} role="status" />;
}

export default LoadingSpinner;

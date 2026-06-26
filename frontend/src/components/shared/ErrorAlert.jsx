import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Alert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  animation: ${fadeIn} 250ms ease both;
`;

const AlertIcon = styled.span`
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
`;

function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Alert role="alert">
      <AlertIcon>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </AlertIcon>
      {message}
    </Alert>
  );
}

export default ErrorAlert;

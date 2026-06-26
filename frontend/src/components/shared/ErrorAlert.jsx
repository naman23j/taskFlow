import styled from 'styled-components';

const Alert = styled.div`
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.12);
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 16px;
  padding: 14px 16px;
`;

function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return <Alert role="alert">{message}</Alert>;
}

export default ErrorAlert;

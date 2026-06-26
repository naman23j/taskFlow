import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Button, FieldGroup, FormRow, Input, Label, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import ErrorAlert from '../shared/ErrorAlert';
import { isEmail } from '../../utils/validators';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AuthShell = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
`;

const AuthCard = styled(Section)`
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 400ms cubic-bezier(0.4, 0, 0.2, 1);
  padding: 40px 36px;
  border-radius: 24px;
  box-shadow: 0 8px 40px -8px ${({ theme }) => theme.colors.shadow};

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 18px;
  }
`;

const LogoMark = styled.div`
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#000' : '#fff')};
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 1.4rem;
  margin-bottom: 4px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  display: flex;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
  z-index: 1;
`;

const IconInput = styled(Input)`
  padding-left: 42px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
  font-weight: 500;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!form.email || !form.password) {
      setLocalError('Email and password are required');
      return;
    }

    if (!isEmail(form.email)) {
      setLocalError('Enter a valid email address');
      return;
    }

    await login(form.email, form.password);
    navigate(location.state?.returnTo || '/dashboard');
  };

  return (
    <AuthShell>
      <AuthCard>
        <Stack style={{ gap: '24px' }}>
          <Stack style={{ gap: '8px' }}>
            <LogoMark>T</LogoMark>
            <PageTitle>Welcome back</PageTitle>
            <SubtleText>Sign in to manage your boards and tasks.</SubtleText>
          </Stack>

          <ErrorAlert message={localError || error} />

          <form onSubmit={handleSubmit}>
            <Stack style={{ gap: '20px' }}>
              <FieldGroup>
                <Label>
                  Email address
                  <InputWrapper>
                    <InputIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </InputIcon>
                    <IconInput
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      id="login-email"
                      autoComplete="email"
                    />
                  </InputWrapper>
                </Label>
                <Label>
                  Password
                  <InputWrapper>
                    <InputIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </InputIcon>
                    <IconInput
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      id="login-password"
                      autoComplete="current-password"
                    />
                  </InputWrapper>
                </Label>
              </FieldGroup>

              <Button type="submit" disabled={loading} id="login-submit-btn" style={{ width: '100%', minHeight: '48px', fontSize: '1rem' }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In
                  </>
                )}
              </Button>

              <Divider>or</Divider>

              <Button
                type="button"
                $variant="secondary"
                onClick={() => navigate('/register')}
                id="go-to-register-btn"
                style={{ width: '100%', minHeight: '44px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Create an account
              </Button>
            </Stack>
          </form>
        </Stack>
      </AuthCard>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthShell>
  );
}

export default LoginPage;

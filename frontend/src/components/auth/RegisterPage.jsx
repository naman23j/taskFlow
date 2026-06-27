import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FieldGroup, Input, SubtleText } from '../shared/ui';

const rise = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const Spin = keyframes`to { transform: rotate(360deg); }`;

const Centering = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.colors.border},
    0 24px 60px -12px ${({ theme }) => theme.colors.shadowLg};
  padding: 40px 36px;
  animation: ${rise} 440ms cubic-bezier(0.34, 1.4, 0.64, 1) both;

  @media (max-width: 480px) {
    padding: 28px 22px;
    border-radius: 22px;
  }
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#0d0f12' : '#fff')};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 900;
  font-size: 1.3rem;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px -4px ${({ theme }) => theme.colors.shadowMd};
`;

const PageTitle = styled.h1`
  margin: 0 0 6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const FormLabel = styled.label`
  display: grid;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const InputWrap = styled.div`
  position: relative;
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
  input { padding-left: 42px; }
`;

const MainBtn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => (theme.name === 'dark' ? '#0d0f12' : '#fff')};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.93rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 180ms ease;
  box-shadow: 0 4px 18px -4px ${({ theme }) => theme.colors.shadowMd};
  &:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: all 160ms ease;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover}; }
`;

const OrSep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: ${({ theme }) => theme.colors.border}; }
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.82rem;
  font-weight: 500;
  box-shadow: 0 0 0 1px rgba(220,38,38,0.2);
`;

const Spinner = styled.span`
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  animation: ${Spin} 0.7s linear infinite;
`;

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Centering>
      <Card>
        <Logo>T</Logo>
        <PageTitle>Create account</PageTitle>
        <SubtleText style={{ marginBottom: '28px' }}>
          Join TaskFlow to manage projects with AI-powered estimates.
        </SubtleText>

        {error && (
          <ErrorBox style={{ marginBottom: '16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </ErrorBox>
        )}

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FormLabel>
              Full Name
              <InputWrap>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <Input id="name" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required autoComplete="name" />
              </InputWrap>
            </FormLabel>

            <FormLabel>
              Email address
              <InputWrap>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <Input id="email" type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
              </InputWrap>
            </FormLabel>

            <FormLabel>
              Password
              <InputWrap>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <Input id="password" type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" />
              </InputWrap>
            </FormLabel>

            <FormLabel>
              Confirm Password
              <InputWrap>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <Input id="confirm" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" />
              </InputWrap>
            </FormLabel>

            <MainBtn type="submit" disabled={loading} id="register-submit-btn">
              {loading ? <Spinner /> : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  Create Account
                </>
              )}
            </MainBtn>
          </FieldGroup>
        </form>

        <OrSep style={{ margin: '20px 0' }}>already have an account?</OrSep>

        <SecondaryBtn type="button" onClick={() => navigate('/login')} id="go-login-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Back to Sign In
        </SecondaryBtn>
      </Card>
    </Centering>
  );
}

export default RegisterPage;

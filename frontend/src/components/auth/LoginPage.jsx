import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Button, FieldGroup, Input, Label, Stack, SubtleText } from '../shared/ui';
import authIllustration from '../../assets/auth_illustration.jpg';

const rise = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  width: 100vw;
  background: ${({ theme }) => theme.colors.bg};
  padding: 12px 16px;
`;

const AuthCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 960px;
  height: 540px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 24px 60px -12px ${({ theme }) => theme.colors.shadowLg};
  overflow: hidden;
  animation: ${rise} 440ms cubic-bezier(0.34, 1.4, 0.64, 1) both;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    max-width: 440px;
  }
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 48px;
  overflow-y: auto;
  order: ${({ $order }) => $order || 2};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)'};
    border-radius: 99px;
  }

  @media (max-width: 900px) {
    order: 1 !important;
    padding: 20px 24px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 360px;
  margin: auto 0;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
`;

const ImageSide = styled.div`
  flex: 1;
  position: relative;
  order: ${({ $order }) => $order || 1};
  overflow: hidden;
  background: #ffffff;

  @media (max-width: 900px) {
    display: none;
  }
`;

const IllustrationImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const PageTitle = styled.h1`
  margin: 0 0 4px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

/* Labelled wrapper matching the clean style */
const FormLabel = styled.label`
  display: grid;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

/* Input with left-side icon inset */
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

  input {
    padding-left: 42px;
  }
`;

const MainBtn = styled.button`
  width: 100%;
  height: 40px;
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

  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px -6px ${({ theme }) => theme.colors.shadowLg};
  }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  height: 38px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: all 160ms ease;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.colors.borderStrong};
  }
`;

const OrSep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
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

const Spin = keyframes`to { transform: rotate(360deg); }`;
const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  animation: ${Spin} 0.7s linear infinite;
`;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <ImageSide $order={1}>
          <IllustrationImg src={authIllustration} alt="Workspace Illustration" />
        </ImageSide>

        <FormSide $order={2}>
          <FormContainer>
            <PageTitle>Welcome back</PageTitle>
            <SubtleText style={{ marginBottom: '28px' }}>
              Sign in to manage your boards and tasks.
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
                  Email address
                  <InputWrap>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                      required
                      autoComplete="email"
                    />
                  </InputWrap>
                </FormLabel>

                <FormLabel>
                  Password
                  <InputWrap>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={set('password')}
                      required
                      autoComplete="current-password"
                    />
                  </InputWrap>
                </FormLabel>

                <MainBtn type="submit" disabled={loading} id="login-submit-btn">
                  {loading ? <Spinner /> : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                      Sign In
                    </>
                  )}
                </MainBtn>
              </FieldGroup>
            </form>

            <OrSep style={{ margin: '20px 0' }}>or</OrSep>

            <SecondaryBtn type="button" onClick={() => navigate('/register')} id="go-register-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Create an account
            </SecondaryBtn>
          </FormContainer>
        </FormSide>
      </AuthCard>
    </PageWrapper>
  );
}

export default LoginPage;

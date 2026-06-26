import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, FieldGroup, FormRow, Input, Label, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import ErrorAlert from '../shared/ErrorAlert';
import { isEmail } from '../../utils/validators';

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
    <PageShell>
      <Section>
        <Stack>
          <h1 style={{ margin: 0 }}>Welcome back</h1>
          <SubtleText>Sign in to manage your boards and tasks.</SubtleText>
          <ErrorAlert message={localError || error} />
          <form onSubmit={handleSubmit}>
            <Stack>
              <FieldGroup>
                <Label>
                  Email
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                </Label>
                <Label>
                  Password
                  <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
                </Label>
              </FieldGroup>
              <FormRow $columns={2}>
                <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
                <Button type="button" $variant="secondary" onClick={() => navigate('/register')}>Create account</Button>
              </FormRow>
            </Stack>
          </form>
        </Stack>
      </Section>
    </PageShell>
  );
}

export default LoginPage;

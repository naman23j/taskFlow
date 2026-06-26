import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, FieldGroup, FormRow, Input, Label, PageShell, Section, Stack, SubtleText } from '../shared/ui';
import ErrorAlert from '../shared/ErrorAlert';
import { isEmail, isStrongPassword } from '../../utils/validators';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
      setLocalError('All fields are required');
      return;
    }

    if (!isEmail(form.email)) {
      setLocalError('Enter a valid email address');
      return;
    }

    if (!isStrongPassword(form.password)) {
      setLocalError('Password must be at least 8 characters and include uppercase, lowercase, and a number');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setLocalError('Passwords do not match');
      return;
    }

    await register(form.name, form.email, form.password, form.passwordConfirm);
    navigate('/dashboard');
  };

  return (
    <PageShell>
      <Section>
        <Stack>
          <h1 style={{ margin: 0 }}>Create your account</h1>
          <SubtleText>TaskFlow stores all data on the server and secures access with JWT authentication.</SubtleText>
          <ErrorAlert message={localError || error} />
          <form onSubmit={handleSubmit}>
            <Stack>
              <FieldGroup>
                <Label>
                  Name
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
                </Label>
                <Label>
                  Email
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                </Label>
                <Label>
                  Password
                  <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" />
                </Label>
                <Label>
                  Confirm Password
                  <Input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} placeholder="Repeat your password" />
                </Label>
              </FieldGroup>
              <FormRow $columns={2}>
                <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
                <Button type="button" $variant="secondary" onClick={() => navigate('/login')}>Back to login</Button>
              </FormRow>
            </Stack>
          </form>
        </Stack>
      </Section>
    </PageShell>
  );
}

export default RegisterPage;

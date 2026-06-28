import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Button, Input, Label, ModalCard, ModalOverlay, Stack } from '../shared/ui';

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 4px;
  border-radius: 12px;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  flex: 1;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.text : theme.colors.muted)};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 150ms ease;
  box-shadow: ${({ $active, theme }) => ($active ? `0 2px 6px ${theme.colors.shadow}` : 'none')};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 20px;
`;

const LargeAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(135deg, #5b6af0, #8b5cf6)'
      : 'linear-gradient(135deg, #1a1a2e, #4a5568)'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  box-shadow: 0 4px 16px ${({ theme }) => theme.colors.shadowMd};
  border: 3px solid ${({ theme }) => theme.colors.surface};
`;

const UserEmail = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
  transition: transform 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const StatValue = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatusBreakdown = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  text-align: center;
`;

const StatusCount = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme, $status }) => {
    if ($status === 'todo') return theme.colors.muted;
    if ($status === 'in-progress') return theme.colors.warning;
    if ($status === 'done') return theme.colors.success;
    return theme.colors.text;
  }};
`;

const StatusLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const Alert = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
  background: ${({ $type, theme }) => ($type === 'success' ? theme.colors.successBg : theme.colors.dangerBg)};
  color: ${({ $type, theme }) => ($type === 'success' ? theme.colors.success : theme.colors.danger)};
  border: 1px solid ${({ $type, theme }) => ($type === 'success' ? 'rgba(13,158,110,0.15)' : 'rgba(220,38,38,0.15)')};
`;

const HelpText = styled.p`
  margin: 4px 0 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    & > * { width: 100%; }
  }
`;

const NameEditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 320px;
`;

const UserNameText = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const EditIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`;

function ProfileModal({ open, onClose }) {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'security'

  // Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  // Password State
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [pwdSaving, setPwdSaving] = useState(false);

  // Feedback Alerts
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Init Form Values
  useEffect(() => {
    if (open && user) {
      setNameVal(user.name);
      setIsEditingName(false);
      setAlert({ type: '', message: '' });
      setActiveTab('overview');
      setPwdForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
    }
  }, [open, user]);

  // Load User Stats
  useEffect(() => {
    if (open) {
      setLoadingStats(true);
      authService
        .getStats()
        .then((res) => {
          setStats(res.stats);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoadingStats(false);
        });
    }
  }, [open]);

  if (!open) return null;

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const handleNameSave = async () => {
    const trimmed = nameVal.trim();
    if (!trimmed) {
      setAlert({ type: 'error', message: 'Name cannot be empty' });
      return;
    }
    if (trimmed === user.name) {
      setIsEditingName(false);
      return;
    }

    setNameSaving(true);
    setAlert({ type: '', message: '' });
    try {
      await authService.updateProfile({ name: trimmed });
      await refreshUser();
      setIsEditingName(false);
      setAlert({ type: 'success', message: 'Name updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update name' });
    } finally {
      setNameSaving(false);
    }
  };

  const handlePwdChange = (e) => {
    setPwdForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.newPasswordConfirm) {
      setAlert({ type: 'error', message: 'All fields are required' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.newPasswordConfirm) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setPwdSaving(true);
    setAlert({ type: '', message: '' });
    try {
      await authService.updateProfile({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
        newPasswordConfirm: pwdForm.newPasswordConfirm,
      });
      setPwdForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
      setAlert({ type: 'success', message: 'Password updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalCard style={{ maxWidth: '480px' }}>
        <Stack style={{ gap: '14px' }}>
          <ModalHeader>
            <ModalTitle>Account Settings</ModalTitle>
            <CloseButton type="button" onClick={onClose} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </ModalHeader>

          <TabList>
            <TabButton type="button" $active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setAlert({ type: '', message: '' }); }}>
              Overview
            </TabButton>
            <TabButton type="button" $active={activeTab === 'security'} onClick={() => { setActiveTab('security'); setAlert({ type: '', message: '' }); }}>
              Security
            </TabButton>
          </TabList>

          {alert.message && (
            <Alert $type={alert.type}>
              {alert.type === 'success' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {alert.message}
            </Alert>
          )}

          {activeTab === 'overview' && (
            <>
              <ProfileHeader>
                <LargeAvatar>{initials}</LargeAvatar>
                {isEditingName ? (
                  <NameEditContainer>
                    <Input
                      type="text"
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      placeholder="Your Name"
                      disabled={nameSaving}
                      style={{ height: '36px', padding: '0 10px', fontSize: '0.85rem' }}
                      autoFocus
                    />
                    <Button type="button" onClick={handleNameSave} disabled={nameSaving} style={{ height: '36px', padding: '0 14px', borderRadius: '10px' }}>
                      {nameSaving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button type="button" $variant="secondary" onClick={() => { setIsEditingName(false); setNameVal(user.name); }} disabled={nameSaving} style={{ height: '36px', padding: '0 14px', borderRadius: '10px' }}>
                      Cancel
                    </Button>
                  </NameEditContainer>
                ) : (
                  <NameEditContainer>
                    <UserNameText>{user?.name}</UserNameText>
                    <EditIconButton type="button" onClick={() => setIsEditingName(true)} aria-label="Edit Name">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </EditIconButton>
                  </NameEditContainer>
                )}
                <UserEmail>{user?.email}</UserEmail>
              </ProfileHeader>

              {loadingStats ? (
                <LoadingContainer>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Loading statistics…</span>
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </LoadingContainer>
              ) : (
                <>
                  <StatsGrid>
                    <StatCard>
                      <StatValue>{stats?.boardsCount ?? 0}</StatValue>
                      <StatLabel>Total Boards</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>{stats?.tasks?.total ?? 0}</StatValue>
                      <StatLabel>Total Tasks</StatLabel>
                    </StatCard>
                  </StatsGrid>

                  <Label style={{ fontSize: '0.72rem', marginBottom: '4px' }}>Task Breakdown By Status</Label>
                  <StatusBreakdown>
                    <StatusItem>
                      <StatusCount $status="todo">{stats?.tasks?.todo ?? 0}</StatusCount>
                      <StatusLabel>To Do</StatusLabel>
                    </StatusItem>
                    <StatusItem>
                      <StatusCount $status="in-progress">{stats?.tasks?.inProgress ?? 0}</StatusCount>
                      <StatusLabel>In Progress</StatusLabel>
                    </StatusItem>
                    <StatusItem>
                      <StatusCount $status="done">{stats?.tasks?.done ?? 0}</StatusCount>
                      <StatusLabel>Completed</StatusLabel>
                    </StatusItem>
                  </StatusBreakdown>
                </>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePwdSubmit}>
              <Stack style={{ gap: '12px' }}>
                <Label>
                  Current Password
                  <Input
                    type="password"
                    name="currentPassword"
                    value={pwdForm.currentPassword}
                    onChange={handlePwdChange}
                    placeholder="Enter current password"
                    required
                    disabled={pwdSaving}
                  />
                </Label>

                <Label>
                  New Password
                  <Input
                    type="password"
                    name="newPassword"
                    value={pwdForm.newPassword}
                    onChange={handlePwdChange}
                    placeholder="At least 8 characters"
                    required
                    disabled={pwdSaving}
                  />
                  <HelpText>Must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number.</HelpText>
                </Label>

                <Label>
                  Confirm New Password
                  <Input
                    type="password"
                    name="newPasswordConfirm"
                    value={pwdForm.newPasswordConfirm}
                    onChange={handlePwdChange}
                    placeholder="Re-type new password"
                    required
                    disabled={pwdSaving}
                  />
                </Label>

                <ButtonRow>
                  <Button type="submit" disabled={pwdSaving || !pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.newPasswordConfirm}>
                    {pwdSaving ? (
                      <>
                        <svg style={{ animation: 'spin 0.9s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Updating…
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Change Password
                      </>
                    )}
                  </Button>
                </ButtonRow>
              </Stack>
            </form>
          )}
        </Stack>
      </ModalCard>
    </ModalOverlay>
  );
}

export default ProfileModal;

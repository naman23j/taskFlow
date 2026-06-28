import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/shared/Header';
import NotFound from './components/404/NotFound';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage from './pages/BoardPage';
import { GlobalStyles } from './styles/GlobalStyles';
import { useTheme } from './context/ThemeContext';

function App() {
  const { themeStyles } = useTheme();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const appShellStyle = isAuthPage
    ? {
        ...themeStyles.appShell,
        paddingBottom: '0px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }
    : themeStyles.appShell;

  return (
    <>
      <GlobalStyles />
      <div style={appShellStyle}>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/boards/:boardId"
            element={(
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

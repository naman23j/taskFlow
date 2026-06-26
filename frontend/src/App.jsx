import { Navigate, Route, Routes } from 'react-router-dom';
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

  return (
    <>
      <GlobalStyles />
      <div style={themeStyles.appShell}>
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

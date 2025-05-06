import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from './components/authContext';

import { App } from './App';
import { LoginPage } from './pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';
import { RequireNonAuth } from './components/RequireNonAuth';

import { RoomPage } from './pages/RoomPage';
import { RoomsPage } from './pages/RoomsPage';

export const Root = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<App />}>
            <Route element={<RequireAuth />}>
              <Route index element={<RoomsPage />} />
              <Route path=":id" element={<RoomPage />} />
            </Route>

            <Route element={<RequireNonAuth />}>
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

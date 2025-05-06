import { Loader } from './Loader';
import { useAuth } from './authContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { isChecked, currentUser } = useAuth();

  if (!isChecked) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
};

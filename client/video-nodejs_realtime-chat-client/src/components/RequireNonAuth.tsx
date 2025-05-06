import { Loader } from './Loader';
import { useAuth } from './authContext';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireNonAuth = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { isChecked, currentUser } = useAuth();

  if (!isChecked) {
    return <Loader />;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
};

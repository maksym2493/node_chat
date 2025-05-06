import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.css';
import './App.css';

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader } from './components/Loader';
import { useAuth } from './components/authContext';
import { usePageError } from './hooks/usePageError';

export function App() {
  const [error] = usePageError('');
  const { isChecked, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <main>
      <section className="section">
        <Outlet />
      </section>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </main>
  );
}

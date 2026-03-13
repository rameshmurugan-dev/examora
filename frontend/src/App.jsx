/**
 * Root Application Component.
 * Sets up routing and global context providers.
 */
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import AppRoutes from './core/routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

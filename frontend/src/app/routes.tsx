import { createBrowserRouter } from 'react-router';
import { PublicView } from './components/PublicView';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicView,
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin/panel',
    Component: AdminPanel,
  },
  {
    path: '*',
    Component: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Page not found</p>
          <a href="/" className="text-blue-600 hover:underline">
            Go back home
          </a>
        </div>
      </div>
    ),
  },
]);

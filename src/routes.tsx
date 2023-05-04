import React, { lazy, Suspense } from 'react';
// import Chat from "./pages/chat";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';

const Chat = lazy(() => import('./pages/chat'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/chat',
    element: (
      <Suspense>
        <Chat />
      </Suspense>
    ),
  },
]);

export default router;

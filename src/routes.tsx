import React, { lazy, Suspense } from 'react';
// import Chat from "./pages/chat";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { Path } from '@/constant';
// import { Chat } from './pages/chat';
// import RenameIcon from '@/assets/icons/rename.svg';
const Chat = lazy(() => import('./pages/chat/index'));
const Chat2 = lazy(() => import('./pages/chat2/index'));
const Dot = lazy(() => import('./pages/dot/index'));
const Settings = lazy(() => import('./pages/settings/index'));
const NewChat = lazy(() => import('./pages/new-chat/index'));
const MaskPage = lazy(() => import('./pages/mask/index'));
const Authentication = lazy(() => import('./pages/authentication/index'));
const Agreement = lazy(() => import('./pages/agreement/index'));
// const router = createBrowserRouter([
//   {
//     path: '/',
//     // element: <Home />,
//     element: (
//       <>
//         <img src={RenameIcon} alt="" />
//       </>
//     ),
//   },
//   {
//     path: '/chat',
//     element: (
//       <Suspense>
//         <Chat />
//       </Suspense>
//     ),
//   },
// ]);

// export default router;

const RoutesCom = () => {
  return (
    <Routes>
      <Route
        path={Path.NewChat}
        element={
          <Suspense>
            <NewChat />
          </Suspense>
        }
      />
      <Route
        path={Path.Masks}
        element={
          <Suspense>
            <MaskPage />
          </Suspense>
        }
      />
      <Route
        path={Path.Chat}
        element={
          <Suspense>
            <Chat />
          </Suspense>
        }
      />
      <Route
        path={Path.Settings}
        element={
          <Suspense>
            <Settings />
          </Suspense>
        }
      />
      {/* <Route
        path={'/dot'}
        element={
          <Suspense>
            <Dot />
          </Suspense>
        }
      /> */}
      <Route
        path={'/chat2'}
        element={
          <Suspense>
            <Chat2 />
          </Suspense>
        }
      />
      <Route
        path={'/authentication'}
        element={
          <Suspense>
            <Authentication />
          </Suspense>
        }
      />
      <Route
        path={'/agreement'}
        element={
          <Suspense>
            <Agreement />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default RoutesCom;

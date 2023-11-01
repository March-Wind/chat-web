import React, { lazy, Suspense, useEffect } from 'react';
// import Chat from "./pages/chat";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { usePersonStore } from './store/person';
import Home from './pages/home';
import { Path } from '@/constant';
// import { Chat } from './pages/chat';
// import RenameIcon from '@/assets/icons/rename.svg';
const Chat = lazy(() => import('./pages/chat/index'));
// const Chat = lazy(() => import(/* webpackChunkName: "chat" */ './pages/chat/index'));
const Chat2 = lazy(() => import(/* webpackChunkName: "cha2t" */ './pages/chat2/index'));
// const Dot = lazy(() => import('./pages/dot/index'));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ './pages/settings/index'));
const NewChat = lazy(() => import(/* webpackChunkName: "new-chat" */ './pages/new-chat/index'));
const MaskPage = lazy(() => import(/* webpackChunkName: "mask" */ './pages/mask/index'));
const Authentication = lazy(() => import(/* webpackChunkName: "authentication" */ './pages/authentication/index'));
const Agreement = lazy(() => import(/* webpackChunkName: "agreement" */ './pages/agreement/index'));
import { basename } from '@/env';
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
  const { token } = usePersonStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/authentication?type=login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Routes>
      <Route
        path={Path.Home}
        element={
          <Suspense>
            <Chat />
          </Suspense>
        }
      />
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

{
  /* <Route
        path={'/dot'}
        element={
          <Suspense>
            <Dot />
          </Suspense>
        }
      /> */
}

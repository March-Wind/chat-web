import React, { lazy, Suspense } from 'react';
// import Chat from "./pages/chat";
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { Path } from '@/constant';
import { Chat } from './pages/chat';
import RenameIcon from "@/assets/icons/rename.svg";
// const Chat = lazy(() => import('./pages/chat'));
const router = createBrowserRouter([
  {
    path: '/',
    // element: <Home />,
    element: <><img src={RenameIcon} alt="" /></>,
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
// const RoutesCom = () => {

//   return <Routes>
//     <Route path={Path.Home} element={<>nihao</>} />
//     {/* <Route path={Path.NewChat} element={<NewChat />} /> */}
//     {/* <Route path={Path.Masks} element={<MaskPage />} /> */}
//     <Route path={Path.Chat} element={<Chat />} />
//     {/* <Route path={Path.Settings} element={<Settings />} /> */}
//   </Routes>
// }
// export {
//   RoutesCom
// }
export default router;

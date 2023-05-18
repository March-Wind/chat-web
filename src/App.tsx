import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { RouterProvider, useLocation, createBrowserRouter, Link } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';
import { useMobileScreen } from '@/hooks/useWindowSize';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Path, SlotID } from '@/constant';
import { SideBar } from '@/components/common/sidebar';
import './app.scss';
import styles from "./app.module.scss";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <div>
//         <h1>Hello World</h1>
//       </div>
//     ),
//   },
//   {
//     path: "about",
//     element: <div>About</div>,
//   },
// ]);
const App = () => {
  useSwitchTheme();
  const config = useAppConfig();
  // const location = useLocation();
  // const isHome = location.pathname === Path.Home;
  // const isHome = true;
  const isMobileScreen = useMobileScreen();
  // useEffect(() => {


  // }, [])
  return (
    <div
      className={
        styles.container +
        ` ${config.tightBorder && !isMobileScreen
          ? styles["tight-container"]
          : styles.container
        }`
      }
    >
      {/* <SideBar className={isHome ? styles["sidebar-show"] : ""} /> */}

      <div className={styles["window-content"]} id={SlotID.AppBody}>
        <Provider store={store}>
          {/* <Routes /> */}
          <RouterProvider router={router} />
        </Provider>
      </div>
    </div>
  )

  // return (
  //   <BrowserRouter>

  //   </BrowserRouter>
  // )

  // return (
  //   <>
  //     <RouterProvider router={router} />
  //     <>你好132342</>
  //   </>
  // )
}


// ReactDOM.render(<App />,
//   document.getElementById('root'),
// );
const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);

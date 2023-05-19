import React, { FC, lazy, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useLocation, BrowserRouter } from 'react-router-dom';
import RoutesCom from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';
import { useMobileScreen } from '@/hooks/useWindowSize';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Path, SlotID } from '@/constant';
import { SideBar } from '@/components/common/sidebar';
import styles from './app.module.scss';
import './app.scss';
import './assets/styles/globals.scss';
import './assets/styles/markdown.scss';
import './assets/styles/highlight.scss';

const PageLayout: FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props;
  useSwitchTheme();
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();
  return (
    <div
      className={
        styles.container + ` ${config.tightBorder && !isMobileScreen ? styles['tight-container'] : styles.container}`
      }
    >
      <SideBar className={isHome ? styles['sidebar-show'] : ''} />
      <div className={styles['window-content']} id={SlotID.AppBody}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <PageLayout>
        <Provider store={store}>
          <RoutesCom />
        </Provider>
      </PageLayout>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);

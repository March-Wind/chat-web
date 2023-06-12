import React, { FC } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useLocation, BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import RoutesCom from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';
import { useMobileScreen } from '@/hooks/useWindowSize';
import { useAppConfig } from '@/store/config';
import { Path, SlotID } from '@/constant';
import { SideBar } from '@/components/common/sidebar';
import styles from './app.module.scss';
import './app.scss';
import './assets/styles/globals.scss';
import './assets/styles/markdown.scss';
import './assets/styles/highlight.scss';

const PageLayout: FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props;
  const { appTheme } = useSwitchTheme();
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();
  const darkTheme = {
    token: {
      colorPrimary: '#111d2c',
    }
  }
  return (
    <ConfigProvider
      theme={appTheme === 'light' ? {
        algorithm: theme.defaultAlgorithm,
      } : darkTheme}
    >
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
    </ConfigProvider>

  );
};

const App = () => {
  return <BrowserRouter>
    <PageLayout>
      <Provider store={store}>
        <RoutesCom />
      </Provider>
    </PageLayout>
  </BrowserRouter>
};

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);
console.log(process.env.LZY)
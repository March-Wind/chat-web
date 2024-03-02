import React, { useState, useLayoutEffect } from 'react';
import type { FC } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import type { BrowserHistory } from 'history';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import RoutesCom from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { history } from './history';
import useAntd from '@/components/common/antd';
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
import { basename } from './env';

const Content: FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props;
  useAntd();
  const config = useAppConfig();
  // const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();
  return (
    <div
      className={
        styles.container + ` ${config.tightBorder && !isMobileScreen ? styles['tight-container'] : styles.container}`
      }
    >
      <SideBar
      // className={isHome ? styles['sidebar-show'] : ''}
      />
      <div className={styles['window-content']} id={SlotID.AppBody}>
        {children}
      </div>
    </div>
  );
};

const AntdWrap: FC<{ children: React.ReactNode }> = (props) => {
  const { appTheme } = useSwitchTheme();
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#111d2c',
      colorBgBase: '#fff',
      // colorFillContent: '#fff',
      colorTextBase: 'rgba(0, 0, 0, 0.88)',
      boxShadow:
        '0 1px 2px -2px rgba(255, 255, 255, 0.6), 0 3px 6px 0 rgba(255, 255, 255, 0.2), 0 5px 12px 4px rgba(255, 255, 255, 0.2)',
      // colorTextHeading: 'red', // 控制input前label的字体颜色
      // colorInfo: 'red',
      // colorTextDescription: 'red', //
      // colorTextLightSolid: 'red', // 控制button里面的字颜色
      // colorTextLabel: 'red',
      boxShadowSecondary:
        '0 1px 2px -2px rgba(255, 255, 255, 0.16), 0 3px 6px 0 rgba(255, 255, 255, 0.12), 0 5px 12px 4px rgba(255, 255, 255, 0.09)',
      boxShadowTertiary:
        '0 1px 2px -2px rgba(255, 255, 255, 0.16), 0 3px 6px 0 rgba(255, 255, 255, 0.12), 0 5px 12px 4px rgba(255, 255, 255, 0.09)',
    },
  };
  return (
    <ConfigProvider
      theme={
        appTheme === 'light'
          ? {
              algorithm: theme.defaultAlgorithm,
              token: {
                colorPrimary: 'rgb(29, 147, 171)',
                // colorTextBase: 'rgba(0, 0, 0, 0.88)',
                // colorTextBase: 'rgba(255, 255, 255, 0.88)',
              },
            }
          : darkTheme
      }
    >
      <AntdApp style={{ height: '100%' }}>
        <Content {...props} />
      </AntdApp>
    </ConfigProvider>
  );
};
const CustomRouter: FC<{ history: BrowserHistory; children: React.ReactNode }> = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
      basename={basename}
    />
  );
};
const App = () => {
  return (
    <CustomRouter history={history}>
      <AntdWrap>
        <Provider store={store}>
          <RoutesCom />
        </Provider>
      </AntdWrap>
    </CustomRouter>
  );

  // return <BrowserRouter>
  //   <AntdWrap>
  //     <Provider store={store}>
  //       <RoutesCom />
  //     </Provider>
  //   </AntdWrap>
  // </BrowserRouter>
};

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);

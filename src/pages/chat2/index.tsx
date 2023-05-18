import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState, AppDispatch, useAppSelector, useAppDispatch } from '../../store/index';
import { decrement, increment, incrementByAmount, setApiData } from '../../store/home';
import axios from 'axios';
import marked from 'marked';
import PageLayout from '@/components/chat/page-layout/index';
import cn from './index.module.scss';
import { ChatMessages } from '@/types';
type HomeStore = RootState['home'];
type HomeDispatch = ReturnType<typeof mapDispatchToProps>;

function App(props: HomeStore & HomeDispatch) {
  console.log(111, props);
  const { value, increment, decrement } = props;
  const [history, setHistory] = useState<ChatMessages>([]);
  useEffect(() => {

  }, []);
  // return (
  //   <div className={cn.home_box}>
  //     <h1>来聊天吧</h1>
  //   </div>
  // );
  return (
    <PageLayout>
      <div className={cn['home_box']}>nihao</div>
    </PageLayout>
  );
}
const mapStateToProps = ({ home }: RootState): HomeStore => {
  return home;
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    // dispatching plain actions
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    incrementByAmount: () => dispatch(incrementByAmount(3)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState, AppDispatch, useAppSelector, useAppDispatch } from '../../store/index';
import { decrement, increment, incrementByAmount, setApiData } from '../../store/home';
import cn from './index.module.scss';
import image from '../../assets/1.jpeg';
type HomeStore = RootState['home'];
type HomeDispatch = ReturnType<typeof mapDispatchToProps>;

function App(props: HomeStore & HomeDispatch) {
  console.log(111, props);
  const { value, increment, decrement } = props;
  // return (
  //   <div className={cn.home_box}>
  //     <h1>来聊天吧</h1>
  //   </div>
  // );
  return <div>你好</div>;
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

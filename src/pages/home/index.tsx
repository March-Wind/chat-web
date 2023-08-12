import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  RootState,
  //  AppDispatch, useAppSelector, useAppDispatch
} from '../../store/index';
import { decrement, increment, incrementByAmount } from '../../store/home';
import cn from './index.module.scss';
import image from '../../assets/1.jpeg';
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
type HomeStore = RootState['home'];
type HomeDispatch = ReturnType<typeof mapDispatchToProps>;

function App(props: HomeStore & HomeDispatch) {
  const { value, increment, decrement } = props;
  const navigate = useNavigate();
  return (
    <div className={cn.home_box}>
      <h1 onClick={() => navigate('/chat')}>去聊天1</h1>
      <h1 onClick={() => navigate('/chat')}>去聊天122232123212312</h1>
      <div>count:{value}</div>
      <div onClick={increment}>+</div>
      <div onClick={decrement}>-</div>
      <div>
        标签引用图片
        <img className={cn.img} src={image} alt="" />
      </div>
      <div className={cn.div_bg}>背景引用图片1</div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

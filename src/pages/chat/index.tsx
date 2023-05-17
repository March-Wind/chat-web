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
    // 用ts写一个sum函数
    const fetchStream = (url: string, params: any) => {
      const { onmessage, onclose, ...otherParams } = params;

      const push = async (controller: any, reader: any) => {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          onclose?.();
        } else {
          onmessage?.(new TextDecoder().decode(value));
          controller.enqueue(value);
          push(controller, reader);
        }
      };
      // 发送请求
      return fetch(url, otherParams)
        .then((response: any) => {
          // 以ReadableStream解析数据
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              push(controller, reader);
            },
          });
          return stream;
        })
        .then((stream) => new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text());
    };
    fetchStream('http://127.0.0.1:4001/playchat', {
      method: 'POST',
      body: JSON.stringify({ msg: '你好' }),
      headers: {
        accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      onmessage: (res: any) => {
        // todo

        console.log(11, res);
      },
    });
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

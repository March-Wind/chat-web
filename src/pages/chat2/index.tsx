import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  RootState,
  // AppDispatch, useAppSelector, useAppDispatch
} from '../../store/index';
import { decrement, increment, incrementByAmount } from '../../store/home';
// import axios from 'axios';
import { marked } from 'marked';
// import type { Slugger } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
// import fetchStream from '@/tools/fetchStream';
// import PageLayout from '@/components/chat/page-layout/index';
import cn from './index.module.scss';
import { ChatMessages } from '@/types';
type HomeStore = RootState['home'];
type HomeDispatch = ReturnType<typeof mapDispatchToProps>;

function App(props: HomeStore & HomeDispatch) {
  console.log(111, props);
  // const { value, increment, decrement } = props;
  // const [history, setHistory] = useState<ChatMessages>([]);
  const [html, setHtml] = useState<TrustedHTML | string>('');
  useEffect(() => {
    // fetchStream('http://127.0.0.1:4001/playchat', {
    //   method: 'POST',
    //   body: JSON.stringify({ msg: '你好' }),
    //   headers: {
    //     accept: 'text/event-stream',
    //     'Content-Type': 'application/json',
    //   },
    //   onmessage: (res: any) => {
    //     // todo
    //     console.log(11, res);
    //   },
    // });
    // marked.setOptions({
    //   highlight(code, lang, callback) {
    //     console.log(code, lang, callback)
    //   },
    // });
    // marked.setOptions({
    //   renderer: new marked.Renderer(),
    //   highlight: function (code, _lang) {
    //     const htmlStr = hljs.highlightAuto(code).value;
    //     return htmlStr;
    //   },
    //   langPrefix: 'hljs language-',
    //   pedantic: false,
    //   gfm: true,
    //   breaks: false,
    //   sanitize: false,
    //   smartypants: false,
    //   xhtml: false,
    // });
    // // const _html = marked.parse(`niaho\n\n\`\`\`javascript\n\nconst sum = (a,b) => {\n\n  return a+b;\n\n}`);
    // const _html = marked(`niaho\n\n\`\`\`javascript\n\nconst sum = (a,b) => {\n\n  return a+b;\n\n}`);
    // setHtml(_html);
  }, []);
  return (
    <div className={cn['home_box']}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
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

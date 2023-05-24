import fetchStream from '@/tools/fetchStream';
const env = process.env.NODE_ENV;
const dev = env === 'development';
interface ChatParams {
  onMessage: (msg: string) => void;
  onFinish: () => void;
  msg: string;
}
export const chat = (params: ChatParams) => {
  const { onMessage, onFinish, msg } = params;
  const url = dev ? 'http://127.0.0.1:4001/chat' : 'http://'; // to do 接口地址
  fetchStream(url, {
    method: 'POST',
    body: JSON.stringify({ msg }),
    // body: { msg },
    headers: {
      'Content-Type': 'application/json',
    },
    onmessage: (msg: string) => {
      console.log(msg);
      onMessage?.(msg);
    },
    onclose: () => {
      console.log('close');
      onFinish?.();
    },
  });
};

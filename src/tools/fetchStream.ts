import widthToken from '@/apis/width-token';
import { StoreKey } from '@/constant';
import { usePersonStore } from '@/store/person';
interface Params extends RequestInit {
  onmessage: (msg: string) => void;
  onclose: () => void;
  onerror: (err: any) => void;
}

const fetchStream = (url: string, params: Params) => {
  // // to do debugger时，导致消息堆积在一起，就不能用JSON.parse去解析了
  const { onmessage, onclose, onerror, ...otherParams } = params;

  const onSuccess = async (
    controller: ReadableStreamDefaultController<any>,
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ) => {
    const { value, done } = await reader.read();
    if (done) {
      controller.close();
      onclose?.();
    } else {
      onmessage?.(new TextDecoder().decode(value));
      controller.enqueue(value);
      onSuccess(controller, reader);
    }
  };
  const onError = async (
    response: Response,
    controller: ReadableStreamDefaultController<any>,
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ) => {
    const { value, done } = await reader.read();
    // 由于是错误，假设一定是一次性返回。
    const { headers, status, statusText } = response;
    let body = new TextDecoder().decode(value);
    try {
      body = JSON.parse(body);
      // eslint-disable-next-line no-empty
    } catch (error) {}
    const newRes = {
      body,
      status,
      statusText,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    };
    onerror?.(newRes);
    controller.close();
    reader.cancel();
  };

  // 设置请求头
  const _otherParams = {
    ...otherParams,
  };
  const token = widthToken();
  if (token) {
    _otherParams.headers = {
      ...otherParams.headers,
      Authorization: token,
    };
  }

  // 发送请求
  return fetch(url, _otherParams).then((response) => {
    // 如果重新分发了token就更新
    const newToken = response.headers.get('access_token');
    if (newToken) {
      // const state = usePersonStore.getState();
      usePersonStore.setState({
        token: newToken,
      });
    }
    // 以ReadableStream解析数据
    const reader = response.body!.getReader();
    const stream = new ReadableStream({
      start(controller) {
        if (response.status !== 200) {
          return onError(response, controller, reader);
        }
        onSuccess(controller, reader);
      },
    });
    return stream;
  });
  // .then((stream) => new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text());
};

export default fetchStream;

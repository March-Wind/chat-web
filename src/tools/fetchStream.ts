import widthToken from '@/apis/width-token';
// import { StoreKey } from '@/constant';
import { usePersonStore } from '@/store/person';
interface Params extends RequestInit {
  onMessage: (msg: string) => void;
  onEnd: () => void;
  onError: (err: any) => void;
}

const fetchStream = (url: string, params: Params) => {
  const { onMessage, onEnd, onError, ...otherParams } = params;
  const onSuccess = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const { value, done } = await reader.read();
    if (done) {
      onEnd?.();
    } else {
      onMessage?.(new TextDecoder().decode(value));
      onSuccess(reader);
    }
  };
  const _onError = async (response: Response, reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const { value } = await reader.read();
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
    onError?.(newRes);
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
      usePersonStore.setState({
        token: newToken,
      });
    }
    const reader = response.body!.getReader();
    if (response.status !== 200) {
      _onError(response, reader);
    } else {
      onSuccess(reader);
    }
    return reader;
  });
  // .then((stream) => new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text());
};

export default fetchStream;

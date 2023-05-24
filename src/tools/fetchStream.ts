interface Params extends RequestInit {
  onmessage: (msg: string) => void;
  onclose: () => void;
}
const fetchStream = (url: string, params: Params) => {
  // // to do debugger时，导致消息堆积在一起，就不能用JSON.parse去解析了
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

export default fetchStream;

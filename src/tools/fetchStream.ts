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

export default fetchStream;


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

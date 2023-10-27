import { useState, useRef } from 'react';

export function useScrollToBottom() {
  // for auto-scroll
  const scrollRefCb = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    const dom = scrollRefCb.current;
    if (dom) {
      setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  };

  // auto scroll
  // useLayoutEffect(() => {
  //   debugger

  //   autoScroll && scrollToBottom();
  // });

  return {
    scrollRefCb,
    autoScroll,
    setAutoScroll,
    scrollToBottom,
  };
}

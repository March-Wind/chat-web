import React, { FC, useRef, useState, RefObject, useEffect } from 'react';
import { marked } from 'marked';
// import type { Slugger } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { copyToClipboard } from '@/tools/utils';
// import mermaid from 'mermaid';
import LoadingIcon from '@/assets/icons/three-dots.svg';
// import copy2 from '@/assets/icons/copy2.svg';

const MarkdownContent: FC<{ code: string }> = (props) => {
  const { code } = props;
  const [html, setHtml] = useState<TrustedHTML | string>('');
  const markDownRef = useRef<HTMLDivElement>(null);
  const copyCode = () => {
    copyToClipboard(code);
  };
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target.classList.contains('code-header-btn')) {
      copyCode();
    }
  };
  useEffect(() => {
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function (code, _lang) {
        // const codeStr = hljs.highlightAuto(code).value;
        if (!code && !_lang) {
          return ''
        }
        const codeStr = hljs.highlight(code, { language: _lang }).value;
        // const codeWrap = `
        //   <div class="code-wrap">
        //     <div class="code-header">
        //       <span>${_lang}</span>
        //       <div class="code-header-btn">
        //         ${copy2}
        //         <span>Copy code</span>
        //       </div>
        //     </div>
        //     ${codeStr}
        //   </div>
        // `
        // return codeWrap;
        // console.log(22, codeStr);

        return codeStr;
      },
      langPrefix: 'hljs language-',
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
    });
  }, []);
  useEffect(() => {
    // const _html = marked(`niaho\n\n\`\`\`javascript\n\nconst sum = (a,b) => {\n\n  return a+b;\n\n}`);
    const _html = marked(code);
    setHtml(_html);
  }, [code]);
  return (
    <div
      className="markdown-body-wrap"
      ref={markDownRef}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  const renderedHeight = useRef(0);
  const inView = useRef(!!props.defaultShow);

  const parent = props.parentRef.current;
  const md = mdRef.current;

  const checkInView = () => {
    if (parent && md) {
      const parentBounds = parent.getBoundingClientRect();
      const twoScreenHeight = Math.max(500, parentBounds.height * 2);
      const mdBounds = md.getBoundingClientRect();
      const parentTop = parentBounds.top - twoScreenHeight;
      const parentBottom = parentBounds.bottom + twoScreenHeight;
      const isOverlap = Math.max(parentTop, mdBounds.top) <= Math.min(parentBottom, mdBounds.bottom);
      inView.current = isOverlap;
    }

    if (inView.current && md) {
      renderedHeight.current = Math.max(renderedHeight.current, md.getBoundingClientRect().height);
    }
  };

  setTimeout(() => checkInView(), 1);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        height: !inView.current && renderedHeight.current > 0 ? renderedHeight.current : 'auto',
      }}
      ref={mdRef}
    // onContextMenu={props.onContextMenu}
    // onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {inView.current &&
        (props.loading ? (
          <LoadingIcon />
        ) : (
          // <MarkdownContent content={props.content} />
          // <>sdlfj</>
          <MarkdownContent code={props.content} />
        ))}
    </div>
  );
}
export default Markdown;

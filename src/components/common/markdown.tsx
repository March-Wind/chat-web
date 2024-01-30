import React, { FC, useRef } from 'react';
import { marked } from 'marked';
import { markedXhtml } from 'marked-xhtml';
import { mangle } from 'marked-mangle';
import he from 'he';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { copyToClipboard } from '@/tools/utils';
import LoadingIcon from '@/assets/icons/three-dots.svg';
import convert from 'htmr';

const processContent = (content: string) => {
  let _content = content;
  _content = _content.replace(/：(1)/g, '：\n1');
  return _content;
};
const plugin = markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (!code && !lang) {
      return '';
    }
    if (!lang) {
      return code;
    }
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    const codeStr = hljs.highlight(code, { language }).value;
    return codeStr;
  },
});
marked.use(plugin);
marked.use({
  // pedantic: true,
  // gfm: true,
  breaks: true,
  sanitize: true,
  // smartypants: true,
  // xhtml: true,
  // mangle: true,
  headerIds: false,
  // hooks: {
  // preprocess(markdown) {
  //   markdown.replace(/ /g, '&nbsp;')
  //   return markdown
  // },
  // },
});
marked.use(markedXhtml());
marked.use(mangle());
marked.use({
  renderer: {
    html(html) {
      // 转译，防止XSS
      return he.encode(html);
    },
    // code(code, language, isEscaped) {
    //   debugger
    //   return code
    // },
    text(text) {
      return text.replace(/ /g, '&nbsp;');
    },
  },
});

const MarkdownContent: FC<{ code: string }> = (props) => {
  const { code } = props;
  // const [html, setHtml] = useState<TrustedHTML | string>('');
  const markDownRef = useRef<HTMLDivElement>(null);
  const copyCode = () => {
    copyToClipboard(code);
  };
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target.classList.contains('code-header-btn')) {
      copyCode();
    }
  };
  // 处理空格问题
  let _code = code;
  // let _code = code.replace(/\n\n\s{4}/g, '\n\n&nbsp;&nbsp;&nbsp;&nbsp;');
  // _code = code.replace(/ /g, '&nbsp;');
  _code = processContent(_code);
  const _html = marked.parse(_code);
  // const _html = marked.parse(code);
  // const encode2code = he.encode(_html);
  return (
    <div
      className="markdown-body-wrap"
      ref={markDownRef}
      onClick={handleClick}
      // dangerouslySetInnerHTML={{ __html: _html }}
    >
      {convert(_html)}
    </div>
  );
};

function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    // parentRef: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  // const renderedHeight = useRef(0);
  // const inView = useRef(!!props.defaultShow);

  // const parent = props.parentRef.current;
  // const md = mdRef.current;

  // const checkInView = () => {
  //   if (parent && md) {
  //     const parentBounds = parent.getBoundingClientRect();
  //     const twoScreenHeight = Math.max(500, parentBounds.height * 2);
  //     const mdBounds = md.getBoundingClientRect();
  //     const parentTop = parentBounds.top - twoScreenHeight;
  //     const parentBottom = parentBounds.bottom + twoScreenHeight;
  //     const isOverlap = Math.max(parentTop, mdBounds.top) <= Math.min(parentBottom, mdBounds.bottom);
  //     inView.current = isOverlap;
  //   }
  //   if (inView.current && md) {
  //     renderedHeight.current = Math.max(renderedHeight.current, md.getBoundingClientRect().height);
  //   }
  // };

  // setTimeout(() => checkInView(), 1);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        // height: !inView.current && renderedHeight.current > 0 ? renderedHeight.current : 'auto',
      }}
      ref={mdRef}
      // onContextMenu={props.onContextMenu}
      // onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {props.loading ? (
        <LoadingIcon />
      ) : (
        // <MarkdownContent content={props.content} />
        // <>sdlfj</>
        <MarkdownContent code={props.content} />
      )}
    </div>
  );
}
export default Markdown;

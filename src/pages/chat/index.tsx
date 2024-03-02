import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import SendWhiteIcon from '@/assets/icons/send-white.svg';
// import BrainIcon from '@/assets/icons/brain.svg';

import RenameIcon from '@/assets/icons/rename.svg';
import ExportIcon from '@/assets/icons/share.svg';
import ReturnIcon from '@/assets/icons/return.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import DownloadIcon from '@/assets/icons/download.svg';
// import LoadingIcon from '@/assets/icons/three-dots.svg';
import PromptIcon from '@/assets/icons/prompt.svg';
import MaskIcon from '@/assets/icons/mask.svg';
import MaxIcon from '@/assets/icons/max.svg';
import MinIcon from '@/assets/icons/min.svg';

import LightIcon from '@/assets/icons/light.svg';
import DarkIcon from '@/assets/icons/dark.svg';
import AutoIcon from '@/assets/icons/auto.svg';
import BottomIcon from '@/assets/icons/bottom.svg';
import StopIcon from '@/assets/icons/pause.svg';
import Markdown from '@/components/common/markdown';
// import LoadingIcon from '@/assets/icons/three-dots.svg';
import { debounce } from 'lodash';
import {
  ChatMessage,
  useChatStore,
  // BOT_HELLO,
  // createMessage,
  // useAccessStore,

  // useAppConfig,
  // DEFAULT_TOPIC,
  ChatSession,
} from '@/store/chat';
import { useAppConfig, Theme, SubmitKey } from '@/store/config';
import {
  copyToClipboard,
  downloadAs,
  // selectOrCopy,
  autoGrowTextArea,
  useMobileScreen,
} from '@/tools/utils';

// import dynamic from "next/dynamic";

import { ChatControllerPool } from '@/tools/controller';
import { Prompt, usePromptStore } from '@/store/prompt';
import Locale from '@/assets/locales';

import { IconButton } from '@/components/common/button';
import styles from '@/app.module.scss';
import chatStyle from './chat.module.scss';

import { showModal } from '@/components/common/ui-lib/ui-lib';

import { LAST_INPUT_KEY, Path } from '@/constant';
import { Avatar } from '@/components/common/emoji';
import { MaskAvatar } from '@/pages/mask';
// import { useMaskStore } from '@/store/mask';
import useCommand from '@/hooks/useCommand';
import { use } from 'cytoscape';

// const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
//   loading: () => <LoadingIcon />,
// });

function exportMessages(messages: ChatMessage[], topic: string) {
  const mdText =
    `# ${topic}\n\n` +
    messages
      .map((m) => {
        return m.role === 'user'
          ? `## ${Locale.Export.MessageFromYou}:\n${m.content}`
          : `## ${Locale.Export.MessageFromChatGPT}:\n${m.content.trim()}`;
      })
      .join('\n\n');
  const filename = `${topic}.md`;

  showModal({
    title: Locale.Export.Title,
    children: (
      <div className="markdown-body">
        <pre className={styles['export-content']}>{mdText}</pre>
      </div>
    ),
    actions: [
      <IconButton
        key="copy"
        icon={<CopyIcon />}
        bordered
        text={Locale.Export.Copy}
        onClick={() => copyToClipboard(mdText)}
      />,
      <IconButton
        key="download"
        icon={<DownloadIcon />}
        bordered
        text={Locale.Export.Download}
        onClick={() => downloadAs(mdText, filename)}
      />,
    ],
  });
}

//  function SessionConfigModel(props: { onClose: () => void }) {
//   const chatStore = useChatStore();
//   const session = chatStore.currentSession();
//   const maskStore = useMaskStore();
//   const navigate = useNavigate();

//   return (
//     <div className="modal-mask">
//       <Modal
//         title={Locale.Context.Edit}
//         onClose={() => props.onClose()}
//         actions={[
//           <IconButton
//             key="reset"
//             icon={<ResetIcon />}
//             bordered
//             text={Locale.Chat.Config.Reset}
//             onClick={() => confirm(Locale.Memory.ResetConfirm) && chatStore.resetSession()}
//           />,
//           <IconButton
//             key="copy"
//             icon={<CopyIcon />}
//             bordered
//             text={Locale.Chat.Config.SaveAs}
//             onClick={() => {
//               navigate(Path.Masks);
//               setTimeout(() => {
//                 maskStore.create(session.mask);
//               }, 500);
//             }}
//           />,
//         ]}
//       >
//         <MaskConfig
//           mask={session.mask}
//           updateMask={(updater) => {
//             const mask = { ...session.mask };
//             updater(mask);
//             chatStore.updateCurrentSession((session) => (session.mask = mask));
//           }}
//           extraListItems={
//             session.mask.modelConfig.sendMemory ? (
//               <ListItem
//                 title={`${Locale.Memory.Title}`}
//                 subTitle={session.memoryPrompt || Locale.Memory.EmptyContent}
//               ></ListItem>
//             ) : (
//               <></>
//             )
//           }
//         ></MaskConfig>
//       </Modal>
//     </div>
//   );
// }

// function PromptToast(props: { showToast?: boolean; showModal?: boolean; setShowModal: (_: boolean) => void }) {
//   const chatStore = useChatStore();
//   const session = chatStore.currentSession();
//   const context = session.mask.context;

//   return (
//     <div className={chatStyle['prompt-toast']} key="prompt-toast">
//       {props.showToast && (
//         <div
//           className={chatStyle['prompt-toast-inner'] + ' clickable'}
//           role="button"
//           onClick={() => props.setShowModal(true)}
//         >
//           <BrainIcon />
//           <span className={chatStyle['prompt-toast-content']}>{Locale.Context.Toast(context.length)}</span>
//         </div>
//       )}
//       {props.showModal && <SessionConfigModel onClose={() => props.setShowModal(false)} />}
//     </div>
//   );
// }

function useSubmitHandler() {
  const config = useAppConfig();
  const submitKey = config.submitKey;

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    return (
      (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
      (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (config.submitKey === SubmitKey.Enter && !e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey)
    );
  };

  return {
    submitKey,
    shouldSubmit,
  };
}

export function PromptHints(props: { prompts: Prompt[]; onPromptSelect: (prompt: Prompt) => void }) {
  const noPrompts = props.prompts.length === 0;
  const [selectIndex, setSelectIndex] = useState(0);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectIndex(0);
  }, [props.prompts.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (noPrompts) return;
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }
      // arrow up / down to select prompt
      const changeIndex = (delta: number) => {
        e.stopPropagation();
        e.preventDefault();
        const nextIndex = Math.max(0, Math.min(props.prompts.length - 1, selectIndex + delta));
        setSelectIndex(nextIndex);
        selectedRef.current?.scrollIntoView({
          block: 'center',
        });
      };

      if (e.key === 'ArrowUp') {
        changeIndex(1);
      } else if (e.key === 'ArrowDown') {
        changeIndex(-1);
      } else if (e.key === 'Enter') {
        const selectedPrompt = props.prompts.at(selectIndex);
        if (selectedPrompt) {
          props.onPromptSelect(selectedPrompt);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noPrompts, selectIndex]);

  if (noPrompts) return null;
  return (
    <div className={styles['prompt-hints']}>
      {props.prompts.map((prompt, i) => (
        <div
          ref={i === selectIndex ? selectedRef : null}
          className={styles['prompt-hint'] + ` ${i === selectIndex ? styles['prompt-hint-selected'] : ''}`}
          key={prompt.title + i.toString()}
          onClick={() => props.onPromptSelect(prompt)}
          onMouseEnter={() => setSelectIndex(i)}
        >
          <div className={styles['hint-title']}>{prompt.title}</div>
          <div className={styles['hint-content']}>{prompt.content}</div>
        </div>
      ))}
    </div>
  );
}

function useScrollToBottom() {
  // for auto-scroll
  const userLockScroll = useRef(false);
  const scrollNode = useRef<(HTMLDivElement & { isObserver?: boolean }) | null>(null);
  const lastScrollHeight = useRef<number>(0);
  const timer = useRef<number | NodeJS.Timeout>();
  // const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    const dom = scrollNode.current;
    if (dom) {
      dom.scrollTo({ top: dom.scrollHeight, behavior: 'smooth' });
      // setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  };
  const onUserMove = useCallback(() => {
    const _scrollNode = scrollNode.current;
    if (_scrollNode) {
      if (_scrollNode.scrollHeight - _scrollNode.scrollTop - _scrollNode.clientHeight <= 5) {
        userLockScroll.current = false;
      } else {
        userLockScroll.current = true;
      }
    }
  }, []);
  useEffect(() => {
    scrollNode.current?.addEventListener('mousewheel', onUserMove);
    scrollNode.current?.addEventListener('touchmove', onUserMove);
  }, []);
  const scrollRefCb = () => {
    const node = scrollNode.current;
    if (node && !node.isObserver) {
      node.isObserver = true;
      const observer = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation) => {
          if (
            !userLockScroll.current &&
            node.scrollHeight !== lastScrollHeight.current &&
            (node.scrollHeight - node.scrollTop - node.clientHeight <= 10 ||
              (mutation.type === 'childList' && mutation.addedNodes.length > 0))
          ) {
            node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
          }
          lastScrollHeight.current = node.scrollHeight;
        });
      });
      observer.observe(node, { attributes: true, childList: true, subtree: true });

      // node.onwheel = debounce(
      //   () => {
      //     setAutoScroll(false);
      //     timer?.current && clearTimeout(timer.current);
      //     timer.current = setTimeout(() => {
      //       setAutoScroll(true);
      //     }, 300);
      //   },
      //   300,
      //   { trailing: true, leading: true },
      // );
    }
  };
  return {
    scrollRefCb,
    // setAutoScroll,
    scrollToBottom,
    scrollNode,
  };
}

export function ChatActions(props: {
  // showPromptModal: () => void;
  scrollToBottom: () => void;
  showPromptHints: () => void;
  // hitBottom: boolean;
}) {
  const config = useAppConfig();
  const navigate = useNavigate();
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const { streaming = false, messages = [] } = session || ({} as ChatSession);
  const currentMsg = messages[messages.length - 1];
  // switch themes
  const theme = config.theme;
  function nextTheme() {
    const themes = [Theme.Auto, Theme.Light, Theme.Dark];
    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    config.update((config) => (config.theme = nextTheme));
  }

  // stop all responses
  // const couldStop = ChatControllerPool.hasPending();
  // const stopAll = () => ChatControllerPool.stopAll();

  return (
    <div className={chatStyle['chat-input-actions']}>
      {/* 滚动到底部 */}
      <div className={`${chatStyle['chat-input-action']} clickable`} onClick={props.scrollToBottom}>
        <BottomIcon />
      </div>
      {/* 切换主题 */}
      {/* <div className={`${chatStyle['chat-input-action']} clickable`} onClick={nextTheme}>
        {theme === Theme.Auto ? (
          <AutoIcon />
        ) : theme === Theme.Light ? (
          <LightIcon />
        ) : theme === Theme.Dark ? (
          <DarkIcon />
        ) : null}
      </div> */}
      {/* 普通的提示词 */}
      <div className={`${chatStyle['chat-input-action']} clickable`} onClick={props.showPromptHints}>
        <PromptIcon />
      </div>
      {/* 精品提示词 */}
      <div
        className={`${chatStyle['chat-input-action']} clickable`}
        onClick={() => {
          navigate(Path.Masks);
        }}
      >
        <MaskIcon />
      </div>
      {/* 重新生成 */}
      {!streaming && currentMsg?.role === 'assistant' ? (
        <div
          className={`${chatStyle['chat-input-action']} clickable`}
          onClick={() => {
            chatStore.regenerate();
          }}
        >
          <RedoOutlined className={chatStyle['icon_style']} />
        </div>
      ) : null}
      {/* 暂停生成 */}
      {streaming && currentMsg?.role === 'assistant' ? (
        <div
          className={`${chatStyle['chat-input-action']} clickable`}
          onClick={() => {
            chatStore.stopGenerate();
          }}
        >
          {/* <PauseCircleOutlined className={chatStyle['icon_style']} /> */}
          <StopIcon />
        </div>
      ) : null}
    </div>
  );
}

function Chat() {
  // type RenderMessage = ChatMessage & { preview?: boolean };
  const chatStore = useChatStore();
  // const [loading, session = {} as ChatSession, sessionIndex] = useChatStore((state) => [
  //   state.loading,
  //   state.currentSession(),
  //   state.currentSessionIndex,
  // ]);
  const sessionIndex = chatStore.currentSessionIndex;
  const session = chatStore.sessions[sessionIndex];
  const config = useAppConfig();
  const fontSize = config.fontSize;
  // const scrollNode = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [showPromptModal, setShowPromptModal] = useState(false);
  const { submitKey, shouldSubmit } = useSubmitHandler();
  const { scrollRefCb, scrollToBottom, scrollNode } = useScrollToBottom();
  // const [hitBottom, setHitBottom] = useState(true);
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  // const [query] = useSearchParams();
  // 发送消息
  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    // setIsLoading(true);
    chatStore.onUserInput(userInput);
    localStorage.setItem(LAST_INPUT_KEY, userInput);
    setUserInput('');
    setPromptHints([]);
    if (!isMobileScreen) inputRef.current?.focus();
    // setAutoScroll(true);
    const sNode = scrollNode.current;
    if (sNode && sNode.scrollHeight - sNode.scrollTop - sNode.clientHeight <= 100) {
      scrollToBottom();
    }
  };
  useCommand({
    fill: setUserInput,
    submit: (text) => {
      doSubmit(text);
    },
  });
  // const onChatBodyScroll = (e: HTMLElement) => {
  //   const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 100;
  //   setHitBottom(isTouchBottom);
  // };

  // prompt hints
  const promptStore = usePromptStore();
  const [promptHints, setPromptHints] = useState<Prompt[]>([]);
  const onSearch = useDebouncedCallback(
    (text: string) => {
      setPromptHints(promptStore.search(text));
    },
    100,
    { leading: true, trailing: true },
  );

  const onPromptSelect = (prompt: Prompt) => {
    setPromptHints([]);
    inputRef.current?.focus();
    setTimeout(() => setUserInput(prompt.content), 60);
  };

  // auto grow input
  const [inputRows, setInputRows] = useState(2);
  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(2 + Number(!isMobileScreen), rows));
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);
  if (!session) {
    return null;
  }
  // only search prompts when user input is short
  const SEARCH_TEXT_LIMIT = 30;
  const onInput = (text: string) => {
    setUserInput(text);
    const n = text.trim().length;
    // clear search results
    if (n === 0) {
      setPromptHints([]);
    } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
      // check if need to trigger auto completion
      if (text.startsWith('/')) {
        const searchText = text.slice(1);
        onSearch(searchText);
      }
    }
  };

  // stop response
  // const onUserStop = (messageId: number) => {
  //   ChatControllerPool.stop(sessionIndex, messageId);
  // };

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (e.key === 'ArrowUp' && userInput.length <= 0 && !(e.metaKey || e.altKey || e.ctrlKey)) {
      setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? '');
      e.preventDefault();
      return;
    }
    if (shouldSubmit(e) && promptHints.length === 0) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };

  const renameSession = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.topic);
    if (newTopic && newTopic !== session.topic) {
      chatStore.updateCurrentSession((session) => (session.topic = newTopic!));
    }
  };

  // const location = useLocation();
  // const isChat = location.pathname === Path.Chat;
  // const autoFocus = !isMobileScreen || isChat; // only focus in chat page
  const autoFocus = false; // only focus in chat page // to do
  const { topic = '新的聊天', messages = [], mask, id } = session;
  const { name = '', context: preMessages } = mask || {};
  return (
    // <div className={styles.chat} key={session.id} style={{ opacity: loading ? 0 : 1 }}>
    <div className={styles.chat}>
      <div className="window-header" key="window-header">
        <div className="window-header-title">
          <div className={`window-header-main-title " ${styles['chat-body-title']}`} onClickCapture={renameSession}>
            {name ? name + ':' + topic : topic}
          </div>
          <div className="window-header-sub-title">
            {name ? `已使用"${name}"预设 - ` : ''}
            {Locale.Chat.SubTitle(messages.length)}
          </div>
        </div>
        <div className="window-actions">
          <div className={'window-action-button' + ' ' + styles.mobile}>
            <IconButton
              icon={<ReturnIcon />}
              bordered
              title={Locale.Chat.Actions.ChatList}
              onClick={() => navigate(Path.Home)}
            />
          </div>
          <div className="window-action-button">
            <IconButton icon={<RenameIcon />} bordered onClick={renameSession} />
          </div>
          <div className="window-action-button">
            <IconButton
              icon={<ExportIcon />}
              bordered
              title={Locale.Chat.Actions.Export}
              onClick={() => {
                exportMessages(
                  messages.filter((msg) => !msg.isError),
                  topic,
                );
              }}
            />
          </div>
          {!isMobileScreen && (
            <div className="window-action-button">
              <IconButton
                icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                bordered
                onClick={() => {
                  config.update((config) => (config.tightBorder = !config.tightBorder));
                }}
              />
            </div>
          )}
        </div>

        {/* <PromptToast showToast={!hitBottom} showModal={showPromptModal} setShowModal={setShowPromptModal} /> */}
      </div>

      <div
        key={'chat-body'}
        className={styles['chat-body']}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={(node: HTMLDivElement) => {
          if (node) {
            scrollNode.current = node;
            scrollRefCb(node);
          }
        }}
        // onMouseDown={() => inputRef.current?.blur()}
        // onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
        // onTouchStart={() => {
        // inputRef.current?.blur();
        // setAutoScroll(false);
        // }}
      >
        {/* 预设内容-start */}
        <>
          {preMessages && preMessages.length > 0
            ? preMessages.map((message, i) => {
                const { content = '' } = message;
                const isUser = message.role === 'user';
                return (
                  <div key={i} className={isUser ? styles['chat-message-user'] : styles['chat-message']}>
                    <div className={styles['chat-message-container']}>
                      <div className={styles['chat-message-avatar']}>
                        {message.role === 'user' ? (
                          <Avatar avatar={config.avatar} />
                        ) : (
                          <MaskAvatar mask={session.mask} />
                        )}
                      </div>
                      <div className={styles['chat-message-item']}>
                        <Markdown
                          content={content}
                          loading={content.length === 0 && !isUser}
                          fontSize={fontSize}
                          parentRef={scrollRefCb}
                          defaultShow={i >= messages.length - 10}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </>
        {/* 预设内容-end */}

        {/* 真正的用户聊天内容-start */}
        <>
          {messages && messages.length > 0
            ? messages.map((message, i) => {
                const { content = '' } = message;
                const isUser = message.role === 'user';
                // const showActions = !isUser && i > 0 && !(message.preview || message.content.length === 0);
                const showActions = !isUser && !(content.length === 0);
                const showTyping = message.streaming;
                return (
                  <div key={i} className={isUser ? styles['chat-message-user'] : styles['chat-message']}>
                    <div className={styles['chat-message-container']}>
                      <div className={styles['chat-message-avatar']}>
                        {message.role === 'user' ? (
                          <Avatar avatar={config.avatar} />
                        ) : (
                          <MaskAvatar mask={session.mask} />
                        )}
                      </div>
                      {showTyping && <div className={styles['chat-message-status']}>{Locale.Chat.Typing}</div>}
                      <div className={styles['chat-message-item']}>
                        {showActions && (
                          <div className={styles['chat-message-top-actions']}>
                            {/* 复制 */}
                            <div
                              className={styles['chat-message-top-action']}
                              onClick={() => copyToClipboard(message.content)}
                            >
                              {Locale.Chat.Actions.Copy}
                            </div>
                          </div>
                        )}
                        <Markdown
                          content={content}
                          loading={content.length === 0 && !isUser}
                          // onContextMenu={(e) => onRightClick(e, message)}
                          // onDoubleClickCapture={() => {
                          //   if (!isMobileScreen) return;
                          //   setUserInput(message.content);
                          // }}
                          fontSize={fontSize}
                          parentRef={scrollRefCb}
                          defaultShow={i >= messages.length - 10}
                        />
                      </div>
                      {/* {!isUser && !message.preview && (
                    <div className={styles['chat-message-actions']}>
                      <div className={styles['chat-message-action-date']}>{message.date.toLocaleString()}</div>
                    </div>
                  )} */}
                    </div>
                  </div>
                );
              })
            : null}
          <div className={id && (!messages || messages.length === 0) ? chatStyle['loading-box'] : chatStyle['none']}>
            <LoadingOutlined />
          </div>
        </>
        {/* 真正的用户聊天内容-end */}
      </div>

      <div className={styles['chat-input-panel']} key={'chat-input-panel'}>
        <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} />

        <ChatActions
          // showPromptModal={() => setShowPromptModal(true)}
          scrollToBottom={scrollToBottom}
          // hitBottom={hitBottom}
          showPromptHints={() => {
            // Click again to close
            if (promptHints.length > 0) {
              setPromptHints([]);
              return;
            }

            inputRef.current?.focus();
            setUserInput('/');
            onSearch('');
          }}
        />
        <div className={styles['chat-input-panel-inner']}>
          <textarea
            ref={inputRef}
            className={styles['chat-input']}
            placeholder={Locale.Chat.Input(submitKey)}
            onInput={(e) => onInput(e.currentTarget.value)}
            value={userInput}
            onKeyDown={onInputKeyDown}
            // onFocus={() => setAutoScroll(true)}
            // onBlur={() => setAutoScroll(false)}
            rows={inputRows}
            autoFocus={autoFocus}
          />
          <IconButton
            icon={<SendWhiteIcon />}
            text={Locale.Chat.Send}
            className={styles['chat-input-send']}
            type="primary"
            onClick={() => doSubmit(userInput)}
          />
        </div>
      </div>
    </div>
  );
}
export default Chat;

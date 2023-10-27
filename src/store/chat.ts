import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// import he from 'he';
// import { trimTopic } from '@/tools/utils';

import Locale from '@/assets/locales';
import { showToast } from '@/components/common/ui-lib/ui-lib';
// import { ModelType } from './config';
import { Mask, DEFAULT_TOPIC, ChatMessage } from './utilsFn';
import { StoreKey } from '../constant';
// import { RequestMessage } from '@/types';
import {
  chat,
  regenerateChat,
  createTopicByTopicId,
  getTopics,
  deleteTopic,
  clearTopics,
  queryTopicMessages,
  deleteMessage,
} from '@/apis';
import { message } from '@/components/common/antd';
// import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useAppConfig } from './config';

// import { api, RequestMessage } from "../client/api";
// import { ChatControllerPool } from "../client/controller";
// import { prettyObject } from "../utils/format";

// export const ROLES = ["system", "user", "assistant"] as const;
// export type MessageRole = (typeof ROLES)[number];
// export interface RequestMessage {
//   role: MessageRole;
//   content: string;
// }
export { ChatMessage };

// export type ChatMessage = RequestMessage & {
//   date: string;
//   streaming?: boolean;
//   isError?: boolean;
//   id?: number;
//   model?: ModelType;
// };

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
  return {
    id: '',
    // date: new Date().toLocaleString(),
    role: 'user',
    content: '',
    ...override,
  };
}

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

export interface ChatSession {
  id: string;

  topic?: string;

  memoryPrompt: string;
  messages: ChatMessage[];
  // stat: ChatStat;
  lastUpdate: number;
  lastSummarizeIndex: number;
  streaming?: boolean;
  mask?: Mask;
  messagesCount?: number;
}

// export const DEFAULT_TOPIC = Locale.Store.DefaultTopic;
export const BOT_HELLO: ChatMessage = createMessage({
  role: 'assistant',
  content: Locale.Store.BotHello,
});

function createEmptySession(): ChatSession {
  // console.log(222, createEmptyMask)
  // createEmptyMask();
  return {
    id: '',
    topic: DEFAULT_TOPIC,
    memoryPrompt: '',
    messages: [],
    // stat: {
    //   tokenCount: 0,
    //   wordCount: 0,
    //   charCount: 0,
    // },
    lastUpdate: Date.now(),
    lastSummarizeIndex: 0,
    // mask: createEmptyMask(),
  };
}

interface ChatStore {
  handleMessage(msg: string): Record<string, any>[];
  sessions: ChatSession[];
  currentSessionIndex: number;
  globalId: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  updateSession: () => void;
  clearSessions: () => void;
  moveSession: (from: number, to: number) => void;
  selectSession: (index: number) => void;
  newSession: (mask?: Mask) => void;
  deleteSession: (topicId: string) => void;
  deleteMessage: (topicId: string, messageId: string) => void;
  currentSession: () => ChatSession;
  setTopic: (topicId: string) => void;
  onNewMessage: (message: ChatMessage) => void;
  onUserInput: (content: string) => Promise<void>;
  getTopicMessages: (topicId: string) => void;
  // summarizeSession: () => void;
  // updateStat: (message: ChatMessage) => void;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  updateMessage: (sessionIndex: number, messageIndex: number, updater: (message?: ChatMessage) => void) => void;
  resetSession: () => void;
  getMemoryPrompt: () => ChatMessage;

  clearAllData: () => void;
  regenerate: (topicId?: string, reserveIndex?: number) => void;
  chatApi: (
    chatParams?: { content: string; session: ChatSession; botMessage: ChatMessage },
    regenerateParams?: { session: ChatSession; botMessage: ChatMessage; reserveIndex: number },
  ) => void;
  stopGenerate: () => void;
  // scrollToBottom: () => void;
}

// function countMessages(msgs: ChatMessage[]) {
//   return msgs.reduce((pre, cur) => pre + cur.content.length, 0);
// }
// () => ({ scrollToBottom: useScrollToBottom().scrollToBottom })
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => {
      return {
        sessions: [createEmptySession()],
        currentSessionIndex: 0,
        globalId: 0,
        // to drop: 虽然设置了，但是页面上没有用到这个字段
        loading: false,
        updateSession() {
          getTopics()
            .then((data) => {
              if (data && !data.length) {
                set(() => ({
                  sessions: [createEmptySession()],
                  currentSessionIndex: 0,
                  loading: false,
                }));
                return;
              }
              set((state) => {
                if (state.sessions[0]?.id === data[0]?.id) {
                  return {};
                }
                return {
                  sessions: data.map((item) => {
                    const currentSession = state.sessions.find((session) => session.id === item.id);
                    const messages =
                      currentSession !== undefined
                        ? currentSession.messages.length > 0
                          ? currentSession.messages
                          : []
                        : [];
                    return {
                      ...currentSession,
                      id: item.id,
                      topic: item.title || currentSession?.topic || '',
                      memoryPrompt: currentSession?.memoryPrompt || '',
                      messages: messages,
                      lastUpdate: item.lastUpdateTime || new Date().getTime(),
                      lastSummarizeIndex: 0,
                      mask: item.prePrompt,
                      messagesCount: currentSession?.messagesCount || item.messagesCount,
                      // streaming: false,
                    };
                  }),
                } as ChatStore;
              });
              const topicId = get().currentSession().id;
              get().getTopicMessages(topicId);
            })
            .catch((err) => {
              console.log(err);
              // 更新列表失败
            });
        },
        getTopicMessages(topicId: string) {
          queryTopicMessages(topicId).then((msgs) => {
            if (!msgs) {
              return;
            }
            set((state) => {
              const _sessions = state.sessions.slice();
              const _index = _sessions.findIndex((item) => item.id === topicId);
              _sessions[_index].messages = msgs.map((msg, index) => {
                return {
                  ..._sessions[_index].messages[index],
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                  // streaming: false
                };
              });
              return {
                sessions: _sessions,
              };
            });
          });
        },
        clearSessions() {
          clearTopics().then((data) => {
            if (!data) {
              return;
            }
            set(() => ({
              sessions: [createEmptySession()],
              currentSessionIndex: 0,
            }));
          });
        },
        setLoading(loading: boolean) {
          set({
            loading,
          });
        },
        selectSession(index: number) {
          set({
            currentSessionIndex: index,
          });
          const topicId = get().sessions[index].id;
          if (!topicId) {
            return;
          }
          get().setLoading(true);
          const oldMsgs = get().sessions[index].messages;
          if (oldMsgs?.length > 0) {
            setTimeout(() => {
              get().setLoading(false);
            }, 0);
            return;
          }
          queryTopicMessages(topicId).then((msgs) => {
            if (!msgs) {
              return;
            }
            setTimeout(() => {
              get().setLoading(false);
            }, 0);
            set((state) => {
              const _sessions = state.sessions.slice();
              const _index = _sessions.findIndex((item) => item.id === topicId);
              _sessions[_index].messages = msgs.map((msg) => {
                return {
                  ...msg,
                };
              });
              return {
                sessions: _sessions,
              };
            });
          });
        },

        moveSession(from: number, to: number) {
          set((state) => {
            const { sessions, currentSessionIndex: oldIndex } = state;

            // move the session
            const newSessions = [...sessions];
            const session = newSessions[from];
            newSessions.splice(from, 1);
            newSessions.splice(to, 0, session);

            // modify current session id
            let newIndex = oldIndex === from ? to : oldIndex;
            if (oldIndex > from && oldIndex <= to) {
              newIndex -= 1;
            } else if (oldIndex < from && oldIndex >= to) {
              newIndex += 1;
            }

            return {
              currentSessionIndex: newIndex,
              sessions: newSessions,
            };
          });
        },

        newSession(mask) {
          // 如果第一个对话是新建的，就删除第一个对话，然后再新建
          const firstSession = get().sessions[0];
          if (!firstSession.id && (!firstSession.messages || firstSession.messages.length === 0)) {
            set({
              currentSessionIndex: 0,
              sessions: this.sessions.slice(1),
            });
          }
          // 新建对话
          const session = createEmptySession();
          set(() => ({ globalId: get().globalId + 1 }));
          session.id = '';

          if (mask) {
            session.mask = { ...mask };
            session.topic = '';
          }

          set(
            (state) => ({
              currentSessionIndex: 0,
              sessions: [session].concat(state.sessions),
            }),
            false,
          );
        },

        deleteSession(topicId) {
          deleteTopic(topicId).then((data) => {
            if (!data) {
              return;
            }
            const deletingLastSession = get().sessions.length === 1;
            const index = get().sessions.findIndex((session) => session.id === topicId);
            const deletedSession = get().sessions.at(index);

            if (!deletedSession) return;

            const sessions = get().sessions.slice();
            sessions.splice(index, 1);

            const currentIndex = get().currentSessionIndex;
            let nextIndex = Math.min(currentIndex - Number(index < currentIndex), sessions.length - 1);

            if (deletingLastSession) {
              nextIndex = 0;
              sessions.push(createEmptySession());
            }

            // for undo delete action
            // const restoreState = {
            //   currentSessionIndex: get().currentSessionIndex,
            //   sessions: get().sessions.slice(),
            // };

            set(() => ({
              currentSessionIndex: nextIndex,
              sessions,
            }));
            get().selectSession(nextIndex);
            showToast(
              Locale.Home.DeleteToast,
              undefined,
              // {
              //   text: Locale.Home.Revert,
              //   onClick() {
              //     set(() => restoreState);
              //   },
              // },
              5000,
            );
          });
        },

        currentSession() {
          let index = get().currentSessionIndex;
          const sessions = get().sessions;

          if (index < 0 || index >= sessions.length) {
            index = Math.min(sessions.length - 1, Math.max(0, index));
            if (index !== get().currentSessionIndex) {
              set(() => ({ currentSessionIndex: index }));
            }
          }

          const session = sessions[index];

          return session;
        },
        setTopic(topicId: string) {
          createTopicByTopicId(topicId)
            .then((title) => {
              if (!title) {
                return;
              }
              set((state) => {
                // const index = state.currentSessionIndex;
                const _sessions = state.sessions.map((item) => {
                  if (item.id === topicId) {
                    return {
                      ...item,
                      topic: title,
                    };
                  }
                  return item;
                });
                return {
                  sessions: _sessions,
                };
              });
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onNewMessage() {
          get().updateCurrentSession((session) => {
            session.lastUpdate = Date.now();
          });
          // get().updateStat(message);
          // get().summarizeSession();
        },
        handleMessage(message: string): Record<string, any>[] {
          const result = message.split('\n\n').reduce((prev, current, currentIndex, array) => {
            const len = prev.length;
            const index = len;
            const last = prev[index] || '';
            const maybeJSON = last + current;
            try {
              const json = JSON.parse(maybeJSON);
              prev[index] = json;
            } catch (error) {
              if (array.length - 1 !== currentIndex) {
                prev[index] = (prev[index] || '') + current + '\n\n';
              }
            }
            return prev;
          }, [] as (string | Record<string, any> | Record<string, any>[])[]) as (
            | Record<string, any>[]
            | Record<string, any>
          )[];
          return result.flat();
        },
        async onUserInput(content) {
          const session = get().currentSession();
          const userMessage: ChatMessage = createMessage({
            role: 'user',
            content,
          });
          session.streaming = true;
          const botMessage: ChatMessage = createMessage({
            role: 'assistant',
            streaming: true,
            id: userMessage.id! + 1,
          });

          // save user's and bot's message
          get().updateCurrentSession((session) => {
            session.messages.push(userMessage);
            session.messages.push(botMessage);
          });

          // make request

          // const _code = '当然，以下是一个简单的 JavaScript sum 函数的示例：\n\n```javascript\nfunction sum(numbers) {\n  let total = 0;\n  for (let i = 0; i < numbers.length; i++) {\n    total += numbers[i];\n  }\n  return total;\n}\n```\n\n这个函数接受一个数字数组作为参数，并返回它们的总和。你可以像这样调用它：\n\n```javascript\nconst myArray = [1, 2, 3, 4, 5];\nconsole.log(sum(myArray)); // 输出 15\n```'
          // botMessage.streaming = false;
          // botMessage.content = _code;
          // const store = get();
          // const { sessions, currentSessionIndex, globalId } = store;
          // get().onNewMessage(botMessage);
          // set(() => ({}));
          // const encode2Content = he.encode(content);
          get().chatApi({ content, session, botMessage });
        },
        chatApi(chatParams, regenerateParams) {
          const api = chatParams ? chat : regenerateParams ? regenerateChat : undefined;
          if (!api) {
            return;
          }
          const params = chatParams || regenerateParams;
          let content = '';
          let reserveIndex: number;
          if ('content' in params!) {
            content = params.content;
          }
          if ('reserveIndex' in params!) {
            reserveIndex = params.reserveIndex;
          }
          const { session, botMessage } = params!;
          const { mask } = session;
          const { model, temperature, presence_penalty } = useAppConfig.getState().modelConfig;
          const reader = api({
            body: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              msg: content,
              reserveIndex,
              topicId: session.id,
              prePrompt: mask,
              userModalConfig: {
                model,
                temperature,
                presence_penalty,
              },
            },
            onMessage(msg) {
              const _msg = get().handleMessage(msg);
              const _content = _msg
                .map((item: any) => {
                  if (item.error) {
                    message.error(item.error);
                    botMessage.content = item.error;
                    botMessage.isError = true;
                    return '';
                  }
                  if (item.type === 'topicId') {
                    // 设置 topicId
                    set((state) => {
                      const _sessions = state.sessions.slice();
                      const { currentSessionIndex: cIndex } = state;
                      _sessions[cIndex].id = item.topicId;
                      return {
                        sessions: _sessions,
                      };
                    });
                    return '';
                  }
                  return item.choices[0].message.content;
                })
                .filter((item: any) => item !== undefined);
              botMessage.streaming = true;
              botMessage.reader = reader;
              botMessage.content += _content.join('');
              console.log(botMessage.content);
              set(() => ({}));
            },
            onFinish() {
              botMessage.streaming = false;
              session.streaming = false;
              botMessage.reader = undefined;
              const isError = botMessage.isError;
              // botMessage.content = message;
              get().onNewMessage(botMessage);
              set(() => ({}));
              const { sessions } = get();
              const currentSession = sessions.find((item) => item.id === session.id);
              // 没有标题，就设置标题
              if (
                currentSession &&
                currentSession.id &&
                (!currentSession.topic || currentSession.topic === DEFAULT_TOPIC) &&
                !isError
              ) {
                get().setTopic(currentSession.id);
              }
            },
            onError(err: any) {
              message.error(err?.body?.msg || '请求失败');
              botMessage.streaming = false;
              botMessage.isError = true;
              session.streaming = false;
              botMessage.content = err?.body?.msg || '请求失败';
              set(() => ({}));
            },
          });
        },
        async regenerate(topicId?: string, reserveIndex?: number) {
          const { currentSession, sessions } = get();
          topicId = topicId || currentSession().id;
          if (!topicId) {
            // 目前只可能是在页面上创建了对话，因为被未结束的聊天暂缓了，在数据库没有创建对话，只需要删除错误会发，当做新输入的就行
            const session = currentSession();
            const messages = session.messages;
            session.messages = [];
            set({});
            this.onUserInput(messages[0].content);
            return;
          }
          const session = sessions.find((item) => item.id === topicId)!;
          reserveIndex = reserveIndex === undefined ? session.messages.length - 1 - 1 : reserveIndex; // 最后一个
          // const index = session.messages.findIndex((item) => item.id === messageId);
          const messages = session.messages.slice(0, reserveIndex + 1);
          session.streaming = true;
          const botMessage: ChatMessage = createMessage({
            role: 'assistant',
            streaming: true,
            id: '',
          });
          // save user's and bot's message
          messages.push(botMessage);
          session.messages = messages;
          set({ sessions });
          get().chatApi(undefined, { session, botMessage, reserveIndex });
        },

        async deleteMessage(topicId: string, messageId: string) {
          // 暂时只有删除最后一次回答的场景
          deleteMessage(topicId, messageId).then((data) => {
            if (!data) {
              return;
            }
            const { sessions } = get();
            const _sessions = [...sessions];
            const index = _sessions.findIndex((item) => item.id === topicId);
            const session = _sessions[index];
            session.messages = session.messages.filter((item) => item.id !== messageId);
          });
        },
        stopGenerate() {
          const { currentSession } = get();
          const session = currentSession();
          const messages = session.messages;
          const botMessage = messages[messages.length - 1];
          botMessage.reader?.then((reader) => {
            reader?.cancel();
            botMessage.reader = undefined;
            botMessage.streaming = false;
            set({});
          });
        },
        getMemoryPrompt() {
          const session = get().currentSession();

          return {
            role: 'system',
            content: session.memoryPrompt.length > 0 ? Locale.Store.Prompt.History(session.memoryPrompt) : '',
            date: '',
          } as ChatMessage;
        },

        updateMessage(sessionIndex: number, messageIndex: number, updater: (message?: ChatMessage) => void) {
          const sessions = get().sessions;
          const session = sessions.at(sessionIndex);
          const messages = session?.messages;
          updater(messages?.at(messageIndex));
          set(() => ({ sessions }));
        },

        resetSession() {
          get().updateCurrentSession((session) => {
            session.messages = [];
            session.memoryPrompt = '';
          });
        },

        updateCurrentSession(updater) {
          const sessions = get().sessions;
          const index = get().currentSessionIndex;
          updater(sessions[index]);
          set(() => ({ sessions }));
        },

        clearAllData() {
          localStorage.clear();
          location.reload();
        },
      };
    },
    {
      name: StoreKey.Chat,
      version: 2,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              // transactions: new Map(state.transactions),
            },
          };
        },
        // setItem: (name, newValue: StorageValue<BearState>) => {
        setItem: (name, newValue) => {
          // functions cannot be JSON encoded
          // 将第一个没有id的session过滤掉
          newValue.state.sessions = newValue.state.sessions.filter((item: any) => item.id);

          const str = JSON.stringify({
            state: {
              ...newValue.state,
              // transactions: Array.from(newValue.state.transactions.entries()),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      onRehydrateStorage(state: ChatStore) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return (state: ChatStore, error) => {
          /**  判断是否更新对话列表-start **/
          const well_preserved = state?.sessions.find((item) => item.id);
          if (!well_preserved) {
            const personStoreStr = localStorage.getItem(StoreKey.Person);
            try {
              const personStore = personStoreStr ? JSON.parse(personStoreStr) : {};
              if (personStore?.state?.token) {
                state.updateSession();
              }
            } catch (error) {
              /* empty */
            }
          }
          /*** 判断是否更新对话列表-start **/

          return {
            ...state,
            sessions: state.sessions.map((item) => {
              return {
                ...item,
                streaming: false,
                messages: item.messages.map((message) => {
                  return {
                    ...message,
                    streaming: false,
                  };
                }),
              };
            }),
          } as ChatStore;
        };
      },
      // migrate(persistedState, version) {
      //   const state = persistedState as any;
      //   const newState = JSON.parse(JSON.stringify(state)) as ChatStore;

      //   if (version < 2) {
      //     newState.globalId = 0;
      //     newState.sessions = [];

      //     const oldSessions = state.sessions;
      //     for (const oldSession of oldSessions) {
      //       const newSession = createEmptySession();
      //       newSession.topic = oldSession.topic;
      //       newSession.messages = [...oldSession.messages];
      //       newSession.mask.modelConfig.sendMemory = true;
      //       newSession.mask.modelConfig.historyMessageCount = 4;
      //       newSession.mask.modelConfig.compressMessageLengthThreshold = 1000;
      //       newState.sessions.push(newSession);
      //     }
      //   }
      //   return newState;
      // },
    },
  ),
);

import axios from 'axios';
import { history } from '@/history';
// import { message } from 'antd'
import { message } from '@/components/common/antd';
import fetchStream from '@/tools/fetchStream';
import awaitWrap from '@/tools/await-wrap';
import fingerprintFn from '@/tools/fingerprinting';
import { isString } from '@/tools/variable-type';
import { successStatus, loginAgain, waitingForCompletion } from '@/constant';
import widthToken from './width-token';
import { usePersonStore } from '@/store/person';
import type { Mask } from '@/store/utilsFn';
import { waitForDebugger } from 'inspector';

const env = process.env.NODE_ENV;
const dev = env === 'development';
const baseURL = dev ? 'http://127.0.0.1:4001' : 'http://www.qunyangbang.cn/chat-node';
const serverMsg = (error: any) => {
  if (error === undefined) {
    return;
  }
  return isString(error) ? error : '服务器错误，请稍后再试~';
};

axios.interceptors.request.use(async (config) => {
  const [info, err] = await awaitWrap(fingerprintFn());
  const _config = {
    ...config,
  };
  const token = widthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  if (_config.method === 'post' && info) {
    _config.data = {
      ...config.data,
      fingerComponents: info.components,
    };
  }
  return _config;
});

axios.interceptors.response.use(
  (response) => {
    const { data, headers } = response;
    if (headers) {
      const newToken = response.headers['access_token'];
      if (newToken) {
        usePersonStore.setState({
          token: newToken,
        });
      }
    }
    return response;
  },
  (err) => {
    const { response } = err;
    if ((response?.status === 403 && response?.body?.status === loginAgain) || response.status === 401) {
      // 过期3天重新登录
      history.push('/authentication?type=login');
      message.warning('请登录~');
      return Promise.reject('');
    }
    return Promise.reject(response);
  },
);

interface FetchStreamParams {
  onMessage: (msg: string) => void;
  onFinish?: () => void;
  onError?: (err: Error) => void;
  // onMessageError?: (err: any) => void;
  body: Record<string, any>;
}
const fetchStreamUrl = (url: string, params: FetchStreamParams) => {
  const { onMessage, onFinish, body, onError } = params;
  return fetchStream(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    onMessage: (msg: string) => {
      onMessage?.(msg);
    },
    onEnd: () => {
      onFinish?.();
    },
    onError: (err: any) => {
      if (err?.status === 403 && err?.body?.status === loginAgain) {
        history.push('/authentication?type=login');
        return message.info('请重新登录~');
      }
      if (err?.status === 401) {
        history.push('/authentication?type=login');
        return message.info('请登录~');
      }
      if (onError) {
        onError(err);
      } else {
        message.error(serverMsg(err?.body?.msg) || err?.statusText || '服务器错误，请稍后再试~');
      }
    },
  }).catch((err: any) => {
    if (onError) {
      onError(err);
    } else {
      message.error('聊天结束异常，请稍后再试~');
    }
  });
};

interface ChatParams {
  onMessage: (msg: string) => void;
  onFinish: () => void;
  body: { topicId: string; msg: string };
  mask?: Mask;
  onError: (err: any) => void;
}

export const chat = (params: ChatParams) => {
  const url = `${baseURL}/chat`;
  return fetchStreamUrl(url, params);
};
interface RegenerateParams {
  body: { topicId: string; reserveIndex: number; mask?: Mask };
  onMessage: (msg: string) => void;
  onFinish: () => void;
  onError: (err: any) => void;
}
export const regenerateChat = (params: RegenerateParams) => {
  const url = `${baseURL}/regenerate-content`;
  return fetchStreamUrl(url, params);
};
interface RegisterUser {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
}
export const registerUser = (data: RegisterUser) => {
  const url = `${baseURL}/register`;
  return axios
    .post(url, data, {
      withCredentials: true,
    })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '注册失败，请稍后再试~');
        return '';
      }
      return response.data;
    })
    .catch((err: any) => {
      message.error(serverMsg(err?.data?.msg) || '注册失败，请稍后再试~');
      return '';
    });
};
interface LoginUserP {
  email: string;
  password: string;
}
export const LoginUser = (data: LoginUserP) => {
  const url = `${baseURL}/login`;
  return axios
    .post(url, data, {
      withCredentials: true,
    })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '登录失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      message.error(serverMsg(err?.data?.msg) || '登录失败，请稍后再试~');
      return '';
    });
};

export const getTopics = (): Promise<Topic[]> => {
  const url = `${baseURL}/getMyselfTopics`;
  return axios
    .get(url)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '获取话题失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '获取话题失败，请稍后再试~');
      }
      return '';
    });
};

export const createTopicByTopicId = (topicId: string) => {
  const url = `${baseURL}/createTopicByTopicId`;
  return axios
    .post(url, { topicId })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '创建话题失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '创建话题失败，请稍后再试~');
      }
      return '';
    });
};

export const deleteTopic = (topicId: string) => {
  const url = `${baseURL}/deleteTopic`;
  return axios
    .post(url, { topicId })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '删除话题失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '删除话题失败，请稍后再试~');
      }
      return '';
    });
};
export const clearTopics = () => {
  const url = `${baseURL}/clearTopics`;
  return axios
    .post(url)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '删除话题失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '删除话题失败，请稍后再试~');
      }
      return '';
    });
};

export const queryTopicMessages = (topicId: string): Promise<Message[]> => {
  const url = `${baseURL}/queryTopicMessages`;
  return axios
    .post(url, { topicId })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '查询聊天记录失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '查询聊天记录失败，请稍后再试~');
      }
      return '';
    });
};
export const deleteMessage = (topicId: string, messageId: string) => {
  const url = `${baseURL}/deleteMessage`;
  return axios
    .post(url, { topicId, messageId })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '删除消息失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '删除消息失败，请稍后再试~');
      }
      return '';
    });
};

export const queryPrompts = (): Promise<Prompt[]> => {
  const url = `${baseURL}/queryPrompts`;
  return axios
    .get(url)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '查询提示失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '查询提示失败，请稍后再试~');
      }
      return '';
    });
};

export const saveUserPrePrompt = (data: Omit<Prompt, 'id'>) => {
  const url = `${baseURL}/saveUserPrePrompt`;
  return axios
    .post(url, data)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '保存用户预设失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '保存用户预设失败，请稍后再试~');
      }
      return '';
    });
};

export const queryUserPrePrompt = (): Promise<Prompt[]> => {
  const url = `${baseURL}/queryUserPrePrompt`;
  return axios
    .post(url)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '获取用户预设失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '获取用户预设失败，请稍后再试~');
      }
      return '';
    });
};
export const updateUserPrePrompt = (data: Prompt) => {
  const url = `${baseURL}/updateUserPrePrompt`;
  return axios
    .post(url, data)
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '更新用户预设失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '更新用户预设失败，请稍后再试~');
      }
      return '';
    });
};
export const deleteUserPrePrompt = (id: string) => {
  const url = `${baseURL}/deleteUserPrePrompt`;
  return axios
    .post(url, { id })
    .then((response) => {
      if (response?.data?.status !== successStatus) {
        message.error(serverMsg(response?.data?.msg) || '删除用户预设失败，请稍后再试~');
        return '';
      }
      return response.data.data;
    })
    .catch((err: any) => {
      if (err) {
        message.error(serverMsg(err?.data?.msg) || '删除用户预设失败，请稍后再试~');
      }
      return '';
    });
};

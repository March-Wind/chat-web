import axios from 'axios';
import { history } from '@/history';
// import { message } from 'antd'
import { message } from '@/components/common/antd';
import fetchStream from '@/tools/fetchStream';
import awaitWrap from '@/tools/await-wrap';
import fingerprintFn from '@/tools/fingerprinting';
import { isString } from '@/tools/variable-type';
import { successStatus } from '@/constant';
import widthToken from './width-token';
import { DEFAULT_CONFIG } from '@/store/config';
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

axios.interceptors.response.use((response) => {
  const { data } = response;
  // if (data?.status !== successStatus) {
  // message.error(serverMsg(data?.msg) || '服务器错误，请稍后再试~')
  // return Promise.reject(data);
  // }
  // debugger
  return response;
});

interface ChatParams {
  onMessage: (msg: string) => void;
  onFinish: () => void;
  msg: string;
}
export const chat = (params: ChatParams) => {
  const { onMessage, onFinish, msg } = params;
  const url = `${baseURL}/chat`;
  fetchStream(url, {
    method: 'POST',
    body: JSON.stringify({ msg }),
    // body: { msg },
    headers: {
      'Content-Type': 'application/json',
    },
    onmessage: (msg: string) => {
      onMessage?.(msg);
    },
    onclose: () => {
      onFinish?.();
    },
    onerror: (err: any) => {
      if (err?.status === 401) {
        history.push('/authentication?type=login');
        return message.info('请先登录~');
      }
      message.error(serverMsg(err?.body?.msg) || err?.statusText || '服务器错误，请稍后再试~');
    },
  }).catch((err: any) => {
    message.error('聊天结束异常，请稍后再试~');
  });
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
      message.error(serverMsg(err?.data?.msg) || err?.statusText || '注册失败，请稍后再试~');
      return '';
    });
};
interface LoginUser {
  email: string;
  password: string;
}
export const LoginUser = (data: LoginUser) => {
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
      message.error(serverMsg(err?.data?.msg) || err?.statusText || '登录失败，请稍后再试~');
      return '';
    });
};

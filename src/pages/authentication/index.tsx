import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Row,
  Col,
  Card,
  ConfigProvider,
  theme,
  Typography,
  Space,
  App,
} from 'antd';
import { message } from '@/components/common/antd';
import type { InputRef } from 'antd/lib/input/Input';
import { CheckCircleTwoTone, ExclamationCircleTwoTone, InfoCircleTwoTone } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import styles from './index.module.scss';
import { registerUser, LoginUser } from '@/apis/index';
import awaitWrap from '@/tools/await-wrap';
import { usePersonStore } from '@/store/person';
const { useToken } = theme;
const { Password } = Input;

const validatePasswordTipArr = [
  {
    pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\!\@\#\$\%\^\&\*\-\_\?])[0-9a-zA-Z\!\@\#\$\%\^\&\*\-\_\?]+$/,
    message: '必须包含数字、字母、部分特殊符号,这三种字符类型',
  },
  {
    pattern: /[A-Z]+/,
    message: '至少有一个大写字母',
  },
  {
    pattern: /^.{8,16}$/,
    message: '密码长度为8~16位',
  },
];
const validatePasswordTip = (value: string) => {
  return validatePasswordTipArr.map((item) => {
    return item.pattern.test(value);
  });
};

/**
 * 验证密码
 *
 * @param {string} value
 * @return {*}
 */
const validatePassword = (value: string) => {
  const validatePasswordArr = [
    {
      pattern: /.+/,
      message: '请设置密码!',
    },
    {
      pattern: /[A-Z]+/,
      message: '至少有一个大写字母!',
    },
    {
      pattern: /[\!\@\#\$\%\^\&\*\-\_\?]+/,
      message: '至少有一个特殊字符!',
    },
    {
      pattern: /^[0-9a-zA-Z\!\@\#\$\%\^\&\*\-\_\?]+$/,
      message: '有非法字符!',
    },
    {
      pattern: /^.{8,16}$/,
      message: '密码长度为8~16位!',
    },
  ];
  const errItem = validatePasswordArr.find((item) => {
    return !item.pattern.test(value);
  });
  if (errItem) {
    return Promise.reject(errItem.message);
  }
  return Promise.resolve();
};

interface NamePart {
  firstName: string;
  lastName: string;
}
/**
 * 验证姓名
 *
 * @param {NamePart} name
 * @return {*}
 */
const validateName = (name: NamePart) => {
  const { firstName, lastName } = name || {};
  if (!firstName) {
    return Promise.reject('请输入姓氏');
  }
  if (!/^[A-Za-z\u4e00-\u9fa5]{1,10}$/.test(firstName)) {
    return Promise.reject('姓氏长度为1-10个中英文字符');
  }
  if (!lastName) {
    return Promise.reject('请输入名字');
  }
  if (!/^[A-Za-z\u4e00-\u9fa5]{1,10}$/.test(lastName)) {
    return Promise.reject('名字长度为1-10个中英文字符');
  }
  return Promise.resolve();
};

/**
 * 填写姓名组件
 *
 * @param {*} props
 * @return {*}
 */
const Name = (props: any) => {
  const { value } = props;

  const { firstName: defaultFirst, lastName: defaultLast } = value || {};
  const firstNameRef = useRef<InputRef>(null);
  const lastNameRef = useRef<InputRef>(null);
  const onChange = () => {
    const firstName = firstNameRef.current?.input?.value;
    const lastName = lastNameRef.current?.input?.value;
    // const name = `${firstName}${lastName}`
    props?.onChange({
      firstName,
      lastName,
    });
  };
  return (
    <div className={styles.name}>
      <Input
        placeholder="请输入姓氏"
        bordered={false}
        onChange={onChange}
        ref={firstNameRef}
        style={{ flex: '1 1' }}
        defaultValue={defaultFirst}
      />
      <div style={{ width: '14px', background: '#fff', position: 'relative', bottom: '-2px' }}></div>
      <Input
        placeholder="请输入名字"
        bordered={false}
        onChange={onChange}
        ref={lastNameRef}
        style={{ flex: '1 1' }}
        defaultValue={defaultLast}
      />
    </div>
  );
};
interface TabsProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}
interface RegisterFormValues {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  password: string;
  agreement: boolean;
  confirmPassword: string;
}
const Register: FC<TabsProps> = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateInfo } = usePersonStore();
  // const { message } = App.useApp();
  const { setActiveTab } = props;
  const [focusValidate, setFocus] = useState<boolean[]>([]);
  const [focusValidateSates, setFocusValidateSHow] = useState(false);
  const onFinish = async (values: RegisterFormValues) => {
    registerUser(values)
      .then((info: any) => {
        if (info) {
          message.success('注册成功!');
          message.success('请登录~');
          // navigate('/chat')
          updateInfo({
            email: values.email,
            name: values.name,
          });
          setActiveTab('login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFocus = (flag?: boolean) => {
    if (flag === false) {
      setFocusValidateSHow(false);
    } else {
      setFocusValidateSHow(true);
    }
  };
  const passwordStyle: React.CSSProperties = { borderBottom: '1px solid #DCDCDC' };
  // if (focusValidate) {
  //   passwordStyle.marginBottom = '5px';
  // }
  return (
    <Form form={form} initialValues={{ remember: true }} onFinish={onFinish}>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ required: true, message: '请输入邮箱!' }]}
        style={{ borderBottom: '1px solid #DCDCDC' }}
      >
        <Input placeholder="请输入邮箱" bordered={false} style={{ background: '#fff !important' }} />
      </Form.Item>

      <Form.Item
        label="姓名"
        name={'name'}
        required
        style={{ borderBottom: '1px solid #DCDCDC' }}
        validateTrigger="onSubmit"
        rules={[
          {
            validator: (_, value) => {
              return validateName(value);
            },
          },
        ]}
      >
        <Name />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        required
        style={passwordStyle}
        rules={[
          {
            validator(rule, value) {
              const validateTip = validatePasswordTip(value);
              setFocus(validateTip);
              return focusValidateSates ? Promise.reject('') : validatePassword(value);
            },
          },
        ]}
      >
        <Password
          bordered={false}
          placeholder=" 请设置密码"
          onFocus={() => onFocus()}
          onBlur={onFocus.bind(null, false)}
        />
      </Form.Item>
      {focusValidateSates ? (
        <QueueAnim type="alpha" style={{ marginTop: '-15px', color: '#999' }}>
          <div key="1" className={styles['password-tip']}>
            {validatePasswordTipArr.map((item, index) => {
              return (
                <p key={index}>
                  {focusValidate[index] ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ExclamationCircleTwoTone />}{' '}
                  {item.message}
                </p>
              );
            })}
            <div>
              <InfoCircleTwoTone twoToneColor="#52c41a" /> 部分特殊字符包括：!@#$%^&*-_?
            </div>
          </div>
        </QueueAnim>
      ) : null}
      <Form.Item
        name="confirmPassword"
        label="确认密码"
        rules={[
          { required: true, message: '请确认密码!' },
          {
            validator(rule, value) {
              const password = form.getFieldValue('password');
              if (value !== password) {
                return Promise.reject('两次密码输入不一致');
              }
              return Promise.resolve();
            },
          },
        ]}
        style={{ borderBottom: '1px solid #DCDCDC' }}
      >
        <Input bordered={false} type="password" placeholder="请确认密码" />
      </Form.Item>
      <Form.Item
        name="rule"
        valuePropName="checked"
        style={{ textAlign: 'left' }}
        rules={[
          {
            validator: (_, value) => {
              if (value) {
                return Promise.resolve();
              }
              return Promise.reject('请勾选同意协议');
            },
          },
        ]}
      >
        <Checkbox style={{ color: '#666' }}>
          我已阅读并同意《
          <a
            style={{ color: '#333' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/agreement');
            }}
          >
            用户服务协议
          </a>
          》
        </Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit" block style={{ height: '56PX', borderRadius: '12PX' }}>
        注册
      </Button>
    </Form>
  );
};
const Login: FC<TabsProps> = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { email, updateInfo } = usePersonStore();
  const onFinish = (values: any) => {
    LoginUser(values).then((success) => {
      if (success) {
        updateInfo({
          email: values.email,
          name: success.name,
          token: success.token,
        });
        message.success('登录成功，正在跳转...');
        navigate('/chat');
      }
    });
  };

  useEffect(() => {
    form.setFieldValue('email', email);
  }, [form, email]);

  return (
    <Form onFinish={onFinish} form={form} initialValues={{ remember: true }}>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ required: true, message: '请输入邮箱!' }]}
        style={{ borderBottom: '1px solid #DCDCDC' }}
      >
        <Input placeholder="请输入邮箱" bordered={false} />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        // to do 针对输入的密码进行校验，现在不校验的原因，是因为怕有代码逻辑错误，导致校验输入密码不对，所以暂时不校验
        rules={[{ required: true, message: '请输入密码!' }]}
        style={{ borderBottom: '1px solid #DCDCDC' }}
      >
        <Password bordered={false} placeholder=" 请设置密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block style={{ height: '56PX', borderRadius: '12PX' }}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

function Authentication(props: any) {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('type') || 'register';
  const [activeTab, setActiveTab] = useState(tab);
  const { token } = useToken();
  const handleTabChange = (key: any) => {
    setActiveTab(key);
  };
  return (
    <div
      className={styles.register}
      style={{ backgroundColor: token.colorBgContainerDisabled || token.colorBgLayout || token.colorBgBase }}
    >
      <QueueAnim type="bottom" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <div className={styles.heard} key={'1'}>
          {/* <div className={styles.cloud}>
          <img src="../logo.png" alt="logo" />
        </div> */}
        </div>
        <div className={styles['card-box']} key="2">
          <Card className={styles.card} style={{ boxShadow: token.boxShadow }}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              centered
              size="large"
              items={[
                {
                  key: 'register',
                  label: '账户注册',
                  style: { paddingTop: '32px' },
                  children: <Register setActiveTab={setActiveTab} />,
                },
                {
                  key: 'login',
                  label: '登录账号',
                  style: { paddingTop: '32px' },
                  children: <Login setActiveTab={setActiveTab} />,
                },
              ]}
            ></Tabs>
          </Card>
        </div>
      </QueueAnim>
    </div>
  );
}

export default Authentication;

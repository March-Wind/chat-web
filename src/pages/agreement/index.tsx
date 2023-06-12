// 生成一个空组件
import React from 'react';
import { Typography, theme } from 'antd';
import styles from './index.module.scss';

const { Title, Paragraph,
  // Text, Link 
} = Typography;
const { useToken } = theme


const Agreement = () => {
  const { token } = useToken();

  return (
    <div className={styles.agreement} style={{ backgroundColor: token.colorBgLayout || token.colorBgBase }}>
      <Typography>
        <Title level={3}>用户服务协议</Title>
        <Paragraph style={{ textIndent: '2em' }}>欢迎使用我们的AI聊天网站（以下简称“网站”）。请在使用本网站之前仔细阅读本用户服务协议（以下简称“协议”）。通过访问或使用本网站，即表示您同意遵守本协议中规定的所有条款和条件。</Paragraph>
        <Title level={5}>1. 定义</Title>
        <Paragraph style={{ textIndent: '2em' }}>1.1 &quot;网站&quot;指我们的AI聊天网站。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>1.2 &quot;用户&quot;指通过访问和使用本网站的个人或实体。</Paragraph>
        <Title level={5}>2. 条款和条件</Title>
        <Paragraph style={{ textIndent: '2em' }}>2.1 年龄限制：本网站仅限年满18周岁的用户使用。对于未满18周岁的用户，必须在合法监护人的监督下使用本网站。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.2 网站访问限制：我们保留随时更改、暂停或终止网站的权利，包括但不限于对功能、内容或可用性进行更改或限制。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.3 禁止的行为：用户不得利用本网站从事以下行为：</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> a) 侵犯他人的版权、商标权、专利权或其他知识产权；</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> b) 从事违法、滥用、骚扰、诽谤、侵犯他人权利等行为。</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> c) 散布恶意软件、病毒、广告或垃圾邮件；</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> d) 侵犯他人的隐私权；</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> e) 违反适用的法律、法规或规定。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.4 用户行为规范：用户不得通过任何方式破解、篡改、干扰或损害本网站的安全性和功能。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.5 隐私政策：用户使用本网站将受到我们的隐私政策的约束。请仔细阅读我们的隐私政策，了解我们如何收集、使用和保护您的个人信息。</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> a) 用户在使用本网站的服务时可能需要提供一些个人信息，用户同意本网站按照隐私政策的规定收集、存储、使用和披露用户的个人信息。</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> b) 本网站将采取合理的措施保护用户的个人信息，但无法保证绝对的信息安全。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.6 免责声明：</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> a) 本网站提供的信息和建议仅供参考，不构成法律、医学或任何其他专业意见。用户应在依赖该信息或建议之前咨询适当的专业人士。使用本网站的风险由用户自行承担。</Paragraph>
        <Paragraph style={{ textIndent: '4em' }}> b) 如果用户利用AI聊天工具从事触发法律的行为，包括但不限于诽谤、诈骗、侵犯他人知识产权、散布淫秽或非法内容等，用户将独自承担所有法律责任和后果。</Paragraph>
        <Paragraph style={{ textIndent: '2em' }}>2.7 内容专利：用户在本网站上生成的任何内容，如评论、帖子等，将被视为非保密和非专有。用户对其生成内容的准确性和合法性负全部责任。我们保留移除、编辑或拒绝发布用户生成内容的权利。</Paragraph>









      </Typography>
    </div>
  )
}
export default Agreement;
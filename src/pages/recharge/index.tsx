import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Typography, Button, Select, theme, Flex, Descriptions, Row, Col, Card } from 'antd';
import { IconButton } from '@/components/common/button';
import LeftIcon from '@/assets/icons/left.svg';
import Locale from '@/assets/locales';
import weixinpayIcon from '@/assets/icons/weixinpay.png';
import alipayIcon from '@/assets/icons/alipay.png';
import styles from './recharge.module.scss';
import cs from '@/app.module.scss';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';
import { queryProducts, buyProduct } from '@/apis/index';
import type { ProductType } from '@/apis/index';
import type { DescriptionsProps } from 'antd';
import { isEqual } from 'lodash';
const { Text, Title } = Typography;
const { useToken } = theme;
const { Option } = Select;
const Recharge = () => {
  const navigate = useNavigate();
  const { appTheme } = useSwitchTheme();
  const { token } = useToken();
  const [selectedProductId, setSelectedProduct] = useState('');
  const [payType, setPayType] = useState<'wx' | 'ali'>('wx');
  const [products, setProduct] = useState<ProductType[]>([]);

  const isDark = appTheme === 'dark';

  useEffect(() => {
    queryProducts().then((data) => {
      if (data) {
        setProduct(data);
      }
    });
  }, []);
  const selectProduct = useCallback((id: string) => {
    setSelectedProduct(id);
  }, []);
  const submit = useCallback(() => {
    buyProduct({ productId: selectedProductId, payType }).then((data) => {
      if (data) {
        debugger;
        console.log(data);
      }
    });
  }, [selectedProductId, payType]);
  const textColor = isDark ? { color: token.colorTextLightSolid } : {};
  return (
    <div className={styles.recharge}>
      <div className={styles['recharge-header']}>
        {/* 返回 */}
        <IconButton icon={<LeftIcon />} text={Locale.NewChat.Return} onClick={() => navigate(-1)}></IconButton>
      </div>
      <div style={{ width: '500px', margin: '0 auto', padding: '50px 20px 20px' }}>
        {/* 支付类型 */}
        <Flex align="center" vertical wrap="wrap" style={{ marginBottom: 50 }}>
          <Title style={textColor} level={3}>
            购买使用额度
          </Title>
          <Text style={textColor}>提升工作效率，开启摸鱼生活</Text>
        </Flex>
        <Flex wrap="wrap" gap="large" justify="center" style={{ marginBottom: 30 }}>
          {products.map((item, index) => {
            const { effectiveDuration, tokens, price } = item;
            const time = Math.round(effectiveDuration / 60 / 60 / 24);
            const _tokens = Math.round(tokens / 1000);
            const _price = Math.ceil(price / 10 / 10 / 10);
            const items: DescriptionsProps['items'] = [
              {
                key: '0',
                // label: '价格',
                children: (
                  <Flex justify="center" style={{ width: '100%' }}>
                    <Title level={3} type="danger" style={{ textAlign: 'center', color: 'var(--primary)' }}>
                      {_price}元
                    </Title>
                  </Flex>
                ),
              },
              {
                key: '1',
                label: '有效时间',
                children: <Text type="secondary">{time}天</Text>,
              },
              {
                key: '2',
                label: 'token数量',
                children: <Text type="secondary">{_tokens}K</Text>,
              },
            ];
            return (
              <Row key={item.id}>
                <Col>
                  <Card
                    hoverable
                    title={item.name}
                    // style={{
                    //   boxShadow: token.boxShadow,
                    // }}
                    onClick={selectProduct.bind(null, item.id)}
                    className={styles.productBox + ' ' + (selectedProductId === item.id ? styles.selected : '')}
                    styles={{
                      header: { textAlign: 'center', border: 0 },
                      body: { width: '180px', paddingTop: 0 },
                      // extra: { boxShadow: '0px 0px 10px red' },
                      // cover: { boxShadow: '0px 0px 10px red' },
                    }}
                  >
                    <Descriptions column={1} items={items} size="small" />
                  </Card>
                </Col>
              </Row>
            );
          })}
        </Flex>
        <Descriptions
          // title={<Text style={textColor}>充值</Text>}
          labelStyle={{ ...textColor, alignItems: 'center', marginLeft: 33 }}
          contentStyle={{ ...textColor }}
          // colon
        >
          <Descriptions.Item label="支付方式" style={textColor}>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col className="gutter-row">
                <div
                  className={` ${styles.payTypeItem}  ${cs['chat-item']} ${
                    payType === 'wx' && cs['chat-item-selected']
                  }`}
                  title="微信支付"
                >
                  <img className={styles.payIcon} src={weixinpayIcon} alt="" />
                  <Text style={textColor}>微信支付</Text>
                  <i className="ep-icon ep-icon-selected"></i>
                </div>
              </Col>
              {/* <Col className="gutter-row">
                <div
                  className={`${styles.payTypeItem} ${cs['chat-item']} ${!selected && cs['chat-item-selected']}`}
                  title="支付宝支付"
                >
                  <img className={styles.payIcon} src={alipayIcon} alt="" />
                  <Text style={textColor}>支付宝支付</Text>
                  <i className="ep-icon ep-icon-selected"></i>
                </div>
              </Col> */}
            </Row>
          </Descriptions.Item>
        </Descriptions>
        {/* 提交按钮 */}
        <Flex justify="center">
          <Button className={styles.submit} type="primary" block onClick={submit}>
            提交支付
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default memo(Recharge, isEqual);

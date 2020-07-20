import React, { FunctionComponent, useState, useContext } from 'react'
import { Button, Modal, Form, Input, Layout, Row, Col, notification} from 'antd';
import {useParams, useHistory} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import axios from 'axios';



interface TempRegisterProps {
}


export const TempRegister: FunctionComponent<TempRegisterProps> = () => {
  const {inviteId} = useParams()
  console.log('inviteId', inviteId)
  // const { loading, error, data } = useQuery(EXCHANGE_RATES)
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const history = useHistory();
  const [form] = Form.useForm();
  const {t} = useTranslation()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onSubmit = async (values:any) => {
    try {
      const response = await axios.post('http://localhost:8081/temp-signup', {
        password: "temporary",
        type: inviteId ? 'invitation' : 'temporary',
        ...values,
        ...(inviteId ? {inviteId: decodeURIComponent(inviteId)} : undefined)
      })
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('roomName', response.data.roomName)
        history.push('/')
      }
    } catch (e) {
      notification.error({
        message: t('cannot register'),
      })
    }
  }

  return (
    <Layout style={{ margin: 'auto', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Row>
        <Col span="8" style={{margin: 'auto'}}>
          <Form
            {...layout}
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            // onFinishFailed={onFinishFailed}
          >
            <h1>{t('Welcome Stranger :)')}</h1>
            <h3>{t('Unfortunately we don\'t recognise you.')}</h3>
            <Form.Item
              label={t('Username')}
              name="username"
              rules={[{ required: true, message: t('Please input your username!') }]}
            >
              <Input />
            </Form.Item>

            {!inviteId && (
              <Form.Item
                label={t('Room name')}
                name="roomName"
                extra={t('Give your room a meaningful name.')}
                rules={[{ required: true, message: 'Please input your desired room name!' }]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                {!!inviteId ? t('Join Room') : t('Create')}
              </Button>
            </Form.Item>

          </Form>
        </Col>
      </Row>
    </Layout>
  );
}

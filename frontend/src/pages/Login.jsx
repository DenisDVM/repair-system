import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

export default function LoginPage() {
  const onFinish = async (values) => {
    try {
      const res = await axios.post('/api/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('Вход выполнен');
      window.location.href = '/tickets';
    } catch (err) {
      message.error('Неверный логин или пароль');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Введите имя пользователя' }]}>
          <Input prefix={<UserOutlined />} placeholder="Пользователь" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

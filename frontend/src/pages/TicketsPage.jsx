import { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal, message } from 'antd';
import api from '../api/axios';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets/mine');
      setTickets(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке заявок');
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    try {
      await api.post('/tickets', values);
      message.success('Заявка отправлена');
      setFormVisible(false);
      fetchTickets();
    } catch {
      message.error('Ошибка при отправке');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Описание', dataIndex: 'description' },
    { title: 'Статус', dataIndex: 'status' },
    { title: 'Создана', dataIndex: 'created_at' }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setFormVisible(true)}>Создать заявку</Button>
      <Table rowKey="id" loading={loading} dataSource={tickets} columns={columns} style={{ marginTop: 20 }} />

      <Modal
        title="Новая заявка"
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="deviceName" label="Название устройства" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="serialNumber" label="Серийный номер" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание проблемы">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Отправить</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

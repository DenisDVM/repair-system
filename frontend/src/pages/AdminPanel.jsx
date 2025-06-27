import { useEffect, useState } from 'react';
import { Table, Button, message, Select } from 'antd';
import api from '../api/axios';

export default function AdminPanel() {
  const [tickets, setTickets] = useState([]);

  const fetchAll = async () => {
    try {
      const res = await api.get('/tickets/all');
      setTickets(res.data);
    } catch {
      message.error('Ошибка загрузки заявок');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/tickets/${id}/status`, { newStatus });
      message.success('Статус обновлён');
      fetchAll();
    } catch {
      message.error('Ошибка при обновлении статуса');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Пользователь', dataIndex: 'username' },
    { title: 'Устройство', dataIndex: 'device_name' },
    { title: 'Описание', dataIndex: 'description' },
    { title: 'Статус', dataIndex: 'status' },
    {
      title: 'Действия',
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          onChange={(value) => updateStatus(record.id, value)}
          options={[
            { label: 'Open', value: 'Open' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Closed', value: 'Closed' },
          ]}
        />
      ),
    },
  ];

  return <Table rowKey="id" dataSource={tickets} columns={columns} />;
}

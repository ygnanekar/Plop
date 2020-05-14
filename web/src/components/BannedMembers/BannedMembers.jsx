import React, { useEffect, useState } from 'react';
import { Icon, Table, Row, Skeleton, Popconfirm } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { getRoomBanList, updateRoomBanList } from '../../utility/restCalls';
import { displaySimpleNotification } from '../../utility/services';
import 'antd/dist/antd.css';

// rename to BannedMembersList later
export default function BannedMembers() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      let { data } = await getRoomBanList();
      console.log(data);
      setData(
        data.map((item, index) => {
          item.key = index;
          return item;
        })
      );
      setLoading(false);
    })().catch((err) => {
      console.log(err);
    });
  }, [refresh]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p style={{ margin: 0 }}>{text}</p>,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <p style={{ margin: 0 }}>{id}</p>,
    },
    {
      key: 'action',
      render: (item) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popconfirm title={`Are you sure you want to unban ${item.name}?`} onConfirm={() => handleWhitelist(item.id)}>
            <Row type='flex' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}>
              <p style={{ margin: 0 }}>Remove from blacklist</p>
              <Icon type='close-circle' style={{ fontSize: '1.2rem', color: 'red', margin: '0 0.5rem' }} />
            </Row>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleWhitelist = async (id) => {
    try {
      await updateRoomBanList(id);
      setRefresh(!refresh);
      displaySimpleNotification('Success', 4, 'bottomRight', 'Member has been unbanned', 'smile', '#108ee9');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={layout}>
      <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Banned Members List</p>
      {loading ? <Skeleton active /> : <Table columns={columns} dataSource={data} pagination={false} />}
    </div>
  );
}
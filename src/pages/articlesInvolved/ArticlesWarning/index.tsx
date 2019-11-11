import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

interface Person {
  name: string
}
export default function ArticlesWarning(props: Person) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      涉案物品预警
      <Spin spinning={loading} size="large"></Spin>
    </div>
  );
};


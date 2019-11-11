import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

interface Person {
  name: string
}
export default function DossierData(props: Person) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      卷宗数据
      <Spin spinning={loading} size="large"></Spin>
    </div>
  );
};


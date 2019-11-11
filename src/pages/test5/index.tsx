import React, { useState, useEffect } from 'react';
import { Card } from 'antd';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <Card style={{ paddingTop: 100, textAlign: 'center' }}>
      555
      </Card>
  );
};

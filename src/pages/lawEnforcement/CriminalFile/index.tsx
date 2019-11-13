import React, { useState, useEffect } from 'react';
interface Person {
  name: string
}
export default function CriminalFile(props: Person) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <div style={{ paddingTop: 20 }}>
       刑事案件档案
    </div>
  );
};


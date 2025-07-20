import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const useGasData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const cleaned = results.data.filter(row =>
          row['VALUE'] && row['VALUE'] !== '..'
        ).map(row => ({
          date: row['REF_DATE'],
          province: row['GEO'],
          price: parseFloat(row['VALUE']),
        }));
        setData(cleaned);
      }
    });
  }, []);

  return data;
};

export default useGasData;

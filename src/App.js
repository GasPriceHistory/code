import React from 'react';
import useGasData from './hooks/useGasData';
import LineChartGas from './components/LineChart';
import BarChartGas from './components/BarChart';
import ChoroplethMap from './components/ChoroplethMap';
import Header from './components/Header'; 
import "./App.css"

const App = () => {
  const data = useGasData();
  const provinces = [...new Set(data.map(d => d.province))].sort();

  return (
    <div style={{  }}>
      <Header />
      <div style={{padding:35}}>
      {data.length > 0 ? (
        <>
          <LineChartGas data={data} provinces={provinces} />
          <hr style={{ height: '4px', backgroundColor: 'black', border: 'none' }} />
          <ChoroplethMap data={data} provinces={provinces} />

        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
    </div>
  );
};

export default App;

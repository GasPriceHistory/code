import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LineChartGas = ({ data, provinces }) => {
  const [selectedProvinces, setSelectedProvinces] = useState(provinces.slice(0, 3));
  const [dateRange, setDateRange] = useState(["2023-01", "2024-12"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { t } = useTranslation();
  const handleProvinceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedProvinces(prev =>
      checked ? [...prev, value] : prev.filter(p => p !== value)
    );
  };

  const filtered = data.filter(row => 
    selectedProvinces.includes(row.province) &&
    row.date >= dateRange[0] &&
    row.date <= dateRange[1]
  );

  const dates = [...new Set(filtered.map(d => d.date))].sort();
  const grouped = dates.map(date => {
    const entry = { date };
    selectedProvinces.forEach(province => {
      const point = filtered.find(p => p.province === province && p.date === date);
      entry[province] = point?.price || null;
    });
    return entry;
  });

  return (
    <div>
      <h3>{t('lineChartTitle')}</h3>
      
      <label>{t('dateRangeLabel')}</label>
      <input
        value={dateRange[0]}
        onChange={e => setDateRange([e.target.value, dateRange[1]])}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        value={dateRange[1]}
        onChange={e => setDateRange([dateRange[0], e.target.value])}
      />

      <div style={{ position: 'relative', margin: '1rem 0' }}>
        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {t('selectProvinces')} ({selectedProvinces.length})
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid #ccc',
              padding: '0.5rem',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {provinces.map(p => (
              <label key={p} style={{ display: 'block', marginBottom: '0.3rem' }}>
                <input
                  type="checkbox"
                  value={p}
                  checked={selectedProvinces.includes(p)}
                  onChange={handleProvinceChange}
                />
                {' '}{p}
              </label>
            ))}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={grouped}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedProvinces.map((p, i) => (
            <Line
              key={p}
              dataKey={p}
              type="monotone"
              stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"][i % 5]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartGas;

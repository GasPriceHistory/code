import React, { useState, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { geoCentroid } from 'd3-geo';

const cityCoordinates = [
  { name: "Calgary, Alberta", coordinates: [-114.0719, 51.0447] },
  { name: "Charlottetown and Summerside, Prince Edward Island", coordinates: [-63.1311, 46.2382] },
  { name: "Edmonton, Alberta", coordinates: [-113.4909, 53.5444] },
  { name: "Halifax, Nova Scotia", coordinates: [-63.5752, 44.6488] },
  { name: "Montréal, Quebec", coordinates: [-73.5673, 45.5017] },
  { name: "Ottawa-Gatineau, Ontario part, Ontario/Quebec", coordinates: [-75.6972, 45.4215] },
  { name: "Québec, Quebec", coordinates: [-71.2082, 46.8139] },
  { name: "Regina, Saskatchewan", coordinates: [-104.6189, 50.4452] },
  { name: "Saint John, New Brunswick", coordinates: [-66.0577, 45.2733] },
  { name: "Saskatoon, Saskatchewan", coordinates: [-106.6700, 52.1332] },
  { name: "St. John's, Newfoundland and Labrador", coordinates: [-52.7126, 47.5615] },
  { name: "Thunder Bay, Ontario", coordinates: [-89.2477, 48.3809] },
  { name: "Toronto, Ontario", coordinates: [-79.3832, 43.6532] },
  { name: "Vancouver, British Columbia", coordinates: [-123.1207, 49.2827] },
  { name: "Victoria, British Columbia", coordinates: [-123.3656, 48.4284] },
  { name: "Whitehorse, Yukon", coordinates: [-135.0568, 60.7212] },
  { name: "Winnipeg, Manitoba", coordinates: [-97.1384, 49.8951] },
  { name: "Yellowknife, Northwest Territories", coordinates: [-114.3718, 62.4540] }
];

const ChoroplethMap = ({ data, provinces }) => {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });

  const animationRef = useRef(null);
  const tooltipTimer = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup any pending tooltip timers
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

  const availableDates = [...new Set(data.map(d => d.date))].sort();

  const nameMap = {
    "Newfoundland and Labrador": "Terre-Neuve-et-Labrador",
    "Prince Edward Island": "Île-du-Prince-Édouard",
    "Nova Scotia": "Nouvelle-Écosse",
    "New Brunswick": "Nouveau-Brunswick",
    "Quebec": "Québec",
    "Yukon": "Yukon (Territoire du)",
    "Northwest Territories": "Territoires du Nord-Ouest",
    "Nunavut": "Nunavut",
  };

  const pricesByProvince = {};
  provinces.forEach(p => {
    const normalized = nameMap[p] || p;
    const entry = data.find(d => (nameMap[d.province] || d.province) === normalized && d.date === selectedMonth);
    pricesByProvince[normalized] = entry ? entry.price : null;
  });

  const prices = Object.values(pricesByProvince).filter(x => x !== null);
  const colorScale = scaleLinear()
    .domain([Math.min(...prices), Math.max(...prices)])
    .range(["#e0f3f8", "#084081"]);

  const getPriceForCity = (cityName) => {
    const province = cityName.split(", ")[1];
    const entry = data.find(d => d.province && d.province.includes(province) && d.date === selectedMonth);
    return entry ? entry.price.toFixed(2) : null;
  };

  return (
    <div>
      <h3>Choropleth Map – Prices for {selectedMonth}</h3>
      <label>Select Month:</label>
      <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
        {availableDates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <div style={{ width: '100%', maxWidth: 1600 }}>
        <ComposableMap projection="geoAlbers" projectionConfig={{ scale: 450 }}>
          <Geographies geography="/canada.json">
            {({ geographies }) =>
              geographies.map(geo => {
                const provinceName = geo.properties.name;
                const price = pricesByProvince[provinceName];
                const centroid = geoCentroid(geo);

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={price ? colorScale(price) : "#EEE"}
                      stroke="#FFF"
                      style={{ default: { outline: "none" }, pressed: { outline: "none" } }}
                    >
                      <title>{provinceName} — {price ? `${price.toFixed(2)} ¢/L` : "No data"}</title>
                    </Geography>

                    {centroid && (
                      <text
                        x={centroid[0]}
                        y={centroid[1]}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#000"
                      >
                        {price ? `${price.toFixed(2)}¢` : ""}
                      </text>
                    )}
                  </g>
                );
              })
            }
          </Geographies>

          {cityCoordinates.map(city => {
            const price = getPriceForCity(city.name);
            const isHovered = hoveredCity === city.name;

            return (
              <Marker
                key={city.name}
                coordinates={city.coordinates}
                onMouseEnter={(e) => {
                  setHoveredCity(city.name);
                  const { clientX, clientY } = e;

                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current);

                  tooltipTimer.current = setTimeout(() => {
                    setTooltip({
                      visible: true,
                      x: clientX,
                      y: clientY,
                      text: `${city.name} — ${price ? `${price}¢/L` : "No data"}`
                    });
                  }, 250);
                }}
                onMouseMove={(e) => {
                  if (animationRef.current) return;
                  animationRef.current = requestAnimationFrame(() => {
                    setTooltip(prev => ({
                      ...prev,
                      x: e.clientX,
                      y: e.clientY
                    }));
                    animationRef.current = null;
                  });
                }}
                onMouseLeave={() => {
                  setHoveredCity(null);
                  setTooltip({ visible: false, x: 0, y: 0, text: '' });
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
                }}
                style={{ cursor: "pointer" }}
              >
                <circle r={5} fill="#FF5722" stroke="#fff" strokeWidth={1} />
                <text
                  x={0}
                  y={12}
                  fontSize={10}
                  fill={isHovered ? "#000" : "#555"}
                  fontWeight={isHovered ? "bold" : "normal"}
                  textAnchor="middle"
                  style={{ transition: "fill 0.2s ease, font-weight 0.2s ease" }}
                >
                  {price ? `${price}¢` : ""}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            background: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default ChoroplethMap;

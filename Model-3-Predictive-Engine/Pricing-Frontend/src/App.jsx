import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css'; 

function App() {
  const [inputs, setInputs] = useState({
    system_code: "BHMBCCMKT01",
    capacity: 577,
    queue_length: 5,
    is_special_day: 0,
    traffic_condition: "average",
    vehicle_type: "car",
    hour: 14,
    day_of_week: 2
  });

  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [predictedOcc, setPredictedOcc] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/get-price', inputs);
        const { dynamic_price_usd, predicted_occupancy_in_30_mins } = response.data.data;
        
        setCurrentPrice(dynamic_price_usd);
        setPredictedOcc(predicted_occupancy_in_30_mins);

        const timeNow = new Date().toLocaleTimeString([], { hour12: false });
        setPriceData(prev => [...prev.slice(-15), { time: timeNow, price: dynamic_price_usd }]);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };
    fetchPrice();
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === "queue_length" || name === "hour" ? parseInt(value) : value
    }));
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            ML-Driven Dynamic Pricing Engine<span className="title-accent">// XGBOOST Model</span>
          </h1>
          <div className="live-badge">
            <div className="live-dot"></div> System Live
          </div>
        </header>

        <div className="dashboard-grid">
        
          {/* Left Sidebar: Controls */}
          <div className="panel-card">
            <h3 className="panel-title">Simulation Parameters</h3>
            
            <div className="input-group">
              <div className="input-label">
                <span>Queue Length</span> 
                <span className="highlight-value">{inputs.queue_length} vehicles</span>
              </div>
              <input type="range" name="queue_length" min="0" max="20" value={inputs.queue_length} onChange={handleChange} className="custom-slider" />
            </div>

            <div className="input-group">
              <div className="input-label">
                <span>Time of Day</span> 
                <span className="highlight-value">{inputs.hour}:00</span>
              </div>
              <input type="range" name="hour" min="0" max="23" value={inputs.hour} onChange={handleChange} className="custom-slider" />
            </div>

            <div className="input-group">
              <div className="input-label">
                <span>Traffic Condition</span>
              </div>
              <select name="traffic_condition" value={inputs.traffic_condition} onChange={handleChange} className="custom-select">
                <option value="low">Low Congestion</option>
                <option value="average">Average Congestion</option>
                <option value="high">High Congestion</option>
              </select>
            </div>

            <div className="input-group">
              <div className="input-label">
                <span>Primary Vehicle Type</span>
              </div>
              <select name="vehicle_type" value={inputs.vehicle_type} onChange={handleChange} className="custom-select">
                <option value="cycle">Cycle</option>
                <option value="bike">Motorcycle</option>
                <option value="car">Standard Car</option>
                <option value="truck">Heavy Truck</option>
              </select>
            </div>
          </div>

          {/* Right Main Area: Analytics */}
          <div>
            <div className="metric-grid">
              <div className="metric-card">
                <span className="metric-title">Current Optimal Price</span>
                <span className="metric-value text-green">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">30-Min Occupancy Forecast</span>
                <span className="metric-value text-blue">
                  {predictedOcc} <span className="capacity-text">/ {inputs.capacity}</span>
                </span>
              </div>
            </div>

            <div className="panel-card chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 25]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toFixed(1)}`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} itemStyle={{ color: "#3b82f6" }} />
                  <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
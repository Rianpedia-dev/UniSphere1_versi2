import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Charts.css';

function LineChartComponent({ data }) {
  // Check if data is empty or has no values to display
  const hasData = data && data.length > 0 && data.some(item => 
    item.positive !== 0 || item.neutral !== 0 || item.negative !== 0
  );

  return (
    <div className="line-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        {hasData ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: 'var(--radius-md)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="positive" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="neutral" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="negative" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        ) : (
          <div className="no-data-placeholder">
            <p>No data available</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
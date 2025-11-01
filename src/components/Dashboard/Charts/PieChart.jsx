import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Charts.css';

function PieChartComponent({ data }) {
  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

  // Check if data is empty or has no values to display
  const hasData = data && data.length > 0 && data.some(item => item.value > 0);

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        {hasData ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: 'var(--radius-md)'
              }} 
            />
            <Legend />
          </PieChart>
        ) : (
          <div className="no-data-placeholder">
            <p>No data available</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
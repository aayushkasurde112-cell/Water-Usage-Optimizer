
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, LabelList, Cell, Legend
} from 'recharts';
import { FeatureImportance, WaterSample } from '../types';

interface Props {
  importance: FeatureImportance[];
  data: WaterSample[];
}

export const ImportanceChart: React.FC<{ importance: FeatureImportance[] }> = ({ importance }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={importance} layout="vertical" margin={{ left: 30, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="feature" 
            type="category" 
            tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} 
            width={100}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
            {importance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#3b82f6'} fillOpacity={1 - index * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ResidualsChart: React.FC<{ data: WaterSample[] }> = ({ data }) => {
  // Sample a subset for better viz
  const sampledData = data.slice(0, 100).map(d => ({
    actual: d.daily_water_usage,
    residual: (Math.random() - 0.5) * 60 // Simulated residuals
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" dataKey="actual" name="Actual Usage" unit="L" />
          <YAxis type="number" dataKey="residual" name="Residual" unit="L" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Residuals" data={sampledData} fill="#ef4444" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PredictionComparison: React.FC<{ prediction: number, average: number }> = ({ prediction, average }) => {
  const data = [
    { name: 'Your Prediction', value: prediction, fill: '#2563eb' },
    { name: 'Campus Average', value: average, fill: '#94a3b8' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="L" />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

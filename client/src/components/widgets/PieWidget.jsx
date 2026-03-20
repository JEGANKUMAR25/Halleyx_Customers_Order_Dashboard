import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { buildPieData } from '../../utils/widgetUtils';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieWidget = ({ widget, orders }) => {
  const { title, config = {} } = widget;
  const { pieDataField = 'Status', showLegend = true } = config;
  const data = buildPieData(orders, pieDataField);
  const colSpan = Math.min(widget.width || 4, 12);

  return (
    <div className="widget-card" style={{ gridColumn: `span ${colSpan}` }}>
      <div className="widget-header">
        <span className="widget-title">🥧 {title}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>by {pieDataField}</span>
      </div>
      <div className="widget-body">
        {data.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 16px' }}>
            <span className="icon" style={{ fontSize: 32 }}>📭</span>
            <p>No data — add some orders first</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13 }}
              />
              {showLegend && (
                <Legend
                  iconSize={10}
                  wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 8 }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PieWidget;

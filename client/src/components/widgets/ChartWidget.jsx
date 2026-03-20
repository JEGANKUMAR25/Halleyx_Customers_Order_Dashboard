import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';
import { buildChartData } from '../../utils/widgetUtils';

const CHART_ICONS = { bar: '📊', line: '📈', area: '🗺️', scatter: '🔵' };

const ChartWidget = ({ widget, orders }) => {
  const { type, title, config = {} } = widget;
  const { xAxis = 'Product', yAxis = 'Total Amount', chartColor = '#54bd95', showDataLabels = false } = config;
  const data = buildChartData(orders, xAxis, yAxis);

  const colSpan = Math.min(widget.width || 5, 12);
  const chartHeight = 220 + (widget.height - 1) * 30;

  const commonProps = {
    data,
    margin: { top: showDataLabels ? 20 : 8, right: 16, bottom: 8, left: 0 },
  };

  const axisProps = {
    xAxis: <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />,
    yAxis: <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />,
    grid: <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />,
    tooltip: <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13 }} />,
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]}>
              {showDataLabels && <LabelList dataKey="value" position="top" style={{ fill: '#94a3b8', fontSize: 10 }} />}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ fill: chartColor, r: 4 }}>
              {showDataLabels && <LabelList dataKey="value" position="top" style={{ fill: '#94a3b8', fontSize: 10 }} />}
            </Line>
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <defs>
              <linearGradient id={`grad-${widget._id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={chartColor} fill={`url(#grad-${widget._id})`} strokeWidth={2}>
              {showDataLabels && <LabelList dataKey="value" position="top" style={{ fill: '#94a3b8', fontSize: 10 }} />}
            </Area>
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Scatter dataKey="value" data={data.map((d, i) => ({ x: i, y: d.value, name: d.name }))} fill={chartColor} />
          </ScatterChart>
        );
      default: return null;
    }
  };

  return (
    <div className="widget-card" style={{ gridColumn: `span ${colSpan}` }}>
      <div className="widget-header">
        <span className="widget-title">{CHART_ICONS[type] || '📊'} {title}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{xAxis} × {yAxis}</span>
      </div>
      <div className="widget-body">
        {data.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 16px' }}>
            <span className="icon" style={{ fontSize: 32 }}>📭</span>
            <p>No data yet — add some orders first</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartWidget;

import React from 'react';
import { computeKPI } from '../../utils/widgetUtils';

const KPIWidget = ({ widget, orders }) => {
  const { config = {}, title, description } = widget;
  const { metric, aggregation, dataFormat, decimalPrecision } = config;
  const value = computeKPI(orders, metric, aggregation, dataFormat, decimalPrecision);

  return (
    <div className="widget-card" style={{ gridColumn: `span ${Math.min(widget.width || 2, 12)}` }}>
      <div className="widget-header">
        <span className="widget-title">🎯 {title || 'KPI'}</span>
      </div>
      <div className="widget-body">
        <div className="kpi-value accent">{value}</div>
        <div className="kpi-metric">
          {aggregation || 'Count'} of {metric}
        </div>
        {description && <div className="kpi-desc">{description}</div>}
      </div>
    </div>
  );
};

export default KPIWidget;

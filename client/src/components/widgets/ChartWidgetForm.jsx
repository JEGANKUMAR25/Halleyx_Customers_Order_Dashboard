import React, { useState } from 'react';
import { CHART_TYPES, AXIS_FIELDS } from '../../utils/widgetUtils';

const ChartWidgetForm = ({ onSave, onCancel, initial, chartType: forcedType }) => {
  const [type, setType] = useState(initial?.type || forcedType || 'bar');
  const [title, setTitle] = useState(initial?.title || 'Untitled Chart');
  const [desc, setDesc] = useState(initial?.description || '');
  const [width, setWidth] = useState(initial?.width || 5);
  const [height, setHeight] = useState(initial?.height || 5);
  const [cfg, setCfg] = useState({
    xAxis: 'Product', yAxis: 'Total Amount',
    chartColor: '#54bd95', showDataLabels: false,
    ...(initial?.config || {}),
  });
  const setC = (k, v) => setCfg((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ type, title, description: desc, width: parseInt(width) || 5, height: parseInt(height) || 5, config: cfg });
  };

  return (
    <div>
      {!forcedType && (
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Chart Type</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
            {CHART_TYPES.map((ct) => (
              <div
                key={ct.id}
                className={`widget-type-card ${type === ct.id ? 'selected' : ''}`}
                style={{ minWidth: 100 }}
                onClick={() => setType(ct.id)}
              >
                <span className="icon">{ct.icon}</span>
                <span className="label">{ct.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Widget Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Widget Type</label>
          <input type="text" readOnly value={CHART_TYPES.find((c) => c.id === type)?.label || type} />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">📐 Widget Size</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Width</label>
            <input type="number" min="1" max="12" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Height</label>
            <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">📊 Data Settings</div>
        <div className="form-grid">
          <div className="form-group">
            <label>X-Axis</label>
            <select value={cfg.xAxis} onChange={(e) => setC('xAxis', e.target.value)}>
              {AXIS_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Y-Axis</label>
            <select value={cfg.yAxis} onChange={(e) => setC('yAxis', e.target.value)}>
              {AXIS_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">🎨 Styling</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Chart Color (HEX)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="color-preview" style={{ background: cfg.chartColor }} />
              <input type="color" value={cfg.chartColor} onChange={(e) => setC('chartColor', e.target.value)} style={{ width: 60 }} />
              <input type="text" value={cfg.chartColor} onChange={(e) => setC('chartColor', e.target.value)} style={{ fontFamily: 'monospace', maxWidth: 110 }} />
            </div>
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end', paddingTop: 24 }}>
            <label className="checkbox-wrap">
              <input type="checkbox" checked={cfg.showDataLabels} onChange={(e) => setC('showDataLabels', e.target.checked)} />
              Show Data Labels
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add Chart Widget</button>
      </div>
    </div>
  );
};

export default ChartWidgetForm;

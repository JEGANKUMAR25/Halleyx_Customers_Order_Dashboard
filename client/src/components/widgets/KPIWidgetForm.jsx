import React, { useState } from 'react';
import {
  METRIC_FIELDS, NUMERIC_FIELDS, AGGREGATIONS, DATA_FORMATS,
} from '../../utils/widgetUtils';

const defaultConfig = {
  metric: 'Total Amount',
  aggregation: 'Sum',
  dataFormat: 'Currency',
  decimalPrecision: 2,
};

const KPIWidgetForm = ({ onSave, onCancel, initial }) => {
  const [title, setTitle] = useState(initial?.title || 'Untitled KPI');
  const [desc, setDesc] = useState(initial?.description || '');
  const [width, setWidth] = useState(initial?.width || 2);
  const [height, setHeight] = useState(initial?.height || 2);
  const [cfg, setCfg] = useState(initial?.config || defaultConfig);

  const setC = (k, v) => setCfg((p) => ({ ...p, [k]: v }));
  const isNumeric = NUMERIC_FIELDS.includes(cfg.metric);

  const handleSave = () => {
    onSave({
      type: 'kpi',
      title,
      description: desc,
      width: parseInt(width) || 2,
      height: parseInt(height) || 2,
      config: {
        ...cfg,
        aggregation: isNumeric ? cfg.aggregation : 'Count',
      },
    });
  };

  return (
    <div>
      <div className="form-grid">
        <div className="form-group">
          <label>Widget Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Widget Type</label>
          <input type="text" readOnly value="KPI" />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">📐 Widget Size</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Width (grid columns)</label>
            <input type="number" min="1" max="12" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Height (grid rows)</label>
            <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">📊 Data Settings</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Select Metric</label>
            <select value={cfg.metric} onChange={(e) => setC('metric', e.target.value)}>
              {METRIC_FIELDS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Aggregation</label>
            <select
              value={isNumeric ? cfg.aggregation : 'Count'}
              onChange={(e) => setC('aggregation', e.target.value)}
              disabled={!isNumeric}
            >
              {AGGREGATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Data Format</label>
            <select value={cfg.dataFormat} onChange={(e) => setC('dataFormat', e.target.value)}>
              {DATA_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Decimal Precision</label>
            <input type="number" min="0" value={cfg.decimalPrecision} onChange={(e) => setC('decimalPrecision', parseInt(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="modal-footer" style={{ padding: '20px 0 0', background: 'none', border: 'none' }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add KPI Widget</button>
      </div>
    </div>
  );
};

export default KPIWidgetForm;

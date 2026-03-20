import React, { useState } from 'react';
import { PIE_DATA_FIELDS } from '../../utils/widgetUtils';

const PieWidgetForm = ({ onSave, onCancel, initial }) => {
  const [title, setTitle] = useState(initial?.title || 'Untitled Pie');
  const [desc, setDesc] = useState(initial?.description || '');
  const [width, setWidth] = useState(initial?.width || 4);
  const [height, setHeight] = useState(initial?.height || 4);
  const [cfg, setCfg] = useState({
    pieDataField: 'Status',
    showLegend: true,
    ...(initial?.config || {}),
  });
  const setC = (k, v) => setCfg((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ type: 'pie', title, description: desc, width: parseInt(width) || 4, height: parseInt(height) || 4, config: cfg });
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
          <input type="text" readOnly value="Pie Chart" />
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
        <div className="form-section-title">🥧 Data Settings</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Chart Data Field</label>
            <select value={cfg.pieDataField} onChange={(e) => setC('pieDataField', e.target.value)}>
              {PIE_DATA_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end', paddingTop: 24 }}>
            <label className="checkbox-wrap">
              <input type="checkbox" checked={cfg.showLegend} onChange={(e) => setC('showLegend', e.target.checked)} />
              Show Legend
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add Pie Chart</button>
      </div>
    </div>
  );
};

export default PieWidgetForm;

import React, { useState } from 'react';
import { TABLE_COLUMNS } from '../../utils/widgetUtils';

const SORT_OPTIONS = ['Ascending', 'Descending'];
const PAGE_SIZES = [5, 10, 15];
const FILTER_OPS = ['equals', 'contains', 'starts with', 'greater than', 'less than'];

const TableWidgetForm = ({ onSave, onCancel, initial }) => {
  const [title, setTitle] = useState(initial?.title || 'Untitled Table');
  const [desc, setDesc] = useState(initial?.description || '');
  const [width, setWidth] = useState(initial?.width || 4);
  const [height, setHeight] = useState(initial?.height || 4);
  const [cfg, setCfg] = useState({
    columns: ['Customer Name', 'Product', 'Total Amount', 'Status'],
    sortBy: 'Order Date',
    sortOrder: 'Ascending',
    pageSize: 10,
    filters: [],
    fontSize: 14,
    headerBgColor: '#54bd95',
    ...(initial?.config || {}),
  });
  const setC = (k, v) => setCfg((p) => ({ ...p, [k]: v }));

  const toggleColumn = (col) => {
    setC('columns', cfg.columns.includes(col)
      ? cfg.columns.filter((c) => c !== col)
      : [...cfg.columns, col]);
  };

  const addFilter = () => {
    setC('filters', [...(cfg.filters || []), { field: TABLE_COLUMNS[0], operator: 'contains', value: '' }]);
  };

  const updateFilter = (i, k, v) => {
    const f = [...(cfg.filters || [])];
    f[i] = { ...f[i], [k]: v };
    setC('filters', f);
  };

  const removeFilter = (i) => {
    setC('filters', cfg.filters.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    onSave({ type: 'table', title, description: desc, width: parseInt(width) || 4, height: parseInt(height) || 4, config: cfg });
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
          <input type="text" readOnly value="Table" />
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
        <div className="form-section-title">📋 Data Settings</div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Select Columns (click to toggle)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {TABLE_COLUMNS.map((col) => (
              <button
                key={col}
                type="button"
                className={`btn btn-sm ${cfg.columns.includes(col) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleColumn(col)}
              >
                {cfg.columns.includes(col) ? '✓ ' : ''}{col}
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Sort Order</label>
            <select value={cfg.sortOrder} onChange={(e) => setC('sortOrder', e.target.value)}>
              {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Sort By</label>
            <select value={cfg.sortBy} onChange={(e) => setC('sortBy', e.target.value)}>
              {['Order Date', ...TABLE_COLUMNS].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Rows per page</label>
            <select value={cfg.pageSize} onChange={(e) => setC('pageSize', parseInt(e.target.value))}>
              {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label>Filters</label>
            <button type="button" className="btn btn-sm btn-outline" onClick={addFilter}>+ Add Filter</button>
          </div>
          {(cfg.filters || []).map((filter, i) => (
            <div key={i} className="filter-row" style={{ marginBottom: 8 }}>
              <select value={filter.field} onChange={(e) => updateFilter(i, 'field', e.target.value)}>
                {TABLE_COLUMNS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filter.operator} onChange={(e) => updateFilter(i, 'operator', e.target.value)}>
                {FILTER_OPS.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
              <input type="text" placeholder="Value" value={filter.value} onChange={(e) => updateFilter(i, 'value', e.target.value)} />
              <button type="button" className="btn-icon" onClick={() => removeFilter(i)} style={{ color: 'var(--danger)' }}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">🎨 Styling</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Font Size ({cfg.fontSize}px)</label>
            <input type="range" min="12" max="18" value={cfg.fontSize} onChange={(e) => setC('fontSize', parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Header Background Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="color-preview" style={{ background: cfg.headerBgColor }} />
              <input type="color" value={cfg.headerBgColor} onChange={(e) => setC('headerBgColor', e.target.value)} style={{ width: 60 }} />
              <input type="text" value={cfg.headerBgColor} onChange={(e) => setC('headerBgColor', e.target.value)} style={{ fontFamily: 'monospace', maxWidth: 110 }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add Table Widget</button>
      </div>
    </div>
  );
};

export default TableWidgetForm;

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { WIDGET_TYPES } from '../../utils/widgetUtils';
import KPIWidgetForm from './KPIWidgetForm';
import ChartWidgetForm from './ChartWidgetForm';
import PieWidgetForm from './PieWidgetForm';
import TableWidgetForm from './TableWidgetForm';

const AddWidgetModal = ({ onAdd, onClose }) => {
  const [step, setStep] = useState('select'); // select | configure
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (id) => {
    setSelectedType(id);
    setStep('configure');
  };

  const handleSave = (widgetData) => {
    onAdd(widgetData);
    onClose();
  };

  const handleBack = () => {
    setStep('select');
    setSelectedType(null);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'kpi': return <KPIWidgetForm onSave={handleSave} onCancel={handleBack} />;
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter': return <ChartWidgetForm onSave={handleSave} onCancel={handleBack} chartType={selectedType} />;
      case 'pie': return <PieWidgetForm onSave={handleSave} onCancel={handleBack} />;
      case 'table': return <TableWidgetForm onSave={handleSave} onCancel={handleBack} />;
      default: return null;
    }
  };

  return (
    <Modal
      title={step === 'select' ? '➕ Add Widget' : `Configure ${WIDGET_TYPES.find(t => t.id === selectedType)?.label}`}
      subtitle={step === 'select' ? 'Choose a widget type to add to your dashboard' : 'Set your widget preferences'}
      onClose={onClose}
      size="lg"
    >
      {step === 'select' ? (
        <div>
          <div className="widget-type-grid">
            {WIDGET_TYPES.map((wt) => (
              <div key={wt.id} className="widget-type-card" onClick={() => handleSelectType(wt.id)}>
                <span className="icon">{wt.icon}</span>
                <div className="label">{wt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{wt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className="btn btn-sm btn-secondary" onClick={handleBack} style={{ marginBottom: 16 }}>
            ← Back to selection
          </button>
          {renderForm()}
        </div>
      )}
    </Modal>
  );
};

export default AddWidgetModal;

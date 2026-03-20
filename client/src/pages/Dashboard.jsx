import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getOrders, getWidgets, createWidget, deleteWidget, updateWidget } from '../api';
import { useToastContext } from '../App';
import AddWidgetModal from '../components/widgets/AddWidgetModal';
import KPIWidget from '../components/widgets/KPIWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import PieWidget from '../components/widgets/PieWidget';
import TableWidget from '../components/widgets/TableWidget';
import ChartGenerator from '../components/ai/ChartGenerator';
import InsightsPanel from '../components/ai/InsightsPanel';
import { LayoutDashboard, RefreshCw, Plus, Trash2, GripHorizontal, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const renderWidget = (widget, orders, onDelete) => {
  const actions = (
    <button 
      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100"
      onClick={() => onDelete(widget._id)} 
      title="Remove widget"
    >
      <Trash2 size={16} />
    </button>
  );

  const wrapWithActions = (Component) => (
    <div className="glass-card relative group h-full flex flex-col pt-8">
      {actions}
      <Component widget={widget} orders={orders} />
    </div>
  );

  switch (widget.type) {
    case 'kpi': return wrapWithActions(KPIWidget);
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter': return wrapWithActions(ChartWidget);
    case 'pie': return wrapWithActions(PieWidget);
    case 'table': return wrapWithActions(TableWidget);
    default: return null;
  }
};

const Dashboard = () => {
  const addToast = useToastContext();
  const [orders, setOrders] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, widgetsRes] = await Promise.all([getOrders(), getWidgets()]);
      setOrders(ordersRes.data?.data || []);
      setWidgets(widgetsRes.data?.data || []);
    } catch {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddWidget = async (widgetData) => {
    try {
      const res = await createWidget(widgetData);
      setWidgets((prev) => [...prev, res.data.data]);
      addToast(`${widgetData.title} added to dashboard! ✨`, 'success');
      setShowAddModal(false);
    } catch {
      addToast('Failed to add widget', 'error');
    }
  };

  const handleDeleteWidget = async (id) => {
    try {
      await deleteWidget(id);
      setWidgets((prev) => prev.filter((w) => w._id !== id));
      addToast('Widget removed', 'info');
    } catch {
      addToast('Failed to remove widget', 'error');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const newWidgets = Array.from(widgets);
    const [moved] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, moved);
    setWidgets(newWidgets);
    try {
      await Promise.all(newWidgets.map((w, i) => updateWidget(w._id, { position: { x: 0, y: i } })));
    } catch { /* non-critical */ }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" size={32} />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Monitor your business performance and configure widgets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button-secondary" onClick={fetchData} title="Refresh Data">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="glass-button-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Widget
          </button>
        </div>
      </div>

      {/* AI Enhancements */}
      <ChartGenerator onAddWidget={handleAddWidget} />
      <InsightsPanel />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-400', border: 'border-blue-500/50' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-indigo-400', border: 'border-indigo-500/50' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-400', border: 'border-amber-500/50' },
          { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/50' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card border-t-2 ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm tracking-wider uppercase">{stat.label}</h3>
              <stat.icon size={20} className={`${stat.color} opacity-80`} />
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {loading ? <div className="h-9 w-24 bg-white/10 rounded animate-pulse" /> : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Widgets Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-slate-300">Loading dashboard...</h3>
        </div>
      ) : widgets.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex flex-col items-center justify-center py-24 text-center">
          <LayoutDashboard size={48} className="text-slate-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No widgets yet</h3>
          <p className="text-slate-400 mb-6">Build your custom analytics dashboard by adding widgets.</p>
          <button className="glass-button-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add First Widget
          </button>
        </motion.div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-12 gap-6"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {widgets.map((widget, index) => (
                  <Draggable key={widget._id} draggableId={widget._id} index={index}>
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        style={{
                          gridColumn: `span ${Math.min(widget.width || 4, 12)}`,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          ...prov.draggableProps.style,
                        }}
                        className={`relative group ${snapshot.isDragging ? 'z-50 shadow-2xl scale-105' : 'z-10'} transition-transform duration-200`}
                      >
                        <div
                          {...prov.dragHandleProps}
                          className="absolute top-4 left-4 z-20 cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 bg-black/20 rounded backdrop-blur-md"
                        >
                          <GripHorizontal size={14} />
                        </div>
                        {renderWidget(widget, orders, handleDeleteWidget)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {showAddModal && (
        <AddWidgetModal
          onAdd={handleAddWidget}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

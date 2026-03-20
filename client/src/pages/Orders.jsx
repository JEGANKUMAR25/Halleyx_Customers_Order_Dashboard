import React, { useState, useEffect, useCallback } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api';
import { useToastContext } from '../App';
import OrderForm from '../components/orders/OrderForm';
import OrdersTable from '../components/orders/OrdersTable';
import Modal from '../components/common/Modal';
import { PackageSearch, RefreshCw, Plus, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const addToast = useToastContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      let fetchedOrders = res.data?.data || [];
      
      try {
        const { getAnomalies } = require('../api');
        const aiRes = await getAnomalies();
        if (aiRes.data?.success && aiRes.data?.anomalyRecordIds) {
          const anomalySet = new Set(aiRes.data.anomalyRecordIds);
          fetchedOrders = fetchedOrders.map(o => ({
            ...o,
            isAnomaly: anomalySet.has(o._id)
          }));
        }
      } catch (err) {
        console.error('Failed to fetch anomalies', err);
      }
      
      setOrders(fetchedOrders);
    } catch {
      addToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSubmit = async (formData) => {
    try {
      if (editOrder) {
        await updateOrder(editOrder._id, formData);
        addToast('Order updated successfully! ✅', 'success');
      } else {
        await createOrder(formData);
        addToast('Order created successfully! 🎉', 'success');
      }
      setShowForm(false);
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save order';
      addToast(msg, 'error');
      throw err;
    }
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => setDeleteConfirm(id);

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(deleteConfirm);
      addToast('Order deleted', 'info');
      setDeleteConfirm(null);
      fetchOrders();
    } catch {
      addToast('Failed to delete order', 'error');
    }
  };

  const StatusCard = ({ title, count, icon: Icon, colorClass }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card flex-1 min-w-[200px] border-t-2 ${colorClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium text-sm tracking-wider uppercase">{title}</h3>
        <Icon size={20} className="text-slate-300 opacity-50" />
      </div>
      <div className="text-4xl font-bold text-white">{count}</div>
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PackageSearch className="text-blue-500" size={32} />
            Customer Orders
          </h1>
          <p className="text-slate-400 mt-2">Manage customer purchases and monitor fulfillment status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button-secondary" onClick={fetchOrders} title="Refresh Data">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="glass-button-primary" onClick={() => { setEditOrder(null); setShowForm(true); }}>
            <Plus size={18} />
            New Order
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="flex flex-wrap gap-6">
        <StatusCard 
          title="Pending" 
          count={orders.filter(o => o.status === 'Pending').length} 
          icon={AlertCircle}
          colorClass="border-amber-500/50"
        />
        <StatusCard 
          title="In Progress" 
          count={orders.filter(o => o.status === 'In Progress').length} 
          icon={TrendingUp}
          colorClass="border-blue-500/50"
        />
        <StatusCard 
          title="Completed" 
          count={orders.filter(o => o.status === 'Completed').length} 
          icon={CheckCircle2}
          colorClass="border-emerald-500/50"
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex-1 min-w-[240px] border-t-2 border-indigo-500/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm tracking-wider uppercase">Total Revenue</h3>
            <span className="text-indigo-400 font-bold">$</span>
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            ${orders.reduce((s, o) => s + (parseFloat(o.totalAmount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </motion.div>
      </div>

      {/* Main Table Container */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-0 overflow-hidden">
        <OrdersTable orders={orders} loading={loading} onEdit={handleEdit} onDelete={handleDeleteClick} />
      </motion.div>

      {/* Modals */}
      {showForm && (
        <Modal
          title={editOrder ? 'Edit Order' : 'New Order'}
          subtitle={editOrder ? 'Modify the order details below' : 'Fill in the customer and order details'}
          onClose={() => { setShowForm(false); setEditOrder(null); }}
          size="lg"
        >
          <OrderForm onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditOrder(null); }} editData={editOrder} />
        </Modal>
      )}

      {deleteConfirm && (
        <Modal
          title="Delete Order"
          subtitle="This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          footer={
            <>
              <button className="glass-button-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="glass-button-danger" onClick={handleDeleteConfirm}>Delete Order</button>
            </>
          }
        >
          <p className="text-slate-300 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            Are you sure you want to delete this order? All data will be permanently removed from the database.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Orders;

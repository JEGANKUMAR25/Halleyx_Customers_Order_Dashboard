import React, { useState } from 'react';
import { Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';

const OrdersTable = ({ orders, onEdit, onDelete, loading }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const PAGE_SIZE = 10;

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.product?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  });

  const total = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-medium text-slate-300">Loading orders...</h3>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const map = {
      'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${map[status] || 'bg-slate-500/20 text-slate-400'}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            className="glass-input pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <span className="text-sm font-medium text-slate-400 bg-black/20 px-4 py-2 rounded-full border border-white/5">
          {filtered.length} Records Found
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paged.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-slate-300">No orders found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((o) => {
                // Temporary anomaly detection styling based purely on massive amount > $5000
                const isAnomaly = o.isAnomaly || parseFloat(o.totalAmount) > 5000;
                
                return (
                  <tr key={o._id} className={`hover:bg-white/[0.02] transition-colors ${isAnomaly ? 'bg-red-500/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        {isAnomaly && <AlertTriangle size={16} className="text-red-500 animate-pulse" title="Anomaly Detected" />}
                        {o.firstName} {o.lastName}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{o.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="truncate max-w-[200px]">{o.product}</div>
                      <div className="text-xs text-slate-500 mt-1">Qty: {o.quantity}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">${parseFloat(o.totalAmount).toFixed(2)}</div>
                      <div className="text-xs text-slate-500 mt-1">${parseFloat(o.unitPrice).toFixed(2)} each</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(o.status)}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                          onClick={() => onEdit(o)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" 
                          onClick={() => onDelete(o._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/10">
          <span className="text-sm text-slate-400">Page {page} of {total}</span>
          <div className="flex gap-1">
            <button 
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              onClick={() => setPage(p => p - 1)} disabled={page === 1}
            >
              Prev
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              onClick={() => setPage(p => p + 1)} disabled={page === total}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;

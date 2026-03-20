import React, { useState } from 'react';
import { getOrderValue } from '../../utils/widgetUtils';

const applyFilters = (orders, filters) => {
  if (!filters?.length) return orders;
  return orders.filter((order) =>
    filters.every(({ field, operator, value }) => {
      if (!value?.trim()) return true;
      const cell = String(getOrderValue(order, field) || '').toLowerCase();
      const v = value.toLowerCase();
      switch (operator) {
        case 'equals': return cell === v;
        case 'contains': return cell.includes(v);
        case 'starts with': return cell.startsWith(v);
        case 'greater than': return parseFloat(cell) > parseFloat(v);
        case 'less than': return parseFloat(cell) < parseFloat(v);
        default: return true;
      }
    })
  );
};

const sortOrders = (orders, sortBy, sortOrder) => {
  return [...orders].sort((a, b) => {
    let av = getOrderValue(a, sortBy) || a.createdAt || '';
    let bv = getOrderValue(b, sortBy) || b.createdAt || '';
    if (sortBy === 'Order Date') { av = new Date(a.createdAt); bv = new Date(b.createdAt); }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortOrder === 'Descending' ? -cmp : cmp;
  });
};

const TableWidget = ({ widget, orders }) => {
  const [page, setPage] = useState(1);
  const { title, config = {} } = widget;
  const {
    columns = ['Customer Name', 'Product', 'Total Amount', 'Status'],
    sortBy = 'Order Date',
    sortOrder = 'Ascending',
    pageSize = 10,
    filters = [],
    fontSize = 14,
    headerBgColor = '#54bd95',
  } = config;

  const colSpan = Math.min(widget.width || 4, 12);

  const processed = sortOrders(applyFilters(orders, filters), sortBy, sortOrder);
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const paged = processed.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="widget-card" style={{ gridColumn: `span ${colSpan}` }}>
      <div className="widget-header">
        <span className="widget-title">📋 {title}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{processed.length} rows</span>
      </div>
      <div className="widget-body" style={{ padding: '8px 12px 12px', overflowX: 'auto' }}>
        {paged.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px' }}>
            <span className="icon" style={{ fontSize: 28 }}>📭</span>
            <p>No data matches</p>
          </div>
        ) : (
          <>
            <table style={{ fontSize: `${fontSize}px`, width: '100%' }}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} style={{ background: `${headerBgColor}22`, color: headerBgColor, fontSize: `${fontSize - 1}px` }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((order, i) => (
                  <tr key={order._id || i}>
                    {columns.map((col) => (
                      <td key={col} style={{ fontSize: `${fontSize}px` }}>
                        {col === 'Status' ? (
                          <span className={`badge ${
                            order.status === 'Pending' ? 'badge-pending' :
                            order.status === 'In Progress' ? 'badge-progress' : 'badge-completed'
                          }`}>{order.status}</span>
                        ) : getOrderValue(order, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: 8, fontSize: 12 }}>
                <span>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, processed.length)} of {processed.length}</span>
                <div className="pagination-controls">
                  <button className="page-btn" style={{ width: 26, height: 26 }} onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} style={{ width: 26, height: 26, fontSize: 11 }} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" style={{ width: 26, height: 26 }} onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableWidget;

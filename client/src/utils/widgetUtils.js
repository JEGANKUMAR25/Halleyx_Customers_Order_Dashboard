// Shared constants used across all widget forms and renderers
export const METRIC_FIELDS = [
  'Customer ID', 'Customer Name', 'Email ID', 'Address', 'Order Date',
  'Product', 'Created By', 'Status', 'Total Amount', 'Unit Price', 'Quantity',
];

export const NUMERIC_FIELDS = ['Total Amount', 'Unit Price', 'Quantity'];

export const AGGREGATIONS = ['Sum', 'Average', 'Count'];

export const DATA_FORMATS = ['Number', 'Currency'];

export const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart', icon: '📊' },
  { id: 'line', label: 'Line Chart', icon: '📈' },
  { id: 'area', label: 'Area Chart', icon: '🗺️' },
  { id: 'scatter', label: 'Scatter Plot', icon: '🔵' },
];

export const AXIS_FIELDS = [
  'Product', 'Quantity', 'Unit Price', 'Total Amount',
  'Status', 'Created By', 'Duration',
];

export const PIE_DATA_FIELDS = [
  'Product', 'Quantity', 'Unit Price', 'Total Amount', 'Status', 'Created By',
];

export const TABLE_COLUMNS = [
  'Customer ID', 'Customer Name', 'Email ID', 'Phone Number',
  'Address', 'Order ID', 'Order Date', 'Product',
  'Quantity', 'Unit Price', 'Total Amount', 'Status', 'Created By',
];

export const WIDGET_TYPES = [
  { id: 'kpi', label: 'KPI', icon: '🎯', desc: 'Single metric card' },
  { id: 'bar', label: 'Bar Chart', icon: '📊', desc: 'Group comparisons' },
  { id: 'line', label: 'Line Chart', icon: '📈', desc: 'Trend over time' },
  { id: 'area', label: 'Area Chart', icon: '🗺️', desc: 'Cumulative view' },
  { id: 'scatter', label: 'Scatter Plot', icon: '🔵', desc: 'Correlations' },
  { id: 'pie', label: 'Pie Chart', icon: '🥧', desc: 'Composition' },
  { id: 'table', label: 'Table', icon: '📋', desc: 'Tabular data' },
];

// Maps order document fields to displayable column data
export const getOrderValue = (order, column) => {
  switch (column) {
    case 'Customer ID': return order._id?.slice(-6).toUpperCase() || '-';
    case 'Customer Name': return `${order.firstName} ${order.lastName}`;
    case 'Email ID': return order.email;
    case 'Phone Number': return order.phone;
    case 'Address': return `${order.street}, ${order.city}, ${order.state} ${order.postalCode}`;
    case 'Order ID': return order._id?.slice(-8).toUpperCase() || '-';
    case 'Order Date': return order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-';
    case 'Product': return order.product;
    case 'Quantity': return order.quantity;
    case 'Unit Price': return `$${parseFloat(order.unitPrice || 0).toFixed(2)}`;
    case 'Total Amount': return `$${parseFloat(order.totalAmount || 0).toFixed(2)}`;
    case 'Status': return order.status;
    case 'Created By': return order.createdBy;
    default: return '-';
  }
};

// Compute KPI value from orders
export const computeKPI = (orders, metric, aggregation, format, precision) => {
  if (!orders.length) return format === 'Currency' ? '$0' : '0';

  let values = orders.map((o) => {
    switch (metric) {
      case 'Total Amount': return parseFloat(o.totalAmount) || 0;
      case 'Unit Price': return parseFloat(o.unitPrice) || 0;
      case 'Quantity': return parseFloat(o.quantity) || 0;
      default: return null;
    }
  }).filter((v) => v !== null);

  let result;
  if (aggregation === 'Count' || !NUMERIC_FIELDS.includes(metric)) {
    result = orders.length;
  } else if (aggregation === 'Sum') {
    result = values.reduce((a, b) => a + b, 0);
  } else if (aggregation === 'Average') {
    result = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  } else {
    result = values.length;
  }

  const prec = parseInt(precision) || 0;
  const formatted = parseFloat(result).toFixed(prec);
  return format === 'Currency' ? `$${Number(formatted).toLocaleString('en-US', { minimumFractionDigits: prec })}` : Number(formatted).toLocaleString('en-US', { minimumFractionDigits: prec });
};

// Build chart data from orders for a given x/y axis
export const buildChartData = (orders, xAxis, yAxis) => {
  const grouped = {};
  orders.forEach((o) => {
    const xVal = getOrderRawValue(o, xAxis);
    const yVal = getOrderRawValue(o, yAxis);
    if (!grouped[xVal]) grouped[xVal] = { x: xVal, y: 0, count: 0 };
    grouped[xVal].y += parseFloat(yVal) || 0;
    grouped[xVal].count += 1;
  });
  return Object.values(grouped).map((d) => ({ name: d.x, value: parseFloat(d.y.toFixed(2)) }));
};

const getOrderRawValue = (order, field) => {
  switch (field) {
    case 'Product': return order.product;
    case 'Quantity': return order.quantity;
    case 'Unit Price': return order.unitPrice;
    case 'Total Amount': return order.totalAmount;
    case 'Status': return order.status;
    case 'Created By': return order.createdBy;
    default: return field;
  }
};

// Build pie data
export const buildPieData = (orders, field) => {
  const grouped = {};
  orders.forEach((o) => {
    const val = getOrderRawValue(o, field) || 'Unknown';
    if (!grouped[val]) grouped[val] = 0;
    grouped[val] += 1;
  });
  const COLORS = ['#54bd95', '#60a5fa', '#f59e0b', '#ef4444', '#a78bfa', '#fb923c', '#34d399'];
  return Object.entries(grouped).map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length],
  }));
};

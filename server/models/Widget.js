const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['kpi', 'bar', 'line', 'area', 'scatter', 'pie', 'table'],
    },
    title: { type: String, default: 'Untitled' },
    description: { type: String, default: '' },
    width: { type: Number, default: 2, min: 1 },
    height: { type: Number, default: 2, min: 1 },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    config: {
      // KPI
      metric: { type: String },
      aggregation: { type: String, enum: ['Sum', 'Average', 'Count', null] },
      dataFormat: { type: String, enum: ['Number', 'Currency'], default: 'Number' },
      decimalPrecision: { type: Number, default: 0, min: 0 },

      // Chart (Bar, Line, Area, Scatter)
      xAxis: { type: String },
      yAxis: { type: String },
      chartColor: { type: String, default: '#54bd95' },
      showDataLabels: { type: Boolean, default: false },

      // Pie Chart
      pieDataField: { type: String },
      showLegend: { type: Boolean, default: true },

      // Table
      columns: [{ type: String }],
      sortBy: { type: String, default: 'Order Date' },
      sortOrder: { type: String, enum: ['Ascending', 'Descending'], default: 'Ascending' },
      pageSize: { type: Number, enum: [5, 10, 15], default: 10 },
      filters: [
        {
          field: { type: String },
          operator: { type: String },
          value: { type: String },
        },
      ],
      fontSize: { type: Number, default: 14, min: 12, max: 18 },
      headerBgColor: { type: String, default: '#54bd95' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Widget', widgetSchema);

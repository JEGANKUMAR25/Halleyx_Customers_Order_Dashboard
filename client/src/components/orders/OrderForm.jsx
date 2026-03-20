import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const CREATED_BY = [
  'Mr. Michael Harris',
  'Mr. Ryan Cooper',
  'Ms. Olivia Carter',
  'Mr. Lucas Martin',
];

const initial = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', postalCode: '', country: 'United States',
  product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: '', totalAmount: '',
  status: 'Pending', createdBy: 'Mr. Michael Harris',
};

const Field = ({ label, name, type = 'text', form, set, errors, ...extra }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-300 ml-1">{label} <span className="text-red-400">*</span></label>
    <input
      type={type}
      className={`glass-input ${errors[name] ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
      value={form[name] ?? ''}
      onChange={(e) => set(name, e.target.value)}
      {...extra}
    />
    {errors[name] && <span className="text-xs text-red-400 ml-1">{errors[name]}</span>}
  </div>
);

const Select = ({ label, name, options, form, set, errors }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-300 ml-1">{label} <span className="text-red-400">*</span></label>
    <select 
      className={`glass-input appearance-none ${errors[name] ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
      value={form[name]} 
      onChange={(e) => set(name, e.target.value)}
    >
      {options.map((o) => <option key={o} value={o} className="bg-slate-800">{o}</option>)}
    </select>
    {errors[name] && <span className="text-xs text-red-400 ml-1">{errors[name]}</span>}
  </div>
);

const OrderForm = ({ onSubmit, onCancel, editData }) => {
  const [form, setForm] = useState(editData ? { ...editData } : { ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const qty = parseFloat(form.quantity) || 0;
    const price = parseFloat(form.unitPrice) || 0;
    setForm((prev) => ({ ...prev, totalAmount: (qty * price).toFixed(2) }));
  }, [form.quantity, form.unitPrice]);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    const required = [
      'firstName', 'lastName', 'email', 'phone',
      'street', 'city', 'state', 'postalCode', 'country',
      'product', 'unitPrice', 'status', 'createdBy',
    ];
    required.forEach((f) => { if (!form[f]?.toString().trim()) e[f] = 'Required'; });
    if (parseFloat(form.quantity) < 1) e.quantity = 'Must be ≥ 1';
    if (form.unitPrice && parseFloat(form.unitPrice) < 0) e.unitPrice = 'Cannot be negative';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 p-1">
      
      {/* Customer Info Section */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-3">👤 Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="First Name" name="firstName" form={form} set={set} errors={errors} />
          <Field label="Last Name" name="lastName" form={form} set={set} errors={errors} />
          <Field label="Email Address" name="email" type="email" form={form} set={set} errors={errors} />
          <Field label="Phone Number" name="phone" type="tel" form={form} set={set} errors={errors} />
          <Field label="Street Address" name="street" form={form} set={set} errors={errors} />
          <Field label="City" name="city" form={form} set={set} errors={errors} />
          <Field label="State / Province" name="state" form={form} set={set} errors={errors} />
          <Field label="Postal Code" name="postalCode" form={form} set={set} errors={errors} />
          <Select label="Country" name="country" options={COUNTRIES} form={form} set={set} errors={errors} />
        </div>
      </div>

      {/* Order Info Section */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-3">📦 Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select label="Product" name="product" options={PRODUCTS} form={form} set={set} errors={errors} />
          <Field label="Quantity" name="quantity" type="number" min="1" form={form} set={set} errors={errors} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Unit Price ($) <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="number" step="0.01" min="0" placeholder="0.00"
                className={`glass-input pl-8 ${errors.unitPrice ? 'border-red-500/50' : ''}`}
                value={form.unitPrice} onChange={(e) => set('unitPrice', e.target.value)}
              />
            </div>
            {errors.unitPrice && <span className="text-xs text-red-400 ml-1">{errors.unitPrice}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Total Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input type="text" readOnly value={form.totalAmount} className="glass-input pl-8 bg-white/5 border-transparent text-slate-300 font-bold" />
            </div>
          </div>

          <Select label="Status" name="status" options={STATUSES} form={form} set={set} errors={errors} />
          <Select label="Created By" name="createdBy" options={CREATED_BY} form={form} set={set} errors={errors} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button type="button" className="glass-button-secondary border-none" onClick={onCancel} disabled={submitting}>
          <X size={18} /> Cancel
        </button>
        <button type="submit" className="glass-button-primary disabled:opacity-50" disabled={submitting}>
          {submitting ? '⏳ Processing...' : editData ? <><Save size={18}/> Update Order</> : <><Save size={18}/> Save New Order</>}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;

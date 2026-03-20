const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Customer Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: {
      type: String,
      required: true,
      enum: ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'],
    },

    // Order Info
    product: {
      type: String,
      required: true,
      enum: [
        'Fiber Internet 300 Mbps',
        '5G Unlimited Mobile Plan',
        'Fiber Internet 1 Gbps',
        'Business Internet 500 Mbps',
        'VoIP Corporate Package',
      ],
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    createdBy: {
      type: String,
      required: true,
      enum: [
        'Mr. Michael Harris',
        'Mr. Ryan Cooper',
        'Ms. Olivia Carter',
        'Mr. Lucas Martin',
      ],
    },
  },
  { timestamps: true }
);

// Virtual for customer full name
orderSchema.virtual('customerName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);

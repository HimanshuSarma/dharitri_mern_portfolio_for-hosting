const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orders: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer'
        },
        orderID: { type: String, required: true },
        entity: { type: String, required: true },
        amount: { type: Number, required: false },
        amount_paid: { type: Number, required: false },
        currency: { type: String, required: true },
        receipt: { type: String, required: true },
        status: { type: String, required: true },
        attempts: { type: Number, required: false },
        created_at: { type: Number, required: false }
    }]
})


exports.OrderSchema = mongoose.model('Orders', OrderSchema);
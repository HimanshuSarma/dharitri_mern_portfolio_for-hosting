const mongoose = require('mongoose');

const CustomerShippingAddress = mongoose.Schema({
    state: { type: String, required: true },
    district: { type: String, required: true },
    post_office: { type: String, required: true },
    town_city: { type: String, required: true },
    street: { type: String, required: true },
    house_number: { type: Number, required: true },
    pincode: { type: Number, required: true }
})

const CustomerSchema = mongoose.Schema({
    name: { type: String },
    password: { type: String },
    phone_number: { type: Number },
    state: { type: String },
    district: { type: String },
    town_city: { type: String },
    business_add: { type: String },
    post_office: { type: String },
    pincode: { type: Number },
    time_of_business: { type: Date },
    price: { type: Number },
    pan_number: { type: String },
    aadhar_number: { type: String },
    bank_upi: { type: String },
    photo: { type: String },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },

        qty: { type: Number, required: true }
    }],
    shippingAddresses: [{
        state: { type: String, required: true },
        district: { type: String, required: true },
        post_office: { type: String, required: true },
        town_city: { type: String, required: true },
        street: { type: String, required: true },
        house_number: { type: Number, required: true },
        pincode: { type: Number, required: true }
    }],
    mostRecentUsedShippingAddress: { type: CustomerShippingAddress, required: false },
    selectedShippingAddress: { type: CustomerShippingAddress, required: false }
})

exports.CustomerSchema = mongoose.model('Customer', CustomerSchema)
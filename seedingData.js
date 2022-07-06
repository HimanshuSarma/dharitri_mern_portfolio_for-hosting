require('dotenv').config()
const mongoose = require('mongoose');
const products = require('./data/products');
const ProductSchema = require('./models/Product-models');


const dropAllCollections = async() => {
    await ProductSchema.ProductSchema.deleteMany();
}

const uploadData = async() => {
    dropAllCollections().then(() => {
        try {
            const upload = async() => {
                const response = await ProductSchema.ProductSchema.insertMany(products.products);
                console.log('Data uploaded');
                process.exit();
            }

            upload();
        } catch (error) {
            console.log(error);
        }
    })
}

try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, () => {
        console.log('Connected to database');
        uploadData();
    })
} catch (error) {
    console.log(error);
}
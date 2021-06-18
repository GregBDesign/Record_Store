const mongoose = require('mongoose');
const RecordStore = require('../models/recordstore');

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/record-store', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
   
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await RecordStore.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const newStore = new RecordStore({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city} ${cities[random1000].state}`
        })
        await newStore.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
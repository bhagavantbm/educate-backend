const mongoose = require('mongoose');
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('DB Error:', err));
};
module.exports = connectDB;

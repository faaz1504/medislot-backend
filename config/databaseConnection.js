const mongoose = require("mongoose");

const databaseConnection = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then((data) => console.log(`database is connected with ${data.connection.host}`))
    .catch((err) => console.log(err))
    
    
};

module.exports = databaseConnection;    
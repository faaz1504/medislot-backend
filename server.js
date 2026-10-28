const dotenv = require("dotenv");
dotenv.config();
const databaseConnection = require('./config/databaseConnection')
databaseConnection();

const app = require('./app');

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    
});
const mongoose= require('mongoose');

require("dotenv").config();

const dbConnect = () => {
    try{
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {console.log("DB connected successfully")})
    }
    catch(err)
    {
        console.log(err);
        console.log("DB connection failed");
    }
}

module.exports = dbConnect;
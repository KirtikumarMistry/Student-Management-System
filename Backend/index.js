const express = require('express');
const cors=require('cors');
const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const dbConnect=require('./Configs/database');
dbConnect();

const router=require('./Routes/router');
app.use('/api', router);

const port= process.env.PORT || 4000;

//start the server
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

//L24J4Wqlo3cGM7y5

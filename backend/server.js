const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/Bookingroute');
const { createPermanentAdmin } = require('./models/usertable');
const userRoutes = require('./routes/userRoutes');
require("dotenv").config();
const itemsRoutes = require("./routes/itemRoute"); 
const itemCartRoute = require("./routes/itemCartRoute"); 
const path = require("path");
const orderRouter = require('./routes/orderRoutes');


mongoose.connect(
    'mongodb+srv://Thananchayan:Thanu2002@cluster0.oxle4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
    console.log('Mongodb Connected.');
    createPermanentAdmin();
}).catch((e) => {
    console.log(e);
})



const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["http://localhost:5173" , "https://res.cloudinary.com"],
        methods : ['POST', 'GET', 'PUT', 'DELETE'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials : true
    }
));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/cart", itemCartRoute);
app.use("/items", itemsRoutes); 
app.use('/api', router);
app.use(userRoutes);
app.use("/", orderRouter);


app.get("/", (req, res) => res.send("API Running 🚀"));

app.listen(PORT, () => {
    console.log('Server is running on PORT '+PORT);
    
})
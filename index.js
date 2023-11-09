
const express = require('express');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

require("./config/database").connect();

// import route and mount
const user = require("./routes/user");
app.use("/api/v1", user);
 
app.listen( PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
});

app.get("/", (req, res) => {

    res.send(`<h1>Home Page</h1>`);

});
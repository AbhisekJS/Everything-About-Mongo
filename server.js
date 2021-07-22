// grab the packages
const express = require('express');
//configure your app
const app = express();

const port =  process.env.PORT || 3000;

//connect to our mongodb database


// create our reoutes
app.get('/', (req,res)=>{
    res.send('Hello World')
})

//create the server

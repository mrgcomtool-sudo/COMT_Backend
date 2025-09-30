const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectionDB');
require('dotenv').config();

connectDB();

const app = express();

app.use(cors(
    {
        origin: process.env.CLIENT_URL2,
        credentials: true,
    }
));

app.use(cookieParser());
app.use(express.json());


const PORT = process.env.PORT || 5000;

   app.use("/member",require("./routes/member"));      
   app.use("/client",require("./routes/client"));
   app.use("/project",require("./routes/project"));
   app.use("/phase",require("./routes/phase"));
   app.use("/task",require("./routes/task"));
   app.use("/activityList",require("./routes/activity"))
   app.use("/auth", require("./routes/user"));
   app.use("/expense",require("./routes/expense"));
   app.use("/income",require("./routes/income"));
   app.use("/profile",require("./routes/profile"));
   

   // Its dummy API call for awake server 
   app.get('/health',(req,res)=>{
      res.status(200).json({status:'ok',timestamp:Date.now()});
   })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

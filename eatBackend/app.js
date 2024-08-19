const express= require("express");
const mongoose=require("mongoose");
const app=express();
const cors = require("cors");


// cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
// Middleware to parse JSON
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const uri="mongodb+srv://nischalsathyanand:nischal123@cluster0.06igqyd.mongodb.net/EatApp?retryWrites=true&w=majority&appName=Cluster0"
// Remember to secure this information
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.get("/",(req,res)=>
{
    res.send("Welcome to backend server");
})
const PORT= process.env.PORT || 8000;
app.listen(PORT,()=>
console.log(`server runing at ${PORT}`));

//router
let api = require("./router/product");
app.use("/api", api);
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./database/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials",true);
    next();
})

app.use(cookieParser());

app.use(cors({
    // origin:process.env.CLIENT_URL,
    credentials:true,      
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//routes
app.use('/api/auth/',authRoute);


app.listen(PORT, ()=>{
    connect();
    console.log("server running at port : ", PORT);
})
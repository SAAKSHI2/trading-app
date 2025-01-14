import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./database/connect.js";
import kiteApisRoute from "./routes/kiteAPIs.js";
import tradeStockApisRoute from "./routes/tradeStocks.js";
import userInfoApisRoute from "./routes/userInfo.js";
import basketApisRoute from "./routes/basketAPIs.js";
import optionStocksAPIsRoute from "./routes/optionStocksAPIs.js";
import stopLossAPIsRoute from "./routes/stopLossAPIs.js";

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
app.use('/api/kite/', kiteApisRoute);
app.use('/api/stocks/', tradeStockApisRoute)
app.use('/api/optionStocks/', optionStocksAPIsRoute)
app.use('/api/user',userInfoApisRoute)
app.use('/api/baskets',basketApisRoute)
app.use('/api/stopLoss',stopLossAPIsRoute)



app.listen(PORT, ()=>{
    connect();
    console.log("server running at port : ", PORT);
})
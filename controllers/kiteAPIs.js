import dotenv from "dotenv";
import { checkAndSetAccessToken, generateKiteSession, kc } from "../kiteConnect/kiteConnection.js";
import { indicesData } from "../constants/constants.js";
dotenv.config();

export const login = (req,res) => {
    const redirectUri = process.env.LOCALHOST_BACKEND_URL + "/api/kite/login/callback" ;
    const loginUrl = kc.getLoginURL(redirectUri);
    res.redirect(loginUrl);
}


export const callback = async(req,res) => {
    const requestToken = req.query.request_token;
    console.log("request token generated : " + requestToken )
    await generateKiteSession(requestToken);
    //    const accessToken = "aizrZdq8qpUdJg5VEunB3EzYmLgBs9EF";
    // kc.setAccessToken(accessToken)
}


export const marketData = async(req,res) => {
    const symbols = indicesData;
    const data = [];
    try {
        for (const index in symbols) {
            const company = symbols[index];
            const symbol = company.exchange+ ":" + company.symbol;
            console.log(symbol)
            await kc.getQuote(symbol)
                .then(response => {
                    console.log('Real-time data for', symbol, ':', response);
                    data.push(response)
                })
                .catch(error => {
                    console.error('Error fetching real-time data for', symbol, ':', error);
                });
        }
       
        console.log(data);
        res.json({"Market_Data" : data})

    }catch(error) {
        console.log("error", error.message);
        res.json({"Error" : error.message})
    }
}


export const checkAccessToken = async(req,res) => {
    try{
        await checkAndSetAccessToken();
        res.status(200).json("set the token successfully");
    }catch(error){
        res.status(404).json(error.message)
    }
}
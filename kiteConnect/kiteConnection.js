 import { KiteConnect } from 'kiteconnect';
 import dotenv from "dotenv";
 import KiteTokens from "../models/KiteTokens.js";

 dotenv.config();
 
export const kc = new KiteConnect({ api_key: process.env.API_KEY });
// console.log(kc);

export const checkAndSetAccessToken = async() => {
    await KiteTokens.findOne({})
        .then((doc) => {
            if (doc && doc.accessToken !== undefined) {
              kc.setAccessToken(doc.accessToken);
            } else {
                throw new Error('Access token not found');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            throw new Error(error);
        });   
}

export async function generateKiteSession() {
    try {
        const response = await kc.generateSession(kc.access_token, process.env.API_SECRET);
        console.log("session generated successfully : ", response);
        KiteTokens.findOne({})
        .then((doc) => {
            if (doc && doc.accessToken !== undefined) {
            // If the accessToken field exists, update it
            return KiteTokens.updateOne({}, { accessToken: response.access_token });
            } else {
            // If the accessToken field doesn't exist, create it
            return KiteTokens.updateOne({}, { $set: { accessToken: response.access_token } }, { upsert: true });
            }
        })
        .then((result) => {
            console.log('Update result:', result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        kc.setAccessToken(accessToken);

    } catch (err) {
        console.error(err);
        throw err;
    }
}


 

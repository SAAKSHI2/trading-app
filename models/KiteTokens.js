import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  accessToken: { type: String},
});

const Tokens = mongoose.model('KiteTokens', tokenSchema);

export default Tokens;
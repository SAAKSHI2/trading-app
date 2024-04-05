import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  currency: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String},
  phoneNumber: {type: Number, required: true},
  password: {type: String}
});

const Users = mongoose.model('Users', userSchema);

export default Users;
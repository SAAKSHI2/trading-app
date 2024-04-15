import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  currency: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String},
  phoneNumber: {type: Number, required: true},
  password: {type: String},
  current_stocks: [
    {
      symbol: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 0,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      //price = (oldPrice*quantity)+(newPrice*quantity)/(newQ+oldQ)
    //   date: {
    //     type: Date,
    //     default: Date.now,
    //     required: true
    //   }
    }
  ],
  transactions: [
    {
      type: {
        type: String,
        enum: ['BUY_STOCK', 'SELL_STOCK'],
        required: true
      },
      stockInfo: {
          symbol: {
            type: String,
            required: true
          },
          quantity: {
            type: Number,
            default: 0,
            required: true
          },
          price: {
            type: Number,
            required: true
          }
        },
      date: {
        type: Date,
        default: Date.now,
        required: true
      }
    }
  ]
 
});

const Users = mongoose.model('Users', userSchema);

export default Users;
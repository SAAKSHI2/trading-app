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
  profile_pic: {type:String},
  accessToken: {type:String},
  expiryDate: {type:Date},
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
  ],
  settings: {
    theme:{
        type:String,
        enum: ['Dark', 'Default','Light'],
        default:'Default'
    },
    order_notification:{type:Boolean, default: false},
    sticky_order_window: {type: Boolean, default: false},
    accessibility_mode: {type:Boolean, default: false},
    fullScreen: {type:Boolean, default: false},
    sticky_pins: {type:Boolean, default: false},

  }
 
});

const Users = mongoose.model('Users', userSchema);

export default Users;
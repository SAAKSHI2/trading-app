import Users from "../models/Users.js";
import axios from "axios";

export const addStopLoss = async(req, res) => {
   const { userId } = req.params;
   const { price, symbol, action, quantity } = req.body;

  if (!price || !symbol || !action || !quantity) {
    return res.status(400).json('Price, symbol, action, and quantity are required');
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newStopLoss = { price, symbol, action, quantity };

    user.stoploss.push(newStopLoss);

    await user.save();

    res.status(200).json({ message: 'stoploss added successfully' , success: true});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error creating stop loss order');
  }

}


export const getAllStopLoss = async(req,res) => {
    const { userId } = req.params;

    try {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ stoploss : user.stoploss , success: true});

    } catch (err) {
      console.error(err.message);
      res.status(500).json('Error retrieving stop loss orders');
    }
}


export const deleteStopLoss = async(req,res) => {
   const { userId, orderId } = req.params;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     const orderIndex = user.stoploss.findIndex(stoploss => stoploss._id.toString() === orderId);

     if (orderIndex === -1) {
        return res.status(404).json({message : 'Stop loss order not found'});
     }

     user.stoploss.splice(orderIndex, 1);

    await user.save();

    res.status(200).json({message : "order deleted successgully" , success:true});
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Error deleting stop loss order', success: false});
  }
}


export const updateStopLoss = async(req,res) => {
  const { userId, orderId } = req.params;
  const { price, symbol, action, quantity } = req.body;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const order = user.stoploss.id(orderId);
    if (!order) {
        return res.status(404).json({message : 'Stop loss order not found'});
    }

    if (price !== undefined) order.price = price;
    if (symbol !== undefined) order.symbol = symbol;
    if (action !== undefined) order.action = action;
    if (quantity !== undefined) order.quantity = quantity;

    await user.save();
    res.status(200).json({message : "order updated successgully" , success:true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', success: false});
}

}

export const executeStopLoss = async(req,res) => {
    const {userId} = req.params;
    const {marketData, bearerToken} = req.body;
    try{
       const user = await Users.findById(userId);
       if (!user) {
        return res.status(404).json({ message: 'User not found' });     
       }

       const ids = []

       for (const marketEntry of marketData) {
        const symbol = Object.keys(marketEntry)[0];
        const lastPrice = marketEntry[symbol].last_price;
  
        for (let stopLossOrder of user.stoploss) {
          if (stopLossOrder.symbol === symbol && stopLossOrder.isActive) {
            if ((stopLossOrder.action === 'SELL' && lastPrice <= stopLossOrder.price) ||
                (stopLossOrder.action === 'BUY' && lastPrice >= stopLossOrder.price)) {
            
                    const stockAPI = stopLossOrder.action === 'BUY' ? process.env.LOCALHOST_BACKEND_URL + "api/stocks/buy" : process.env.LOCALHOST_BACKEND_URL + "api/stocks/sell";
                    try {
                        await axios.post(stockAPI, { user_id : userId, symbol: stopLossOrder.symbol, quantity: stopLossOrder.quantity, price: stopLossOrder.price }, {
                            headers: {
                                'Authorization': `Bearer ${bearerToken}`
                            }
                        });
                        ids.push(stopLossOrder._id.toString())
                     
                    } catch (error) {
                        return res.status(500).json({ message: "Error executing stockLoss", success: false, error: error.message });
                    }
            }
          }
        } 
      }

      res.status(200).json({success: true, message: "stockLoss executed successfully", stopLessIdsExecuted: ids});

    } catch(error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal server error', success: false});
    }

}


export const isActiveMark = async(req,res) => {
    try {
        // Retrieve the user ID from the request body
        const { userId } = req.params;
        const {ids} = req.body;

        // Find the user by ID
        const user = await Users.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


         // Update the completed field to true for all stocks in the basket
         user.stoploss.forEach(stock => {
            if(ids.includes(stock._id.toString())){
                console.log(stock)
             stock.isActive = false;
            }
         });
 
        // Save the updated user document
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'isActive field updated successfully', success: true });
    } catch (error) {
        // Handle errors
        console.error('Error updating completed field:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}
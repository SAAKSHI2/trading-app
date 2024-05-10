import Users from "../models/Users.js";
import axios from 'axios';
import dotenv from "dotenv";
import e from "express";
dotenv.config();


export const getAllBaskets = async(req,res) => {
    const {user_id} = req.params;
    try {
        // Find the user by phone number
        const user = await Users.findOne({ _id: user_id });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" , success: false});
        }
    
        // Extract users basket
        const baskets = user.baskets;
        res.status(200).json({ baskets: baskets, success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
      }
}

export const getBaksetInfo = async(req,res) => {
    try {
        const {user_id, basket_id} = req.params;
        const user = await Users.findOne({ _id: user_id, 'baskets._id': basketId });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
          }
        const baskets = user.baskets.find(basket => basket._id.toString() === basket_id);

        if (!baskets) {
          return res.status(404).json({ error: 'Basket not found' });
        }
        res.status(200).json({ baskets: baskets, success: true });
      } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }
}


export const createBasket = async(req,res) =>{
    try {
        const {user_id} = req.params;
        const {basketName} = req.body;
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
          }

          // Create a new basket object
         const newBasket = {
          name: basketName,
          stocks: [] // Initialize stocks as an empty array for the new basket
        };
  
      // Push the new basket into the user's baskets array
      user.baskets.push(newBasket);
  
      // Save the updated user document
       await user.save();
    
        res.status(200).json({ baskets: user.baskets, success: true });
      } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }
}

export const addStockToBasket = async(req,res) => {
    try {
        const { symbol, quantity, price, transactionType } = req.body;
        const {user_id, basket_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        const basket = user.baskets.find(b => b._id.toString() === basket_id);

        if (!basket) {
          return res.status(404).json({ error: 'Basket not found', success: false });
        }

        // Add the new stock to the basket
        basket.stocks.push({ symbol, quantity, price, transactionType });


        // Save the updated user document
       await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: basket, success: true });
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


export const addStock = async(req,res) => {
    try {
        const { stocks } = req.body;
        const {user_id, basket_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        const basket = user.baskets.find(b => b._id.toString() === basket_id);
        if (!basket) {
          return res.status(404).json({ error: 'Basket not found', success: false });
        }

        basket.stocks = stocks;

        // Save the updated user document
       await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: basket, success: true });
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


export const editStockInBasket = async(req,res) => {
    try {
        const { quantity, price } = req.body;
        const {user_id, basket_id, stock_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        const basket = user.baskets.find(b => b._id.toString() === basket_id);
        if (!basket) {
          return res.status(404).json({ error: 'Basket not found', success: false });
        }
        // Find the stock within the basket by stockId
        const stock = basket.stocks.id(stock_id);

        if (!stock) {
        return res.status(404).json({ error: 'Stock not found in basket', success: false });
        }

        // Update the stock with the new quantity and price
        if (quantity) {
            stock.quantity = quantity;
        }
        if (price) {
            stock.price = price;
        }

        // Save the updated user document
       await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: basket, success: true });
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }
}

export const editBasketName = async(req,res) => {
    try {
        const { name } = req.body;
        const {user_id, basket_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        const basket = user.baskets.find(b => b._id.toString() === basket_id);
        if (!basket) {
          return res.status(404).json({ error: 'Basket not found', success: false });
        }

        basket.name = name;

        // Save the updated user document
       await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: basket, success: true });
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }

}

export const deleteBasket = async(req,res) => {
    try {
        const {user_id, basket_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        // Find the basket by basketId
        const basketIndex = user.baskets.findIndex(basket => basket._id.toString() === basket_id);

        if (basketIndex === -1) {
         return res.status(404).json({ message: 'Basket not found' ,success: false });
        }

        // Remove the basket from the user's baskets array
        user.baskets.splice(basketIndex, 1);

        // Save the updated user object
        await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: user.baskets, success: true, message: "basket deleted successfully"});
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


export const deleteBasketStock = async(req,res) => {
    try {
        const {user_id, basket_id ,stock_id} = req.params;

         const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

            // Find the basket by basketId
        const basket = user.baskets.find(basket => basket._id.toString() === basket_id);

        if (!basket) {
        return res.status(404).json({ message: 'Basket not found',success: false });
        }

        // Find the stock by stockId in the basket
        const stockIndex = basket.stocks.findIndex(stock => stock._id.toString() === stock_id);

        if (stockIndex === -1) {
        return res.status(404).json({ message: 'Stock not found in the basket', success: false});
        }

        // Remove the stock from the basket's stocks array
        basket.stocks.splice(stockIndex, 1);

        // Save the updated user object
        await user.save();

        // Return the updated user document with the updated basket
        res.status(200).json({ baskets: basket, success: true, message: "stock item deleted successfully"});
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


export const executeBasket = async(req,res) => {
    try {
        const {user_id, basket_id} = req.params;
        const {bearerToken} = req.body;

        const user = await Users.findOne({ _id: user_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
        }

        // Find the basket by basketId
        const basket = user.baskets.find(basket => basket._id.toString() === basket_id);

        if (!basket) {
        return res.status(404).json({ message: 'Basket not found',success: false });
        }

        basket.stocks.forEach(async(stock) => {
            if (!stock.completed) {
                const stockAPI = stock.transactionType === 'BUY' ? process.env.LOCALHOST_BACKEND_URL + "api/stocks/buy" : process.env.LOCALHOST_BACKEND_URL + "api/stocks/sell";
                try {
                    await axios.post(stockAPI, { user_id, symbol: stock.symbol, quantity: stock.quantity, price: stock.price }, {
                        headers: {
                            'Authorization': `Bearer ${bearerToken}`
                        }
                    });
                    console.log(`Basket ${stock.transactionType.toLowerCase()} stock executed successfully`);
                 
                } catch (error) {
                    console.error(`Error in executing basket ${stock.transactionType.toLowerCase()} stock`, error.message);
                    return res.status(500).json({ message: "Error executing basket stock", success: false });
                }
            }
        });
        
      
       // Save the updated user object
        await user.save();

        res.status(200).json({ baskets: basket, success: true, message: "Basket executed successfully"});
     } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false, error:error });
      }

}


export const setCompleted = async(req,res) => {
// Define a route to update the completed field for all stocks
    try {
        // Retrieve the user ID from the request body
        const { user_id,basket_id } = req.params;

        // Find the user by ID
        const user = await Users.findById(user_id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Find the basket by ID
         const basket = user.baskets.find(basket => basket._id.toString() === basket_id);

         // Check if the basket exists
         if (!basket) {
             return res.status(404).json({ message: 'Basket not found' });
         }
 
         // Update the completed field to true for all stocks in the basket
         basket.stocks.forEach(stock => {
             stock.completed = true;
         });
 
        // Save the updated user document
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Completed field updated successfully', success: true, baskets : basket });
    } catch (error) {
        // Handle errors
        console.error('Error updating completed field:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}
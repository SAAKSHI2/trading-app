import Users from "../models/Users.js";

export const sellStock = async(req, res) => {
    try {
        const { user_id, symbol, quantity, price } = req.body;
    
        // Find the user by email
        const user = await Users.findOne({ _id: user_id });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the user owns the specified stock and has enough quantity to sell
        const stockIndex = user.current_stocks.findIndex(stock => stock.symbol === symbol);
        if (stockIndex === -1 || user.current_stocks[stockIndex].quantity < quantity) {
          return res.status(400).json({ message: 'User does not own enough of this stock' , success: false});
        }
    
        // Calculate the total price of the sold stocks
        const totalPrice = price * quantity;
    
        // Add currency to the user's account
        user.currency += totalPrice;
    
        // Update the quantity of the sold stock in the user's current_stocks array
        user.current_stocks[stockIndex].quantity -= quantity;
        let currentStockState;

        if (user.current_stocks[stockIndex].quantity  === 0) {
            // If selling all stocks, remove the stock
            currentStockState = user.current_stocks[stockIndex];
            user.current_stocks = user.current_stocks.filter(stock => stock.symbol !== symbol);
          } else {
            // Calculate new average price
            // const newAveragePrice = ((user.current_stocks[stockIndex].price * user.current_stocks[stockIndex].quantity) - (price * quantity)) / user.current_stocks[stockIndex].quantity;
            // Update remaining stock average price
            // user.current_stocks[stockIndex].price = newAveragePrice;
            currentStockState = user.current_stocks[stockIndex];
          }
      
    
        // Add the sell transaction to the user's transactions array
        user.transactions.push({
          type: 'SELL_STOCK',
          stockInfo: { symbol, quantity, price },
        });
        console.log(user.current_stocks);

    
        // Save the updated user data
        await user.save();
    
        res.status(200).json({ message: 'Stock sold successfully' , success: true});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
      }    
}



export const buyStock = async (req, res) => {
    const { user_id, symbol, quantity, price } = req.body;
  
    try {
      // Find user by email
      const user = await Users.findOne({ _id: user_id });
  
      // Calculate total transaction amount
      const total = quantity * price;
  
      // Check if user has sufficient balance
      if (user.currency < total) {
        return res.status(400).json({ message: 'Insufficient balance', success: false });
      }
  
      // Deduct total amount from user's wallet
      user.currency -= total;
  
      // Check if user already holds stocks of the same symbol
      const existingStock = user.current_stocks.find(stock => stock.symbol === symbol);
      let currentStockState;
  
      if (existingStock) {
        // Calculate new average price
        const oldQuantity = existingStock ? existingStock.quantity : 0;
        const oldAveragePrice = existingStock ? existingStock.price : 0;
        console.log(oldQuantity + " "+ oldAveragePrice + " "+ (oldAveragePrice * oldQuantity) +  " "+ (price * quantity) + " "+ ((oldQuantity + parseInt(quantity))*1.0)) ;

        const newAveragePrice = ((oldAveragePrice * oldQuantity) + (price * quantity)) / ((oldQuantity + parseInt(quantity))*1.0);
        console.log(newAveragePrice);

        const roundOfAvgPrice = Math.round(newAveragePrice * 100) / 100;


        // Update average price and quantity for existing stock
        existingStock.quantity += parseInt(quantity);
        existingStock.price = roundOfAvgPrice;

        currentStockState = existingStock

      } else {
        // Add new stock to user's portfolio
        user.current_stocks.push({ symbol, quantity, price});
        currentStockState = user.current_stocks[user.current_stocks.length-1];
      }
  
      // Add transaction to user's history
      user.transactions.push({
        type: 'BUY_STOCK',
        stockInfo: { symbol, quantity, price },
      });
      console.log(user.current_stocks);


      // Save updated user data
      await user.save();
  
      res.status(200).json({ message: 'Stock purchased successfully' , success: true});
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false});
    }
}

export const currentStocksInfo = async(req,res) =>{
    const { user_id, type } = req.params;
    try {
        // Find the user by phone number
        const user = await Users.findOne({ _id: user_id });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" , success: false});
        }
    
        // Extract and return the current stock information for the user
        const currentStocks = user.current_stocks;
        res.status(200).json({ currentStocksInfo: {current_stocks:currentStocks, user_id: user._id, currency: user.currency}, success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


export const getTransactionLogs = async(req,res) => {
const { phoneNumber } = req.params;
  const { page = 1, limit = 5 } = req.query; // Default page number and limit

  try {
    // Find the user by phone number
    // const user = await Users.findOne({ phoneNumber });

    
    // Extract transaction logs for the user
    // const transactionLogs = user.transactions;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Paginate the transaction logs
    // const startIndex = (page - 1) * limit;
    
     // Get filter parameters from query string
     const { type, symbol, startDate, endDate } = req.query;

     // Construct filter object based on provided query parameters
    //  const filter = {};
    //  if (phoneNumber) filter.phoneNumber = phoneNumber;
    //  if (type) filter['transactions.type'] = type;
    //  if (symbol) filter['transactions.stockInfo.symbol'] = symbol;
    //  if (startDate || endDate) {
    //    filter['transactions.date'] = {};
    //    if (startDate) filter['transactions.date'].$gte = new Date(startDate);
    //    if (endDate) filter['transactions.date'].$lte = new Date(endDate);
    //  }


    // const user = await Users.findOne({'transactions.type': 'BUY_STOCK'});
     const user = await Users.findOne({phoneNumber});
     

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Sort transactions by date in descending order
    user.transactions.sort((a, b) => b.date - a.date);

    const filteredLogs = user.transactions.filter(log => {
        return (!type || log.type === type) &&
               (!startDate || log.date >= new Date(startDate)) &&
               (!endDate || log.date <= new Date(endDate)) && (!symbol || log.stockInfo.symbol === symbol);
    });

    const totalLogs = user.transactions.length;
    
    const logs = filteredLogs.slice(skip, skip + limit);

    // Return paginated transaction logs
    res.status(200).json({ totalLogs,currentPage: parseInt(page), totalPages: Math.ceil(totalLogs / limit), logs: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
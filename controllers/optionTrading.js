import Users from "../models/Users.js";

// Buy option
export const buyOption = async (req, res) => {
    // const { user_id } = req.params;
    const { symbol, type, strikePrice, quantity, premium, user_id } = req.body;
    try {
      const user = await Users.findById(user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Calculate total cost
      const totalCost = quantity * premium;
  
      // Check if user has enough currency
      if (user.currency < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }
  
      const option = { symbol, type, strikePrice, quantity, premium };
      user.options.push(option);
  
      // Add transaction
      user.transactions.push({
        type: 'BUY_OPTION',
        optionInfo: { symbol, type, strikePrice, quantity, premium },
        date: new Date()
      });

      // Deduct currency from user
      user.currency -= totalCost;
  
      await user.save();
      res.status(200).json({ message: 'Stock purchased successfully' , success: true});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false});
    }
  };
  


  // Sell option API
export const sellOption = async (req, res) => {
    // const { user_id } = req.params;
    const { symbol, type, strikePrice, quantity, premium,user_id } = req.body;
    try {
      const user = await Users.findById(user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Find the option in user's portfolio
      const optionIndex = user.options.findIndex(option =>
        option.symbol === symbol &&
        option.type === type &&
        option.strikePrice == strikePrice
      );
  
      if (optionIndex === -1) return res.status(404).json({ message: 'Option not found' });
  
      // Check if user has enough options to sell
      if (user.options[optionIndex].quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient quantity to sell' });
      }
  
      // Calculate total earnings
      const totalEarnings = quantity * premium;
  
      // Add currency to user
      user.currency += totalEarnings;
  
      // Adjust the quantity or remove the option if quantity is zero
      if (user.options[optionIndex].quantity == quantity) {
        user.options.splice(optionIndex, 1);
      } else {
        user.options[optionIndex].quantity -= quantity;
      }
  
     // Add transaction
     user.transactions.push({
      type: 'SELL_OPTION',
      optionInfo: { symbol, type, strikePrice, quantity, premium },
      date: new Date()
    });
  
      await user.save();
      res.status(200).json({ message: 'Stock sold successfully' , success: true});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false});
    }
  };
  


  export const currentOptionStocksInfo = async(req,res) =>{
    const { user_id } = req.params;
    try {
        // Find the user by phone number
        const user = await Users.findOne({ _id: user_id });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" , success: false});
        }
    
        // Extract and return the current stock information for the user
        const currentOptionStocks = user.options;
        res.status(200).json({ currentOptionStocksInfo: {currentOptionStocks:currentOptionStocks, user_id: user._id, currency: user.currency}, success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
      }

}


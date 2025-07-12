

const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema(
{
   
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique: true },

      balance: {type:Number,default:0},  
      history: [ 
        {
          transactionType:  { type: String,
            enum: ['credit', 'debit', 'Referral', 'purchase', 'Refund'],
          }, 
          amount:  {type:Number,default:0},  
          date: { type: Date, default: null} 
        }
      ]
    }
  ,{ timestamps: true });
  const WalletModel = mongoose.model('Wallet', walletSchema);

export {WalletModel};

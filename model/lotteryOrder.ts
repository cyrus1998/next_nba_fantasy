import mongoose, { Schema, Document } from 'mongoose';



export interface lotteryorder {
    order: [String]
    timestamp: Date
}


const lotteryOrderSchema: Schema = new mongoose.Schema<lotteryorder>({
    order: {
        type: [String],
        required: true,
    },
    timestamp:{
        type: Date,
        required: true,
    }
});

export default mongoose.models.LotteryOrder || mongoose.model('LotteryOrder', lotteryOrderSchema);


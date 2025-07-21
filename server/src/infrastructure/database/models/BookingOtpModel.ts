import mongoose,{Types,Schema} from 'mongoose';

const bookingOtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  bookingId:{type: Schema.Types.ObjectId,required: true},
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});


const BookingOtpModel = mongoose.model('bookingOtp', bookingOtpSchema);
export default BookingOtpModel;

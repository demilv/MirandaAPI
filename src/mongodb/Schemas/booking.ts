import { Schema, model} from 'mongoose';
import { Booking } from '../../interfaces/Booking';


const bookingSchema = new Schema<Booking>({
  fotoLink: { type: String },
  guest: {type: String},
  orderDate: {type: String},
  checkInDate: {type: String},
  checkOutDate: {type: String},
  specialRequest: {type: String},
  status: {type: String},
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true }
});

export const BookingModel = model<Booking>('Booking', bookingSchema);
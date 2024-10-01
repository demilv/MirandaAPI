import { Schema, model} from 'mongoose';
import { Review } from '../../interfaces/Review';


const reviewSchema = new Schema<Review>({
  date: { type: String },
  hora: {type: String},
  customerName: {type: String},
  email: {type: String},
  stars: {type: Number},
  review: {type: String},
  status: {type: Boolean},
  phone: {type: String},
});

export const ReviewModel = model<Review>('Review', reviewSchema);
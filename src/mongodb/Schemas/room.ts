import { Schema, model } from 'mongoose';
import { Room } from '../../interfaces/Room';


const roomSchema = new Schema<Room>({
  fotoLink: { type: [String] },
  number: {type: String},
  floor: {type: Number},
  bedType: {type: String},
  amenities: {type: [String]},
  price: {type: Number},
  status: {type: Boolean},
  offer: {type: Number},
});

export const RoomModel = model<Room>('Room', roomSchema);
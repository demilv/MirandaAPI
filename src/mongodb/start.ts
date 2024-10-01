import { connect, connection } from "mongoose";
import { RoomModel } from './Schemas/room';
import { UserModel } from "./Schemas/user";
import { BookingModel } from "./Schemas/booking";
import { ReviewModel } from "./Schemas/review";
import { generateRandomBookings } from './Seeds/booking';
import { randomRooms } from './Seeds/room';
import { randomUsers } from './Seeds/user';
import { randomReviews } from './Seeds/review';
import checkUser, { hashPassword } from './HashingChecking/HashCheck';
import dotenv from 'dotenv'

dotenv.config()

export const loginUser = {
  name: 'demilv',
  pass: 'Pass123'
};

export const exampleUser = new UserModel({
  photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  name: 'demilv',
  startDate: new Date('2024-01-15T10:00:00Z'),
  email: 'demilv@gmail.com',
  job: 'Software Engineer',
  phone: '123456789', 
  status: true,
  pass: 'Pass123'
});

export async function initializeDatabase() {
  try {
    await connect(`mongodb+srv://gonzalocano:${process.env.BASEKEY}@cluster0.tkcwqd3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

    await connection.db.dropCollection('rooms');
    await connection.db.dropCollection('bookings');
    await connection.db.dropCollection('users');
    await connection.db.dropCollection('reviews');

    exampleUser.pass = await hashPassword(exampleUser.pass);
    await exampleUser.save();

    const authenticated = await checkUser(loginUser.name, loginUser.pass);
    if (!authenticated) {
      console.log('Acceso denegado');
      return;
    }

    await UserModel.insertMany(randomUsers);
    await RoomModel.insertMany(randomRooms);
    const randomBookings = await generateRandomBookings(10);
    await BookingModel.insertMany(randomBookings);
    await ReviewModel.insertMany(randomReviews);

    console.log('Datos insertados correctamente');
  } catch (err) {
    console.error('Error:', err);
  }
}


initializeDatabase().catch(err => console.log(err));
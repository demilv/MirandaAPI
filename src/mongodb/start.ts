import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { randomRooms } from './Seeds/room';
import { generateRandomBookings } from './Seeds/booking';
import { randomUsers } from './Seeds/user';
import { randomReviews } from './Seeds/review';
import { tablas } from './tablas';
import { hashPassword } from './HashingChecking/HashCheck';

dotenv.config();

const conexionValues = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASS,
  database: process.env.MYSQLDB,
};


export async function addExampleUser(conexion: mysql.Connection) {
  const exampleUser = {
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'demilv',
    startDate: new Date('2024-01-15T10:00:00Z'),
    email: 'demilv@gmail.com',
    job: 'Software Engineer',
    phone: '123456789', 
    status: true,
    pass: 'Pass123',
  };

  try {
    const hashedPass = await hashPassword(exampleUser.pass);

    const query = `
      INSERT INTO Users (photo, name, startDate, email, job, phone, status, pass) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await conexion.execute(query, [
      exampleUser.photo,
      exampleUser.name,
      exampleUser.startDate,
      exampleUser.email,
      exampleUser.job,
      exampleUser.phone,
      exampleUser.status,
      hashedPass, 
    ]);

    console.log('demilv insertado');
  } catch (err) {
    console.error('No se puso insertar a demilv:', err);
  }
}


export async function initializeDatabase() {
  const conexion= await mysql.createConnection(conexionValues);

  try {
  
    await tablas(conexion);
    await addExampleUser(conexion)
    await randomRooms(conexion, 10);
    await randomUsers(conexion, 10);
    await randomReviews(conexion, 10); 
    await generateRandomBookings(conexion, 10);

    console.log('Datos insertados correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  } finally {
    await conexion.end();
  }
}

initializeDatabase().catch(err => console.log(err));
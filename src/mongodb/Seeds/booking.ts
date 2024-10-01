import { faker } from '@faker-js/faker';
import { Connection } from 'mysql2/promise';

export const generateRandomBookings = async (conexion: Connection, num: number) => {
  try {
    const [rows] = await conexion.query('SELECT _id FROM Rooms');

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('No hay habitaciones disponibles.');
    }
    
    const roomIds = rows.map((room: any) => room._id); 
    const bookings: any[] = [];

    for (let i = 0; i < num; i++) {
      const newBooking = [
        faker.image.url(),
        `${faker.person.firstName()} ${faker.person.lastName()}`,
        faker.date.recent().toISOString().split('T')[0],
        faker.date.soon(7).toISOString().split('T')[0],
        faker.date.soon(14).toISOString().split('T')[0],
        faker.lorem.sentence(),
        faker.helpers.arrayElement(['Check in', 'Check out', 'In progress']),
        faker.helpers.arrayElement(roomIds),
      ];

      bookings.push(newBooking);
    }

    const insertQuery = `
      INSERT INTO Bookings 
      (fotoLink, guest, orderDate, checkInDate, checkOutDate, specialRequest, status, roomId) 
      VALUES ?;
    `;
    
    await conexion.query(insertQuery, [bookings]);

    console.log(`Nuevas reservas finalizadas`);
  } catch (err) {
    console.error('Hubo un error generando reservas:', err);
  }
};

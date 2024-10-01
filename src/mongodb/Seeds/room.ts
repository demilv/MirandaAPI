import { faker } from '@faker-js/faker';
import { Connection } from 'mysql2/promise';

export const randomRooms = async (conexion: Connection, numRooms: number) => {
  try {
    const rooms = [];

    for (let i = 0; i < numRooms; i++) {
      const newRoom = [
        faker.number.int({ min: 1, max: 100 }).toString(),
        faker.number.int({ min: 1, max: 10 }),
        faker.helpers.arrayElement(["Single Bed", "Double Bed", "Double Superior", "Suite"]),
        faker.number.int({ min: 150, max: 200 }),
        faker.datatype.boolean(),
        faker.number.int({ min: 100, max: 140 })
      ];
      rooms.push(newRoom);
    }

    const insertQuery = `
      INSERT INTO Rooms (number, floor, bedType, price, status, offer) 
      VALUES ?;
    `;
    
    await conexion.query(insertQuery, [rooms]);

    console.log(`nuevas habitaciones finalizadas`);
  } catch (err) {
    console.error('Hubo un error generando habitaciones:', err);
  }
};

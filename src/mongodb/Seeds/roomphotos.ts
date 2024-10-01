import { faker } from '@faker-js/faker';
import { Connection, RowDataPacket } from 'mysql2/promise';

export const randomRoomPhotos = async (conexion: Connection) => {
  try {

    const [rooms] = await conexion.query<RowDataPacket[]>('SELECT _id FROM Rooms');
    const roomPhotos: [number, string][] = [];

    rooms.forEach((room: any) => {
      const numPhotos = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numPhotos; i++) {
        const photoLink = faker.image.url();
        roomPhotos.push([room._id, photoLink]);
      }
    });

    const insertQuery = `
      INSERT INTO RoomPhotos (_id, photoLink) 
      VALUES ?;
    `;

    await conexion.query(insertQuery, [roomPhotos]);

    console.log(`nuevas fotos de habitaciones generadas`);
  } catch (err) {
    console.error('Hubo un error generando fotos de habitaciones:', err);
  }
};
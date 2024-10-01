import { faker } from '@faker-js/faker';
import { Connection, RowDataPacket } from 'mysql2/promise';


export const randomRoomAmenities = async (conexion: Connection) => {
    try {
      const amenitiesOptions = [
        "AC", "Shower", "Double Bed", "Towel", "Bathup", "Coffee Set", "LED TV", "Wifi"
      ];
  
      const [rooms] = await conexion.query<RowDataPacket[]>('SELECT _id FROM Rooms');
      const roomAmenities: [number, string][] = [];
  
      rooms.forEach((room: any) => {
        const numAmenities = faker.number.int({ min: 1, max: 8 });
        const selectedAmenities = faker.helpers.arrayElements(amenitiesOptions, numAmenities); 
  
        selectedAmenities.forEach((amenity: string) => {
          roomAmenities.push([room._id, amenity]);
        });
      });
  
      const insertQuery = `
        INSERT INTO RoomAmenities (_id, amenity) 
        VALUES ?;
      `;
  
      await conexion.query(insertQuery, [roomAmenities]);
  
      console.log(`nuevas amenities de habitaciones generadas`);
    } catch (err) {
      console.error('Hubo un error generando amenities de habitaciones:', err);
    }
  };
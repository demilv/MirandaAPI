import { faker } from '@faker-js/faker';
import { Connection } from 'mysql2/promise';

export const randomUsers = async (conexion: Connection, numUsers: number) => {
  try {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
      const newUser = [
        faker.image.url(),
        `${faker.person.firstName()} ${faker.person.lastName()}`,
        faker.date.past().toISOString().split('T')[0],
        faker.internet.email(),
        faker.person.jobTitle(),
        faker.phone.number(),
        faker.datatype.boolean(),
        faker.internet.password()
      ];
      users.push(newUser);
    }

    const insertQuery = `
      INSERT INTO Users (photo, name, startDate, email, job, phone, status, pass) 
      VALUES ?;
    `;

    await conexion.query(insertQuery, [users]);

    console.log(`nuevos usuarios finalizados`);
  } catch (err) {
    console.error('Hubo un error generando usuarios:', err);
  }
};

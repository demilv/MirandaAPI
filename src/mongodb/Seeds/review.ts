import { faker } from '@faker-js/faker';
import { Connection } from 'mysql2/promise';

export const randomReviews = async (conexion: Connection, numReviews: number) => {

function formatTimeToMySQL(date: Date): string {
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}


  try {
    const reviews = [];

    for (let i = 0; i < numReviews; i++) {
      const newReview = [
        faker.date.past().toISOString().split('T')[0],
        formatTimeToMySQL(faker.date.recent()),
        `${faker.person.firstName()} ${faker.person.lastName()}`,
        faker.internet.email(),
        faker.number.int({ min: 1, max: 5 }),
        faker.lorem.paragraph(),
        faker.datatype.boolean(),
        faker.phone.number('###-###-####')
      ];
      reviews.push(newReview);
    }

    const insertQuery = `
      INSERT INTO Reviews (date, hora, customerName, email, stars, review, status, phone) 
      VALUES ?;
    `;

    await conexion.query(insertQuery, [reviews]);

    console.log(`nuevas reviews finalizadas`);
  } catch (err) {
    console.error('Hubo un error generando reseñas:', err);
  }
};

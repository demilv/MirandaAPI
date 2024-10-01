import { ReviewModel } from './../Schemas/review';
import { faker } from '@faker-js/faker';

const createRandomReview = () => {

return new ReviewModel({
    date: faker.date.past().toISOString(),
    customerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    hora: faker.datatype.datetime().toISOString(),
    stars: faker.number.int({ min: 1, max: 5 }),
    review: faker.lorem.paragraph(),    
    status: faker.datatype.boolean(),
    phone: faker.phone.number().toString(),
  });
};

export const randomReviews = Array.from({ length: 10 }, createRandomReview);
import { UserModel } from './../Schemas/user';
import { faker } from '@faker-js/faker';

const createRandomUser = () => {

return new UserModel({
    photo: faker.image.url(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    job: faker.person.jobTitle(),
    phone: faker.phone.number().toString(),
    status: faker.datatype.boolean(),
    pass: faker.internet.password()
  });
};

export const randomUsers = Array.from({ length: 10 }, createRandomUser);
import { RoomModel } from "../Schemas/room";
import { faker } from '@faker-js/faker';

const createRandomRoom = () => {

const amenitiesOptions = ["AC", "Shower", "Double Bed", "Towel", "Bathup", "Coffee Set", "LED TV", "Wifi"];
const amenities = faker.helpers.arrayElements(amenitiesOptions, faker.datatype.number({ min: 0, max: amenitiesOptions.length }));

return new RoomModel({
    fotoLink: [faker.image.url()],
    number: faker.number.int({ min: 1, max: 100 }).toString(),
    floor: faker.number.int({ min: 1, max: 10 }),
    bedType: faker.helpers.arrayElement(["Single Bed", "Double Bed", "Double Superior", "Suite"]),
    amenities: amenities,
    price: faker.number.int({ min: 150, max: 200 }),
    status: faker.datatype.boolean(),
    offer: faker.number.int({ min: 100, max: 140 })
  });
};

export const randomRooms = Array.from({ length: 10 }, createRandomRoom);
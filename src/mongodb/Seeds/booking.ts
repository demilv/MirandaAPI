import { BookingModel } from "../Schemas/booking";
import { faker } from '@faker-js/faker';
import { RoomModel } from "../Schemas/room";

const createRandomBooking = async (rooms: string[]) => {
    const orderDate = faker.date.recent();
    const updateCheckInDate = new Date(orderDate);
    updateCheckInDate.setDate(updateCheckInDate.getDate() + 1);
    const checkInDate = faker.date.soon(faker.number.int({ min: 1, max: 270 }), updateCheckInDate);
    const updateCheckOutDate = new Date(checkInDate);
    updateCheckOutDate.setDate(updateCheckOutDate.getDate() + 1); 
    const checkOutDate = faker.date.soon(faker.number.int({ min: 1, max: 30 }), checkInDate);
    
    return new BookingModel({
        fotoLink: faker.image.url(),
        guest: `${faker.person.firstName()} ${faker.person.lastName()}`,
        orderDate: orderDate.toISOString(),
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        specialRequest: faker.word.words({ count: { min: 5, max: 10 } }),
        status: faker.helpers.arrayElement(["Check In", "Check Out", "In Progress"]),
        roomId: faker.helpers.arrayElement(rooms)
    });
};

export const generateRandomBookings = async (numBookings: number) => {
    const rooms = await RoomModel.find().distinct('_id').exec();
    const bookings: any[] = [];
    
    for (let i = 0; i < numBookings; i++) {
        const newBooking = await createRandomBooking(rooms.map(room => room.toString()));
        
        let onGoning = bookings.some(existingBooking =>
            existingBooking.roomId === newBooking.roomId &&
            ((existingBooking.checkInDate < newBooking.checkOutDate && existingBooking.checkOutDate > newBooking.checkInDate))
        );

        if (!onGoning) {
            bookings.push(newBooking);
        } else {
            i--;
        }
    }

    return bookings;
};

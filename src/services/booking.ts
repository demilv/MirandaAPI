import { BookingModel } from '../mongodb/Schemas/booking';
import { APIError } from '../errors/APIerror';
import { Booking as BookingInterface } from '../interfaces/Booking';
import { Types } from 'mongoose';


export class Booking {

    static async fetchAll(): Promise<BookingInterface[]> {
        try {
            const bookings = await BookingModel.find({}).exec();
            return bookings as BookingInterface[];
        } catch (error) {
            throw new APIError(`Bookings not found `, 404);
        }
    }

    static async getBooking(id: string){    
        const objectId = new Types.ObjectId(id); 

        const booking = await BookingModel.findById(objectId).exec();        
        if (!booking){
            throw new APIError(`Booking not found: ${id}`, 404);            
        }
        return booking;
    }
    
    static async save(newBooking: BookingInterface): Promise<BookingInterface> {
        try {
            const booking = new BookingModel(newBooking);
            await booking.save();
            return booking as BookingInterface;
        } catch (error) {
            throw new APIError(`Bookings not saved`, 404);
        }
    }

    static async Edit(id: Types.ObjectId, updatedBookingData: Partial<BookingInterface>): Promise<BookingInterface | null> {
        try {
            const updatedBooking = await BookingModel.findByIdAndUpdate(id, updatedBookingData, { new: true }).exec();
            return updatedBooking as BookingInterface | null;
        } catch (error) {
            throw new APIError(`Bookings not edited: ${id}` , 404);
        }
    }

    static async Delete(id: Types.ObjectId): Promise<BookingInterface | null> {
        try {
            const deletedBooking = await BookingModel.findByIdAndDelete(id).exec();
            return deletedBooking as BookingInterface | null;
        } catch (error) {
            throw new APIError(`Bookings not deleted: ${id}` , 404);
        }
    
    }
}

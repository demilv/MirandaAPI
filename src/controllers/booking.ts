import { Request, Response, NextFunction } from 'express';
import { Booking as BookingService } from '../services/booking';
import { Booking as BookingInterface } from '../interfaces/Booking';
import { Types } from 'mongoose';

const fetchAllBookings = async () => {
    try {
        const bookings = await BookingService.fetchAll();
        if (!bookings) {
            throw new Error('Bookings not found');
        }
        return bookings;
    } catch (e) {
        throw e;
    }
};

export const getAllBookings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await fetchAllBookings();
        return res.json( bookings );
    } catch (e) {
        return next(e);
    }
};

export const getOneBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await fetchAllBookings();        
        const bookingIndex = parseInt(req.params.id, 10)-1;

        if (isNaN(bookingIndex) || bookingIndex < 0 || bookingIndex >= bookings.length) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[bookingIndex];
        return res.status(200).json(booking);
    } catch (e) {
        return next(e);
    }
};

export const setNewBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newBooking: BookingInterface = req.body;
        if (!newBooking.fotoLink || !newBooking.guest || 
            !newBooking.orderDate || !newBooking.checkInDate || !newBooking.checkOutDate || 
            !newBooking.specialRequest || !newBooking.status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const savedBooking = await BookingService.save(newBooking);
        console.log(savedBooking)
        return res.status(201).json({ booking: savedBooking });
    } catch (e) {
        return next(e);
    }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;  
        const objectId = new Types.ObjectId(id);

        const updatedBookingData: Partial<BookingInterface> = req.body;
        const updatedBooking = await BookingService.Edit(objectId, updatedBookingData);

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.json({ user: updatedBooking });
    } catch (e) {
        return next(e);
    }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;  
        const objectId = new Types.ObjectId(id);
        
        const deletedBooking = await BookingService.Delete(objectId);  
        
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        return res.json({ message: 'Booking deleted successfully' });
    } catch (e) {
        return next(e);
    }
};

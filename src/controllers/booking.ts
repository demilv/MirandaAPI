import { Request, Response, NextFunction } from 'express';
import { Booking as BookingService } from '../services/booking';
import { Booking as BookingInterface } from '../interfaces/Booking';
import { Connection } from 'mysql2/promise';

const fetchAllBookings = async (db: Connection) => {
    try {
        const bookings = await BookingService.fetchAll(db);
        if (!bookings || bookings.length === 0) {
            throw new Error('Bookings not found');
        }
        return bookings;
    } catch (e) {
        throw e;
    }
};

export const getAllBookings = async (res: Response, next: NextFunction, db: Connection) => {
    try {
        const bookings = await fetchAllBookings(db);
        return res.json(bookings);
    } catch (e) {
        return next(e);
    }
};

export const getOneBooking = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const bookings = await fetchAllBookings(db);
        const bookingIndex = parseInt(req.params.id, 10);

        if (isNaN(bookingIndex) || bookingIndex < 0 || bookingIndex >= bookings.length) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[bookingIndex];
        return res.status(200).json(booking);
    } catch (e) {
        return next(e);
    }
};

export const setNewBooking = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const newBooking: BookingInterface = req.body;
        if (!newBooking.fotoLink || !newBooking.guest || 
            !newBooking.orderDate || !newBooking.checkInDate || !newBooking.checkOutDate || 
            !newBooking.specialRequest || !newBooking.status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const savedBooking = await BookingService.save(db, newBooking);
        return res.status(201).json({ booking: savedBooking });
    } catch (e) {
        return next(e);
    }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const bookingIndex = parseInt(req.params.id, 10);
        const updatedBookingData: Partial<BookingInterface> = req.body;
        const updatedBooking = await BookingService.Edit(db, bookingIndex, updatedBookingData);

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.json({ booking: updatedBooking });
    } catch (e) {
        return next(e);
    }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const bookingIndex = parseInt(req.params.id, 10);
        const deletedBooking = await BookingService.Delete(db, bookingIndex);
        
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        return res.json({ message: 'Booking deleted successfully' });
    } catch (e) {
        return next(e);
    }
};

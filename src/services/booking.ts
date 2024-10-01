import { Connection } from 'mysql2/promise';
import { Booking as BookingInterface } from '../interfaces/Booking';
import { APIError } from '../errors/APIerror';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export class Booking {
    static async fetchAll(db: Connection): Promise<BookingInterface[]> {
        try {
            const [bookings] = await db.query<RowDataPacket[]>('SELECT * FROM Bookings');
            return bookings as BookingInterface[]
        } catch (error) {
            throw new APIError(`Bookings not found: `, 404);
        }
    }

    static async getBooking(db: Connection, id: number): Promise<BookingInterface> {
        try {
            const [booking] = await db.query<RowDataPacket[]>('SELECT * FROM Bookings WHERE _id = ?', [id]);
            if (!booking || booking.length === 0) {
                throw new APIError(`Booking not found: ${id}`, 404);
            }
            return booking[0] as BookingInterface;
        } catch (error) {
            throw new APIError(`Booking not found: `, 404);
        }
    }

    static async save(db: Connection, newBooking: BookingInterface): Promise<BookingInterface> {
        try {
            const { fotoLink, guest, orderDate, checkInDate, checkOutDate, specialRequest, status, roomId } = newBooking;
            const [result] = await db.query<ResultSetHeader>('INSERT INTO Bookings (fotoLink, guest, orderDate, checkInDate, checkOutDate, specialRequest, status, roomId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [fotoLink, guest, orderDate, checkInDate, checkOutDate, specialRequest, status, roomId]);
            
            return { ...newBooking, _id: result.insertId.toString() };
        } catch (error) {
            throw new APIError(`Booking not saved: `, 404);
        }
    }

    static async Edit(db: Connection, id: number, updatedBookingData: Partial<BookingInterface>): Promise<BookingInterface | null> {
        try {
            const [result] = await db.query<ResultSetHeader>('UPDATE Bookings SET ? WHERE _id = ?', [updatedBookingData, id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Booking not found: ${id}`, 404);
            }
            return this.getBooking(db, id);
        } catch (error) {
            throw new APIError(`Booking not edited: `, 404);
        }
    }

    static async Delete(db: Connection, id: number): Promise<BookingInterface | null> {
        try {
            const booking = await this.getBooking(db, id);
            const [result] = await db.query<ResultSetHeader>('DELETE FROM Bookings WHERE _id = ?', [id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Booking not found: ${id}`, 404);
            }
            return booking;
        } catch (error) {
            throw new APIError(`Booking not deleted: `, 404);
        }
    }
}


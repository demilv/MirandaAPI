import { Connection } from 'mysql2/promise';
import { Room as RoomInterface } from '../interfaces/Room';
import { APIError } from '../errors/APIerror';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export class Room {
    static async fetchAll(db: Connection): Promise<RoomInterface[]> {
        try {
            const [rooms] = await db.query<RowDataPacket[]>(`
                SELECT Rooms._id, Rooms.number, Rooms.floor, Rooms.bedType, Rooms.price, Rooms.status, Rooms.offer,
                    IFNULL(GROUP_CONCAT(DISTINCT RoomAmenities.amenity), '') AS amenities,
                    IFNULL(GROUP_CONCAT(DISTINCT RoomPhotos.photoLink), '') AS fotoLink
                FROM Rooms
                LEFT JOIN RoomAmenities ON Rooms._id = RoomAmenities.roomId
                LEFT JOIN RoomPhotos ON Rooms._id = RoomPhotos.roomId
                GROUP BY Rooms._id;
            `);
            console.log(rooms)
            return rooms as RoomInterface[]
        } catch (error) {
            throw new APIError(`Rooms not found: `, 404);
        }
    }

    static async getRoom(db: Connection, id: number): Promise<RoomInterface> {
        try {
            const [room] = await db.query<RowDataPacket[]>(`
                SELECT Rooms._id, Rooms.number, Rooms.floor, Rooms.bedType, Rooms.price, Rooms.status, Rooms.offer,
                        IFNULL(GROUP_CONCAT(DISTINCT RoomAmenities.amenity), '') AS amenities,
                        IFNULL(GROUP_CONCAT(DISTINCT RoomPhotos.photoLink), '') AS fotoLink
                FROM Rooms
                LEFT JOIN RoomAmenities ON Rooms._id = RoomAmenities.roomId
                LEFT JOIN RoomPhotos ON Rooms._id = RoomPhotos.roomId
                WHERE Rooms._id = ?
                GROUP BY Rooms._id;
            `, [id]);
            if (!room || room.length === 0) {
                throw new APIError(`Room not found: ${id}`, 404);
            }
            return room[0] as RoomInterface;
        } catch (error) {
            throw new APIError(`Room not found: `, 404);
        }
    }

    /*static async save(db: Connection, newRoom: RoomInterface): Promise<RoomInterface> {
        try {
            const { fotoLink, number, floor, bedType, amenities, price, status, offer } = newRoom;
            const [result] = await db.query<ResultSetHeader>('INSERT INTO Rooms (fotoLink, number, floor, bedType, amenities, price, status, offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [fotoLink, number, floor, bedType, amenities, price, status, offer]);
            
            return { ...newRoom, _id: result.insertId.toString() };
        } catch (error) {
            throw new APIError(`Room not saved: `, 404);
        }
    }

    static async Edit(db: Connection, id: number, updatedRoomData: Partial<RoomInterface>): Promise<RoomInterface | null> {
        try {
            const [result] = await db.query<ResultSetHeader>('UPDATE Rooms SET ? WHERE _id = ?', [updatedRoomData, id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Room not found: ${id}`, 404);
            }
            return this.getRoom(db, id);
        } catch (error) {
            throw new APIError(`Room not edited: `, 404);
        }
    }

    static async Delete(db: Connection, id: number): Promise<RoomInterface | null> {
        try {
            const room = await this.getRoom(db, id);
            const [result] = await db.query<ResultSetHeader>('DELETE FROM Rooms WHERE _id = ?', [id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Room not found: ${id}`, 404);
            }
            return room;
        } catch (error) {
            throw new APIError(`Room not deleted: `, 404);
        }
    }*/

        static async save(db: Connection, newRoom: RoomInterface): Promise<RoomInterface> {
            try {
                await db.beginTransaction();
                
                const { number, floor, bedType, price, status, offer, amenities, fotoLink } = newRoom;  
                const [result] = await db.query<ResultSetHeader>(
                    'INSERT INTO Rooms (number, floor, bedType, price, status, offer) VALUES (?, ?, ?, ?, ?, ?)', 
                    [number, floor, bedType, price, status, offer]
                );
                const roomId = result.insertId;
                
                
                if (amenities && amenities.length > 0) {
                    for (const amenity of amenities) {
                        await db.query(
                            'INSERT INTO RoomAmenities (roomId, amenity) VALUES (?, ?)', 
                            [roomId, amenity]
                        );
                    }
                }
        
                if (fotoLink && fotoLink.length > 0) {
                    for (const link of fotoLink) {
                        await db.query(
                            'INSERT INTO RoomPhotos (roomId, photoLink) VALUES (?, ?)', 
                            [roomId, link]
                        );
                    }
                }
        
                await db.commit(); 
                return { ...newRoom, _id: roomId };
        
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error while saving room:', error.message);
                    throw new APIError(`Room not saved: ${error.message}`, 500);
                } else {
                    throw new APIError('Room not saved: Unknown error', 500);
                }
            }
        }

        static async Edit(db: Connection, id: number, updatedRoomData: Partial<RoomInterface>): Promise<RoomInterface | null> {
            try {
                const [result] = await db.query<ResultSetHeader>(
                    'UPDATE Rooms SET number = ?, floor = ?, bedType = ?, price = ?, status = ?, offer = ? WHERE _id = ?',
                    [updatedRoomData.number, updatedRoomData.floor, updatedRoomData.bedType, updatedRoomData.price, updatedRoomData.status, updatedRoomData.offer, id]
                );
        
                if (result.affectedRows === 0) {
                    throw new APIError(`Room not found: ${id}`, 404);
                }
        
                if (updatedRoomData.amenities && updatedRoomData.amenities.length > 0) {
                    await db.query('DELETE FROM RoomAmenities WHERE roomId = ?', [id]);
        
                    for (const amenity of updatedRoomData.amenities) {
                        await db.query(
                            'INSERT INTO RoomAmenities (roomId, amenity) VALUES (?, ?)', 
                            [id, amenity]
                        );
                    }
                }
        
                if (updatedRoomData.fotoLink && updatedRoomData.fotoLink.length > 0) {
                    await db.query('DELETE FROM RoomPhotos WHERE roomId = ?', [id]);
        
                    for (const link of updatedRoomData.fotoLink) {
                        await db.query(
                            'INSERT INTO RoomPhotos (roomId, photoLink) VALUES (?, ?)', 
                            [id, link]
                        );
                    }
                }
        
                return this.getRoom(db, id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error while saving room:', error.message);
                await db.rollback();
                throw new APIError(`Room not saved: ${error.message}`, 500);
            } else {
                await db.rollback();
                throw new APIError('Room not saved: Unknown error', 500);
            }
        } 
    }
    
    static async Delete(db: Connection, id: number): Promise<RoomInterface | null> {
        try {
            const room = await this.getRoom(db, id);    
            await db.query('DELETE FROM RoomAmenities WHERE roomId = ?', [id]);    
            await db.query('DELETE FROM RoomPhotos WHERE roomId = ?', [id]);    
            const [result] = await db.query<ResultSetHeader>('DELETE FROM Rooms WHERE _id = ?', [id]);

            if (result.affectedRows === 0) {
                throw new APIError(`Room not found: ${id}`, 404);
            }
    
            await db.commit();
            return room;
        } catch (error) {
            await db.rollback();
            throw new APIError(`Room not deleted: `, 404);
        } 
    }
    
    
}


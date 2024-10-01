import { Request, Response, NextFunction } from 'express';
import { Room as RoomService } from '../services/room';
import { Room as RoomInterface } from '../interfaces/Room';
import { Connection } from 'mysql2/promise';

const fetchAllRooms = async (db: Connection) => {
    try {
        const rooms = await RoomService.fetchAll(db);
        if (!rooms || rooms.length === 0) {
            throw new Error('Rooms not found');
        }
        return rooms;
    } catch (e) {
        throw e;
    }
};

export const getAllRooms = async (res: Response, next: NextFunction, db: Connection) => {
    try {
        const rooms = await fetchAllRooms(db);
        return res.json(rooms);
    } catch (e) {
        return next(e);
    }
};

export const getOneRoom = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const rooms = await fetchAllRooms(db);
        const roomIndex = parseInt(req.params.id, 10);

        if (isNaN(roomIndex) || roomIndex < 0 || roomIndex >= rooms.length) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const room = rooms[roomIndex];
        return res.status(200).json(room);
    } catch (e) {
        return next(e);
    }
};

export const setNewRoom = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const newRoom: RoomInterface = req.body;
        if (!newRoom.fotoLink || !newRoom.number || !newRoom.floor || 
            !newRoom.bedType || !newRoom.amenities || !newRoom.price || newRoom.status === undefined || !newRoom.offer) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const savedRoom = await RoomService.save(db, newRoom);
        return res.status(201).json({ room: savedRoom });
    } catch (e) {
        return next(e);
    }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const roomIndex = parseInt(req.params.id, 10);
        const updatedRoomData: Partial<RoomInterface> = req.body;
        const updatedRoom = await RoomService.Edit(db, roomIndex, updatedRoomData);

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        return res.json({ room: updatedRoom });
    } catch (e) {
        return next(e);
    }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const roomIndex = parseInt(req.params.id, 10);
        const deletedRoom = await RoomService.Delete(db, roomIndex);
        
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        return res.json({ message: 'Room deleted successfully' });
    } catch (e) {
        return next(e);
    }
};

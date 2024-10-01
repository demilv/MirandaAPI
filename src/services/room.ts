import { RoomModel } from '../mongodb/Schemas/room';
import { Room as RoomInterface } from '../interfaces/Room';
import { APIError } from '../errors/APIerror';
import { Types } from 'mongoose';

export class Room {
    static async fetchAll(): Promise<RoomInterface[]> {
        try {
            const rooms = await RoomModel.find({}).exec();
            return rooms as RoomInterface[];
        } catch (error) {
            throw new APIError(`Rooms not found: `, 404);
        }
    }

    static async getRoom(id: string){    
        const objectId = new Types.ObjectId(id); 

        const room = await RoomModel.findById(objectId).exec();        
        if (!room){
            throw new APIError(`Room not found: ${id}`, 404);            
        }
        return room;
    }

    
    static async save(newRoom: RoomInterface): Promise<RoomInterface> {
        try {
            const room = new RoomModel(newRoom);
            await room.save();
            return room as RoomInterface;
        } catch (error) {
            throw new APIError(`Rooms not saved: ` , 404);
        }
    }

    static async Edit(id: Types.ObjectId, updatedRoomData: Partial<RoomInterface>): Promise<RoomInterface | null> {
        try {
            const updatedRoom = await RoomModel.findByIdAndUpdate(id, updatedRoomData, { new: true }).exec();
            return updatedRoom as RoomInterface | null;
        } catch (error) {
            throw new APIError(`Rooms not edited: ${id}` , 404);
        }
    }

    static async Delete(id: Types.ObjectId): Promise<RoomInterface | null> {
        try {
            const deletedRoom = await RoomModel.findByIdAndDelete(id).exec();
            return deletedRoom as RoomInterface | null;
        } catch (error) {
            throw new APIError(`Rooms not deleted: ${id}` , 404);
        }
    
    }
}

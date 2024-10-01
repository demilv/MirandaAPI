import { UserModel } from '../mongodb/Schemas/user';
import { User as UserInterface } from '../interfaces/User';
import { APIError } from '../errors/APIerror';
import { Types } from 'mongoose';


export class User {

    static async fetchAll() : Promise<UserInterface[]> {
        try{
            const users = await UserModel.find({}).exec();
            return users as UserInterface[];
        } catch(error) {
            throw new APIError(`Users not found: ` , 404);
        }
    }

   
    static async getUser(id: string) {    
        const objectId = new Types.ObjectId(id); 

        const user = await UserModel.findById(objectId).exec(); 
        
        if (!user) {
            throw new APIError(`User not found: ${id}`, 404);            
        }
        return user;
    }
    

    static async save(newUser: UserInterface): Promise<UserInterface> {
        try {
            const user = new UserModel(newUser);
            await user.save();
            return user as UserInterface;
        } catch (error) {
            throw new APIError(`Users not saved: ` , 404);
        }
    }

    static async Edit(id: Types.ObjectId, updatedUserData: Partial<UserInterface>): Promise<UserInterface | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, updatedUserData, { new: true }).exec();
            return updatedUser as UserInterface | null;
        } catch (error) {
            throw new APIError(`Users not edited: ${id}` , 404);
        }
    }

    static async Delete(id: Types.ObjectId): Promise<UserInterface | null> {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id).exec();
            return deletedUser as UserInterface | null;
        } catch (error) {
            throw new APIError(`Users not deleted: ${id}` , 404);
        }
    }
}
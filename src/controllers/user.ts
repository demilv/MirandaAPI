import { Request, Response, NextFunction } from 'express';
import { User as UserService } from '../services/user';
import { User as UserInterface } from '../interfaces/User';
import { hashPassword } from '../mongodb/HashingChecking/HashCheck';
import { Types } from 'mongoose';

const fetchAllUsers = async () => {
    try {
        const users = await UserService.fetchAll();
        if (!users) {
            throw new Error('Users not found');
        }
        return users;
    } catch (e) {
        throw e;
    }
};


export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await fetchAllUsers();
        return res.json( users );
    } catch (e) {
        return next(e);
    }
};


export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await fetchAllUsers();
        const userIndex = parseInt(req.params.id, 10)-1;

        if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[userIndex];
        return res.status(200).json(user);
    } catch (e) {       
            return next(e);
        
    }
};

export const setNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser: UserInterface = req.body;
        if (!newUser.photo || !newUser.name || 
            !newUser.startDate || !newUser.email || !newUser.job || 
            !newUser.phone || newUser.status === undefined || !newUser.pass) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        newUser.pass = await hashPassword(newUser.pass);

        const savedUser = await UserService.save(newUser);
        console.log(savedUser)
        return res.status(201).json({ user: savedUser });
    } catch (e) {
        return next(e);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;  
        const objectId = new Types.ObjectId(id);

        const updatedUserData: Partial<UserInterface> = req.body;
        
        if (updatedUserData.pass) {
            updatedUserData.pass = await hashPassword(updatedUserData.pass);
        }
        const updatedUser = await UserService.Edit(objectId, updatedUserData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user: updatedUser });
    } catch (e) {
        return next(e);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;  
        const objectId = new Types.ObjectId(id);
        
        const deletedUser = await UserService.Delete(objectId);  
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({ message: 'User deleted successfully' });
    } catch (e) {
        return next(e);
    }
};


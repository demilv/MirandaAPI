import { Request, Response, NextFunction } from 'express';
import { User as UserService } from '../services/user';
import { User as UserInterface } from '../interfaces/User';
import { Connection } from 'mysql2/promise';
import { hashPassword } from '../mongodb/HashingChecking/HashCheck';

const fetchAllUsers = async (db: Connection) => {
    try {
        const users = await UserService.fetchAll(db);
        if (!users || users.length === 0) {
            throw new Error('Users not found');
        }
        return users;
    } catch (e) {
        throw e;
    }
};

export const getAllUsers = async (res: Response, next: NextFunction, db: Connection) => {
    try {
        const users = await fetchAllUsers(db);
        return res.json(users);
    } catch (e) {
        return next(e);
    }
};

export const getOneUser = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const users = await fetchAllUsers(db);
        const userIndex = parseInt(req.params.id, 10) - 1;

        if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[userIndex];
        return res.status(200).json(user);
    } catch (e) {
        return next(e);
    }
};

export const setNewUser = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const newUser: UserInterface = req.body;
        if (!newUser.photo || !newUser.name || 
            !newUser.startDate || !newUser.email || !newUser.job || 
            !newUser.phone || newUser.status === undefined || !newUser.pass) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        newUser.pass = await hashPassword(newUser.pass);

        const savedUser = await UserService.save(db, newUser);
        return res.status(201).json({ user: savedUser });
    } catch (e) {
        return next(e);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const userIndex = parseInt(req.params.id, 10);
        const updatedUserData: Partial<UserInterface> = req.body;

        if (updatedUserData.pass) {
            updatedUserData.pass = await hashPassword(updatedUserData.pass);
        }

        const updatedUser = await UserService.Edit(db, userIndex, updatedUserData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user: updatedUser });
    } catch (e) {
        return next(e);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const userIndex = parseInt(req.params.id, 10);
        const deletedUser = await UserService.Delete(db, userIndex);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({ message: 'User deleted successfully' });
    } catch (e) {
        return next(e);
    }
};
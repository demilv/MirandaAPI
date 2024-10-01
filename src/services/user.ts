import { Connection } from 'mysql2/promise';
import { User as UserInterface } from '../interfaces/User';
import { APIError } from '../errors/APIerror';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export class User {
    static async fetchAll(db: Connection): Promise<UserInterface[]> {
        try {
            const [users] = await db.query<RowDataPacket[]>('SELECT * FROM Users');
            return users as UserInterface[]
        } catch (error) {
            throw new APIError(`Users not found: `, 404);
        }
    }

    static async getUser(db: Connection, id: number): Promise<UserInterface> {
        try {
            const [user] = await db.query<RowDataPacket[]>('SELECT * FROM Users WHERE _id = ?', [id]);
            if (!user || user.length === 0) {
                throw new APIError(`User not found: ${id}`, 404);
            }
            return user[0] as UserInterface;
        } catch (error) {
            throw new APIError(`User not found: `, 404);
        }
    }

    static async save(db: Connection, newUser: UserInterface): Promise<UserInterface> {
        try {
            const { photo, name, startDate, email, job, phone, status, pass } = newUser;
            const [result] = await db.query<ResultSetHeader>('INSERT INTO Users (photo, name, startDate, email, job, phone, status, pass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [photo, name, startDate, email, job, phone, status, pass]);
            
            return { ...newUser, _id: result.insertId.toString() };
        } catch (error) {
            throw new APIError(`User not saved: `, 404);
        }
    }

    static async Edit(db: Connection, id: number, updatedUserData: Partial<UserInterface>): Promise<UserInterface | null> {
        try {
            const [result] = await db.query<ResultSetHeader>('UPDATE Users SET ? WHERE _id = ?', [updatedUserData, id]);
            if (result.affectedRows === 0) {
                throw new APIError(`User not found: ${id}`, 404);
            }
            return this.getUser(db, id);
        } catch (error) {
            throw new APIError(`User not edited: `, 404);
        }
    }

    static async Delete(db: Connection, id: number): Promise<UserInterface | null> {
        try {
            const user = await this.getUser(db, id);
            const [result] = await db.query<ResultSetHeader>('DELETE FROM Users WHERE _id = ?', [id]);
            if (result.affectedRows === 0) {
                throw new APIError(`User not found: ${id}`, 404);
            }
            return user;
        } catch (error) {
            throw new APIError(`User not deleted: `, 404);
        }
    }
}


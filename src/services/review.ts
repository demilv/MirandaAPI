import { Connection } from 'mysql2/promise';
import { Review as ReviewInterface } from '../interfaces/Review';
import { APIError } from '../errors/APIerror';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export class Review {
    static async fetchAll(db: Connection): Promise<ReviewInterface[]> {
        try {
            const [reviews] = await db.query<RowDataPacket[]>('SELECT * FROM Reviews');
            return reviews as ReviewInterface[]
        } catch (error) {
            throw new APIError(`Reviews not found: `, 404);
        }
    }

    static async getReview(db: Connection, id: number): Promise<ReviewInterface> {
        try {
            const [review] = await db.query<RowDataPacket[]>('SELECT * FROM Reviews WHERE _id = ?', [id]);
            if (!review || review.length === 0) {
                throw new APIError(`Review not found: ${id}`, 404);
            }
            return review[0] as ReviewInterface;
        } catch (error) {
            throw new APIError(`Review not found: `, 404);
        }
    }

    static async save(db: Connection, newReview: ReviewInterface): Promise<ReviewInterface> {
        try {
            const { date, hora, customerName, email, stars, review, status, phone } = newReview;
            const [result] = await db.query<ResultSetHeader>('INSERT INTO Reviews (date, hora, customerName, email, stars, review, status, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [date, hora, customerName, email, stars, review, status, phone]);
            
            return { ...newReview, _id: result.insertId.toString() };
        } catch (error) {
            throw new APIError(`Review not saved: `, 404);
        }
    }

    static async Edit(db: Connection, id: number, updatedReviewData: Partial<ReviewInterface>): Promise<ReviewInterface | null> {
        try {
            const [result] = await db.query<ResultSetHeader>('UPDATE Reviews SET ? WHERE _id = ?', [updatedReviewData, id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Review not found: ${id}`, 404);
            }
            return this.getReview(db, id);
        } catch (error) {
            throw new APIError(`Review not edited: `, 404);
        }
    }

    static async Delete(db: Connection, id: number): Promise<ReviewInterface | null> {
        try {
            const review = await this.getReview(db, id);
            const [result] = await db.query<ResultSetHeader>('DELETE FROM Reviews WHERE _id = ?', [id]);
            if (result.affectedRows === 0) {
                throw new APIError(`Review not found: ${id}`, 404);
            }
            return review;
        } catch (error) {
            throw new APIError(`Review not deleted: `, 404);
        }
    }
}


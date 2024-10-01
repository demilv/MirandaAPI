import { Request, Response, NextFunction } from 'express';
import { Review as ReviewService } from '../services/review';
import { Review as ReviewInterface } from '../interfaces/Review';
import { Connection } from 'mysql2/promise';

const fetchAllReviews = async (db: Connection) => {
    try {
        const reviews = await ReviewService.fetchAll(db);
        if (!reviews || reviews.length === 0) {
            throw new Error('Reviews not found');
        }
        return reviews;
    } catch (e) {
        throw e;
    }
};

export const getAllReviews = async (res: Response, next: NextFunction, db: Connection) => {
    try {
        const reviews = await fetchAllReviews(db);
        return res.json(reviews);
    } catch (e) {
        return next(e);
    }
};

export const getOneReview = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const reviews = await fetchAllReviews(db);
        const reviewIndex = parseInt(req.params.id, 10);

        if (isNaN(reviewIndex) || reviewIndex < 0 || reviewIndex >= reviews.length) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const review = reviews[reviewIndex];
        return res.status(200).json(review);
    } catch (e) {
        return next(e);
    }
};

export const setNewReview = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const newReview: ReviewInterface = req.body;
        if (!newReview.date || !newReview.hora || 
            !newReview.customerName || !newReview.email || 
            typeof newReview.stars !== 'number' || !newReview.review || 
            newReview.status === undefined || !newReview.phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const savedReview = await ReviewService.save(db, newReview);
        return res.status(201).json({ review: savedReview });
    } catch (e) {
        return next(e);
    }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const reviewIndex = parseInt(req.params.id, 10);
        const updatedReviewData: Partial<ReviewInterface> = req.body;
        const updatedReview = await ReviewService.Edit(db, reviewIndex, updatedReviewData);

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        return res.json({ review: updatedReview });
    } catch (e) {
        return next(e);
    }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction, db: Connection) => {
    try {
        const reviewIndex = parseInt(req.params.id, 10);
        const deletedReview = await ReviewService.Delete(db, reviewIndex);
        
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        return res.json({ message: 'Review deleted successfully' });
    } catch (e) {
        return next(e);
    }
};

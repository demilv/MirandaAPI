import { ReviewModel } from '../mongodb/Schemas/review';
import { APIError } from '../errors/APIerror';
import { Review as ReviewInterface } from '../interfaces/Review';
import { Types } from 'mongoose';


export class Review {

    static async fetchAll(): Promise<ReviewInterface[]> {
        try {
            const reviews = await ReviewModel.find({}).exec();
            return reviews as ReviewInterface[];
        } catch (error) {
            throw new APIError(`Reviews not found: `, 404);
        }
    }

    static async getReview(id: string){    
        const objectId = new Types.ObjectId(id); 

        const review = await ReviewModel.findById(objectId).exec();        
        if (!review){
            throw new APIError(`Review not found: ${id}`, 404);            
        }
        return review;
    }
    
    static async save(newReview: ReviewInterface): Promise<ReviewInterface> {
        try {
            const review = new ReviewModel(newReview);
            await review.save();
            return review as ReviewInterface;
        } catch (error) {
            throw new APIError(`Reviews not saved: `, 404);
        }
    }

    static async Edit(id: Types.ObjectId, updatedReviewData: Partial<ReviewInterface>): Promise<ReviewInterface | null> {
        try {
            const updatedReview = await ReviewModel.findByIdAndUpdate(id, updatedReviewData, { new: true }).exec();
            return updatedReview as ReviewInterface | null;
        } catch (error) {
            throw new APIError(`Reviews not edited: ${id}` , 404);
        }
    }

    static async Delete(id: Types.ObjectId): Promise<ReviewInterface | null> {
        try {
            const deletedReview = await ReviewModel.findByIdAndDelete(id).exec();
            return deletedReview as ReviewInterface | null;
        } catch (error) {
            throw new APIError(`Reviews not deleted: ${id}` , 404);
        }
    
    }
}
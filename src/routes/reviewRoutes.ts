import {getAllReviews, getOneReview, setNewReview, updateReview, deleteReview} from '../controllers/review';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Connection } from 'mysql2/promise'; 

/*router.get("/", getAllReviews)

router.get("/:id", getOneReview)

router.post("/newReview", setNewReview)

router.put("/upReview/:id", updateReview)

router.get("/delReview/:id", deleteReview)*/



const routerReviews = (db: Connection) => {
    router.get("/delReview/:id", (_req: Request, res: Response, next: NextFunction) => deleteReview(_req, res, next, db));
    router.get("/", (_req: Request, res: Response, next: NextFunction) => getAllReviews(res, next, db));
    router.get("/getReview/:id", (_req: Request, res: Response, next: NextFunction) => getOneReview(_req, res, next, db));
    router.post("/newReview", (_req: Request, res: Response, next: NextFunction) => setNewReview(_req, res, next, db));
    router.put("/upReview/:id", (_req: Request, res: Response, next: NextFunction) => updateReview(_req, res, next, db));

    return router;
}

export default routerReviews;
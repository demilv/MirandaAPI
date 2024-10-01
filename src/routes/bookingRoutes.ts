import {getAllBookings, getOneBooking, setNewBooking, updateBooking, deleteBooking} from '../controllers/booking';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Connection } from 'mysql2/promise'; 

/*router.get("/", getAllBookings)

router.get("/:id", getOneBooking)

router.post("/newBooking", setNewBooking)

router.put("/upBooking/:id", updateBooking)

router.get("/delBooking/:id", deleteBooking)*/

const routerBookings = (db: Connection) => {
    router.get("/delBooking/:id", (_req: Request, res: Response, next: NextFunction) => deleteBooking(_req, res, next, db));
    router.get("/", (_req: Request, res: Response, next: NextFunction) => getAllBookings(res, next, db));
    router.get("/getBooking/:id", (_req: Request, res: Response, next: NextFunction) => getOneBooking(_req, res, next, db));
    router.post("/newBooking", (_req: Request, res: Response, next: NextFunction) => setNewBooking(_req, res, next, db));
    router.put("/upBooking/:id", (_req: Request, res: Response, next: NextFunction) => updateBooking(_req, res, next, db));

    return router;
}

export default routerBookings;



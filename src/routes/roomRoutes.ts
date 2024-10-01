import {getAllRooms, getOneRoom, deleteRoom, setNewRoom, updateRoom, } from '../controllers/room';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Connection } from 'mysql2/promise'; 

/*router.get("/delRoom/:id", deleteRoom)

router.get("/", getAllRooms)

router.get("/getRoom/:id", getOneRoom)

router.post("/newRoom", setNewRoom)

router.put("/upRoom/:id", updateRoom)




export default router;*/


const routerRooms = (db: Connection) => {
    router.get("/delRoom/:id", (_req: Request, res: Response, next: NextFunction) => deleteRoom(_req, res, next, db));
    router.get("/", (_req: Request, res: Response, next: NextFunction) => getAllRooms(res, next, db));
    router.get("/getRoom/:id", (_req: Request, res: Response, next: NextFunction) => getOneRoom(_req, res, next, db));
    router.post("/newRoom", (_req: Request, res: Response, next: NextFunction) => setNewRoom(_req, res, next, db));
    router.put("/upRoom/:id", (_req: Request, res: Response, next: NextFunction) => updateRoom(_req, res, next, db));

    return router;
}

export default routerRooms;

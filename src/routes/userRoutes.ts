import {getAllUsers, getOneUser, setNewUser, updateUser, deleteUser} from '../controllers/user';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Connection } from 'mysql2/promise'; 

/*router.get("/delUser/:id", deleteUser)

router.get("/", getAllUsers)

router.get("/:id", getOneUser)

router.post("/newUser", setNewUser)

router.put("/upUser/:id", updateUser)*/

const routerUsers = (db: Connection) => {
    router.get("/delUser/:id", (_req: Request, res: Response, next: NextFunction) => deleteUser(_req, res, next, db));
    router.get("/", (_req: Request, res: Response, next: NextFunction) => getAllUsers(res, next, db));
    router.get("/getUser/:id", (_req: Request, res: Response, next: NextFunction) => getOneUser(_req, res, next, db));
    router.post("/newUser", (_req: Request, res: Response, next: NextFunction) => setNewUser(_req, res, next, db));
    router.put("/upUser/:id", (_req: Request, res: Response, next: NextFunction) => updateUser(_req, res, next, db));

    return router;
}

export default routerUsers;
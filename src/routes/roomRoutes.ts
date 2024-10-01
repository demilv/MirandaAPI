const express = require('express');
import {getAllRooms, getOneRoom, deleteRoom, setNewRoom, updateRoom, } from '../controllers/room';
const router = express.Router();

router.get("/delRoom/:id", deleteRoom)

router.get("/", getAllRooms)

router.get("/getRoom/:id", getOneRoom)

router.post("/newRoom", setNewRoom)

router.put("/upRoom/:id", updateRoom)




export default router;

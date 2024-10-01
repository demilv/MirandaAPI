const express = require('express');
import {getAllBookings, getOneBooking, setNewBooking, updateBooking, deleteBooking} from '../controllers/booking';
const router = express.Router();

router.get("/", getAllBookings)

router.get("/:id", getOneBooking)

router.post("/newBooking", setNewBooking)

router.put("/upBooking/:id", updateBooking)

router.get("/delBooking/:id", deleteBooking)



export default router;
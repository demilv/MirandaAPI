const express = require('express');
import {getAllReviews, getOneReview, setNewReview, updateReview, deleteReview} from '../controllers/review';
const router = express.Router();

router.get("/", getAllReviews)

router.get("/:id", getOneReview)

router.post("/newReview", setNewReview)

router.put("/upReview/:id", updateReview)

router.get("/delReview/:id", deleteReview)

export default router;
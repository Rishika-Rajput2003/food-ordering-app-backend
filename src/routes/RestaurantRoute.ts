import express from "express";
import { param } from "express-validator";
import Restaurant from "../models/restaurant";
import MyRestaurantController from "../controllers/MyRestaurantController";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();


router.get("/search/:city", 
    param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    RestaurantController.searchRestaurant
);

export default router;
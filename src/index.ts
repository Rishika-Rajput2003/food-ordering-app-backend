import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import {v2 as cloudinary} from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute"
import restaurantRoute from "./routes/RestaurantRoute"
import orderRoute from "./routes/OrderRoute"

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

mongoose.connect(process.env.MONGODB_URI as string)
.then(() => console.log("Connected to database"))
.catch((err) =>{
    console.log("mongo db connection failed", err);
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app= express();

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({type: "*/*"}));

app.use(express.json());

app.get("/health", async(req: Request, res: Response) =>{
    res.send({message: "health OK!"});
})

//basic endpoint that is to check if server has started successfully

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.listen(8000, () =>{
    console.log("server started on localhost:8000");
});
import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

mongoose.connect(process.env.MONGODB_URI as string)
.then(() => console.log("Connected to database"))
.catch((err) =>{
    console.log("mongo db connection failed", err);
});


const app= express();
app.use(express.json())
app.use(cors())

app.get("/health", async(req: Request, res: Response) =>{
    res.send({message: "health OK!"});
})

//basic endpoint that is to check if server has started successfully

app.use("/api/my/user", myUserRoute);

app.listen(8000, () =>{
    console.log("server started on localhost:8000");
});
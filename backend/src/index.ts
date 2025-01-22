import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { user } from "./models/sampleSchema";
import bcrypt from "bcryptjs";
import session from "express-session";
const dbUrl = process.env.MONGO_URL as string;
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    },
}));
app.use(express.json());
mongoose.connect(dbUrl)
    .then(() => { console.log("DB connected"); })
    .catch((err: any) => { console.log("Some error", err); });
app.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const checkUser = await user.findOne({ username });
        if (checkUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await user.create({
            username,
            password: hashedPassword,
        });
        if (!result) {
            res.status(400).json({ message: "Could not create user" });
            return;
        }
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        req.session.user = { id: existingUser._id.toString(), username: existingUser.username };
        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/check-session", (req: Request, res: Response) => {
    if (req.session.user) {
        res.status(200).json({ session: true, user: req.session.user });
    } else {
        res.status(401).json({ session: false });
    }
});
app.post("/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
    });
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
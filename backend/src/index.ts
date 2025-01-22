import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { user } from "./models/sampleSchema";
import bcrypt from "bcryptjs";
import session from "express-session";
import MongoStore from "connect-mongo";
const dbUrl = process.env.MONGO_URL as string;
const app = express();
app.use(cors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials (cookies)
}));

app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: dbUrl,
    }),
    cookie: {
        secure: true, // Set to false initially
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hour
        sameSite: false, // Allow cookies to be sent in all contexts
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
            res.status(400).json({ message: "Invalid username or password" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid username or password" });
            return;
        }
        req.session.user = { id: existingUser._id.toString(), username: existingUser.username };
        req.session.save((err) => {
            if (err) {
                console.log("Error saving session:", err);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
            console.log("Session saved successfully:", req.session.user);
            res.status(200).json({ message: "Logged in successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/check-session", (req: Request, res: Response) => {
    console.log(req.session.user)
    if (req.session.user) {
        res.status(200).json({ session: true, user: req.session.user });
        console.log("sucess for user auth");
        
    } else {
        console.log("decline  user auth");
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
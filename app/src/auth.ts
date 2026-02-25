import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { users } from "./authStore.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashed
  };

  users.push(newUser);

  const token = generateToken(newUser.id);

  res.json({ token, user: { id: newUser.id, name, email } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user.id);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
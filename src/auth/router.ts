import { Router } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import passport from "./passport";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, phoneNumber, password } = req.body;

  if (!name || !phoneNumber || !password) {
    return res
      .status(400)
      .json({ message: "Name, phone number, and password are required" });
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.phoneNumber, Number(phoneNumber)));

  if (existing) {
    return res.status(409).json({ message: "Phone number already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      phoneNumber: Number(phoneNumber),
      password: hashedPassword,
    })
    .returning();

  res
    .status(201)
    .json({ id: user.id, name: user.name, phoneNumber: user.phoneNumber });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Logged in",
        user: { id: user.id, name: user.name },
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = req.user as any;
  res.json({ id: user.id, name: user.name, phoneNumber: user.phoneNumber });
});

export default router;

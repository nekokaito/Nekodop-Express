import type { Request, Response } from "express";
import { db } from "../db/neonClient";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password, profilePicture } = req.body;
  const id = uuidv4();

  await db`INSERT INTO users (id, name, email, password, profile_picture) VALUES (${id}, ${userName}, ${email}, ${password}, ${profilePicture})`;

  res.json({
    message: "User created",
    user: { id, name: userName, email, profilePicture },
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user =
    await db`SELECT * FROM users WHERE email = ${email} AND password = ${password}`.then(
      (r) => r[0]
    );
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });
  res.json({ message: "Login successful", user });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db`SELECT * FROM users WHERE id = ${id}`.then((r) => r[0]);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User retrieved successfully", user });
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await db`SELECT * FROM users`;
  res.json({ message: "Users retrieved successfully", users });
};

export const updateUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { userName, email, profilePicture } = req.body;

  await db`UPDATE users SET name = ${userName}, email = ${email}, profile_picture = ${profilePicture} WHERE id = ${user_id}`;
  res.json({ message: "User updated successfully" });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await db`SELECT * FROM users WHERE id = ${user_id}`.then(
    (r) => r[0]
  );
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.password !== currentPassword)
    return res.status(401).json({ error: "Current password is incorrect" });

  await db`UPDATE users SET password = ${newPassword} WHERE id = ${user_id}`;
  res.json({ message: "Password updated successfully" });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { req_id, user_id } = req.params;

  const admin =
    await db`SELECT * FROM users WHERE id = ${req_id} AND user_role = 'admin'`.then(
      (r) => r[0]
    );
  if (!admin) return res.status(404).json({ error: "User is not admin" });

  await db`DELETE FROM users WHERE id = ${user_id}`;
  res.json({ message: "User deleted successfully" });
};

export const isAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db`SELECT user_role FROM users WHERE id = ${id}`.then(
    (r) => r[0]
  );
  res.json({ isAdmin: user && user.user_role === "admin" });
};

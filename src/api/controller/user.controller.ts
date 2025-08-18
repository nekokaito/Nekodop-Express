import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { sendJson } from "../../utils";
import { User } from "../../utils/type";
import bcrypt from "bcryptjs";

// register user
export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password, profilePicture }: User = req.body;

  const existingUser = await db`
    SELECT id FROM users WHERE email = ${email}
  `.then((r) => r[0]);

  if (existingUser) {
    return sendJson(
      res,
      "user",
      null,
      {
        message: "Email already registered",
        error: true,
      },
      400
    );
  }

  const id = uuidv4();
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  await db`
    INSERT INTO users (id, name, email, password, profile_picture) 
    VALUES (${id}, ${userName}, ${email}, ${encryptedPassword}, ${profilePicture})
  `;

  const user = await db`
    SELECT id, name, email, profile_picture, created_at
    FROM users
    WHERE id = ${id}
  `.then((r) => r[0]);

  sendJson(res, "user", user, { message: "User created" });
};

// login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  const user = await db`
    SELECT *
    FROM users
    WHERE email = ${email}
  `.then((r) => r[0]);

  if (!user) {
    return sendJson(
      res,
      "user",
      null,
      { message: "Invalid email", error: true },
      400
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return sendJson(
      res,
      "user",
      null,
      { message: "Invalid password", error: true },
      401
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = user;
  sendJson(res, "user", userData, { message: "Login successful" });
};

// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await db`
    SELECT id, name, email, profile_picture, user_role, created_at
    FROM users
    WHERE id = ${id}
  `.then((r) => r[0]);

  if (!user) {
    return sendJson(res, "user", null, {
      message: "User not found",
      error: true,
    });
  }

  sendJson(res, "user", user, {
    message: "User retrieved successfully",
  });
};

// Get Users

export const getUsers = async (req: Request, res: Response) => {
  const users =
    await db`SELECT id, name, email, profile_picture, user_role, created_at FROM users`;
  sendJson(res, "users", users, {
    message: "User retrieved successfully",
  });
};

// Update user profile
export const updateUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  // existing user
  const existingUser = await db`
    SELECT * FROM users WHERE id = ${user_id}
  `.then((r) => r[0]);

  if (!existingUser) {
    return sendJson(
      res,
      "user",
      null,
      { message: "User not found", error: true },
      404
    );
  }

  const {
    userName = existingUser.name,
    email = existingUser.email,
    profilePicture = existingUser.profile_picture,
  } = req.body;

  if (email !== existingUser.email) {
    const emailTaken = await db`
      SELECT id FROM users WHERE email = ${email}
    `.then((r) => r[0]);

    if (emailTaken) {
      return sendJson(
        res,
        "user",
        null,
        { message: "Email already in use", error: true },
        400
      );
    }
  }

  await db`
    UPDATE users
    SET name = ${userName}, email = ${email}, profile_picture = ${profilePicture}
    WHERE id = ${user_id}
  `;

  sendJson(
    res,
    "user",
    { id: user_id, userName, email, profilePicture },
    { message: "User updated successfully" }
  );
};

// Update password
export const updatePassword = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await db`
    SELECT password 
    FROM users 
    WHERE id = ${user_id}
  `.then((r) => r[0]);

  if (!user) {
    return sendJson(
      res,
      "user",
      null,
      {
        message: "User not found",
        error: true,
      },
      404
    );
  }

  const isMyOldPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isMyOldPassword) {
    return sendJson(
      res,
      "user",
      null,
      {
        message: "Current password is incorrect",
        error: true,
      },
      401
    );
  }

  const salt = await bcrypt.genSalt(10);
  const encryptedNewPassword = await bcrypt.hash(newPassword, salt);

  await db`
    UPDATE users 
    SET password = ${encryptedNewPassword} 
    WHERE id = ${user_id}
  `;

  sendJson(
    res,
    "user",
    { id: user_id },
    {
      message: "Password updated successfully",
    }
  );
};

export const deleteUser = async (req: Request, res: Response) => {
  const { req_id, user_id } = req.params;

  const admin =
    await db`SELECT * FROM users WHERE id = ${req_id} AND user_role = 'admin'`.then(
      (r) => r[0]
    );

  if (!admin) {
    return sendJson(
      res,
      "user",
      null,
      {
        message: "User is not admin",
        error: true,
      },
      403
    );
  }

  await db`DELETE FROM users WHERE id = ${user_id}`;

  sendJson(
    res,
    "user",
    { id: user_id },
    {
      message: "User deleted successfully",
    }
  );
};

export const isAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db`SELECT user_role FROM users WHERE id = ${id}`.then(
    (r) => r[0]
  );
  res.json({ isAdmin: user && user.user_role === "admin" });
};

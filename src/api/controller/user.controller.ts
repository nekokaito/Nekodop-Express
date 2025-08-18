import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { sendJson } from "../../utils";
import { User } from "../../utils/type";

// register user
export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password, profilePicture }: User = req.body;
  const id = uuidv4();

  await db`INSERT INTO users (id, name, email, password, profile_picture) VALUES (${id}, ${userName}, ${email}, ${password}, ${profilePicture})`;

  const user = await db`
    SELECT id, name, email, profile_picture, created_at
    FROM users
    WHERE email = ${email} AND password = ${password}
  `.then((r) => r[0]);
  sendJson(res, "user", user, { message: "User created" });
};

//login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  const user = await db`
    SELECT id, name, email, profile_picture, created_at
    FROM users
    WHERE email = ${email} AND password = ${password}
  `.then((r) => r[0]);

  if (!user) {
    return sendJson(res, "user", null, {
      message: "Invalid email or password",
      error: true,
    });
  }
  sendJson(res, "user", user, {
    message: "Login successful",
  });
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

  // fetch existing user
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

  // use new values if provided, otherwise fallback to existing
  const {
    userName = existingUser.name,
    email = existingUser.email,
    profilePicture = existingUser.profile_picture,
  } = req.body;

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

  if (user.password !== currentPassword) {
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

  await db`
    UPDATE users 
    SET password = ${newPassword} 
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

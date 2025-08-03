import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export const db = neon(process.env.NEON_DATABASE_URL as string);

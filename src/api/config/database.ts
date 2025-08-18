import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config();

export const db = neon(process.env.NEON_DATABASE_URL as string);

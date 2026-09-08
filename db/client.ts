import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  pool ??= mysql.createPool(databaseUrl);
  return pool;
}

export function getDb() {
  const activePool = getPool();
  return activePool ? drizzle(activePool) : null;
}

export async function checkDatabaseConnection() {
  const activePool = getPool();

  if (!activePool) {
    return {
      connected: false,
      message: "DATABASE_URL is not configured",
    };
  }

  try {
    await activePool.query("select 1 as ok");

    return {
      connected: true,
      message: "Database connected",
    };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

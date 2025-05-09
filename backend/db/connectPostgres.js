import pg from "pg";
import "dotenv/config";
import createUsersTable from "../models/user.model.js";
import createFilesTable from "../models/file.model.js";
import createPostsTable from "../models/post.model.js";
import createCommentsTable from "../models/comment.model.js";
import createPostLikesTable from "../models/postLike.model.js";
import createUserFollowsTable from "../models/userFollow.model.js";
import createNotificationsTable from "../models/notification.model.js";
import createAdsTable from "../models/ads.model.js";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  //
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  // connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Render
  // ssl: {
  //   rejectUnauthorized: false, // Required for connecting to Render Postgres
  // },
});

export async function databaseInit() {
  // try catch block
  try {
    //   promise is pending
    const dbName = await pool.query("SELECT current_database()");
    const dbRes = await pool.query("SELECT NOW()");
    const time = dbRes.rows[0].now;
    const name = dbName.rows[0].current_database;
    //   promise is fullfilled
    console.log(`Connected to ${name} at ${time}`);

    // create database tables
    await createFilesTable();
    await createUsersTable();
    await createPostsTable();
    await createCommentsTable();
    await createPostLikesTable();
    await createUserFollowsTable();
    await createNotificationsTable();
    await createAdsTable();
  } catch (error) {
    //   promise is rejected
    console.error(error);
    console.error("Database connection failed");
  }
}

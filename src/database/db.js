const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");

const schema = require("./schema");

const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString, { prepare: false })

const db = drizzle(client, { schema })

module.exports = { db };
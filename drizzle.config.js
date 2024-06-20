require('dotenv').config();
const { defineConfig } = require('drizzle-kit');

export default defineConfig({
  schema: './src/database/schema.js',
  out: './supabase/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
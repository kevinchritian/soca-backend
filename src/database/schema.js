const { pgTable, serial, varchar, timestamp, integer, text, doublePrecision, boolean } = require('drizzle-orm/pg-core')

const User = pgTable('users', {
    id: serial('id').primaryKey(),
    fullName: varchar('fullName', 255).notNull(),
    email: varchar('email', 255).notNull(),
    password: varchar('password', 255).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

const History = pgTable('history', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => User.id),
    image: varchar('image', 255).notNull(),
    label: text('label').notNull(),
    confidenceScore: doublePrecision('confidenceScore').notNull(),
    isFavorite: boolean('isFavorite').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date())
});

module.exports = { User, History };
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const serviceChecks = mysqlTable("service_checks", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 80 }).notNull(),
  status: varchar("status", { length: 40 }).notNull(),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

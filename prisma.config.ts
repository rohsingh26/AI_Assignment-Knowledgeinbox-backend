import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: "file:./data.db",
  },

  migrations: {
    path: "prisma/migrations",
  },
});

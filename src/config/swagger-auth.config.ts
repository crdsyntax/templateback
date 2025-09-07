import { INestApplication } from "@nestjs/common";
const basicAuth = require("express-basic-auth");

const SWAGGER_ENVS = ["development", "local"];
export function setupSwaggerAuth(app: INestApplication) {
  if (SWAGGER_ENVS.includes(process.env.NODE_ENV ?? "local")) {
    app.use(
      ["/api/doc", "/api/doc-json"],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER || "admin"]:
            process.env.SWAGGER_PASSWORD || "admin123",
        },
      }),
    );
  }
}

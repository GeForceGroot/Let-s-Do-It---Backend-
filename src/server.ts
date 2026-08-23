import app from "./app";
import { EnvConfig } from "./config/envConfig";
import { connectDatabase } from "./config/database";

const env = new EnvConfig();
connectDatabase()
  .then(() =>
    app.listen(env.PORT, () =>
      console.info(`API listening on http://localhost:${env.PORT}`),
    ),
  )
  .catch((error: unknown) => {
    console.error("Unable to start API:", error);
    process.exit(1);
  });

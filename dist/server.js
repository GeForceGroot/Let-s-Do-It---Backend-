"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const envConfig_1 = require("./config/envConfig");
const database_1 = require("./config/database");
const env = new envConfig_1.EnvConfig();
(0, database_1.connectDatabase)()
    .then(() => app_1.default.listen(env.PORT, () => console.info(`API listening on http://localhost:${env.PORT}`)))
    .catch((error) => {
    console.error("Unable to start API:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
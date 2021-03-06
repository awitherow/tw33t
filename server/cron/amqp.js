import amqp from "amqp-connection-manager";
import herokuConfig from "../config/heroku";

const AMQP_URL = process.env.CLOUDAMQP_URL || process.env.CLOUDAMQP_URL;

if (!AMQP_URL) process.exit(1);

export const spawnConnection = (cb) => {
  var connection = amqp.connect([AMQP_URL]);

  console.log("[AMQP] - Connecting...");

  connection.on("connect", () => {
    process.once("SIGINT", () => connection.close());

    console.log("[AMQP] - Connected!");

    if (Boolean(cb)) cb();
  });

  connection.on("disconnect", (params) =>
    console.error("[AMQP] - Disconnected.", params.err.stack)
  );

  return connection;
};

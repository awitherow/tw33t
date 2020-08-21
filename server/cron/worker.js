import { spawnConnection } from "./amqp";

const AMQP_URL = process.env.CLOUDAMQP_URL || "amqp://localhost";
if (!AMQP_URL) process.exit(1);

const WORKER_QUEUE = "worker-queue";

const connection = spawnConnection();

// ---------- To receive the execution task messages
const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel) =>
    Promise.all([
      channel.assertQueue(WORKER_QUEUE, { autoDelete: false, durable: true }),
      channel.prefetch(1),
      channel.consume(WORKER_QUEUE, onMessage),
    ]),
});

channelWrapper
  .waitForConnect()
  .then(() =>
    console.log("[AMQP] - Listening for messages on queue => " + WORKER_QUEUE)
  )
  .catch((err) => console.error("[AMQP] - Error! ", err));

// Process message from AMQP
const onMessage = (data) => {
  let message;
  try {
    message = JSON.parse(data.content.toString());
  } catch (e) {
    console.error("[AMQP] - Error parsing message... ", data);
  }

  console.log("[AMQP] - Message incoming... ", message);
  channelWrapper.ack(data);
  if (!message) {
    return;
  }

  switch (message.taskName) {
    case "EXAMPLE_TASK_NAME":
      // TODO: EXECUTE EXAMPLE_TASK_NAME script
      break;

    default:
      console.error("No task was found with name => " + message.taskName);
  }
};

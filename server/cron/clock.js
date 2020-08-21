import { CronJob } from "cron";
import { JOBS } from "./jobs/jobs.json";
import { spawnConnection } from "./amqp";

const WORKER_QUEUE = "worker-queue"; // To consume from worker process

const connection = spawnConnection(startCronProcess(JOBS));

const startCronProcess = (jobs) => {
  if (jobs && jobs.length) {
    jobs.forEach(
      (job) =>
        new CronJob({
          // learn formats here: https://crontab.guru/
          cronTime: job.cronTime ? job.cronTime : new Date(job.dateTime),
          onTick: () => {
            sendMessage(job.message);
            if (!job.repeat) j.stop();
          },
          onComplete: () => {
            console.log("Job completed! Removing now...");
          },
          timeZone: "America/Argentina/Buenos_Aires",
          start: true, // Start now
        })
    );
  }
};

const sendMessage = (data) => {
  const message = data;

  if (!message) {
    return;
  }

  const queue = message.queue || WORKER_QUEUE;
  const senderChannelWrapper = connection.createChannel({
    json: true,
    setup: (channel) => channel.assertQueue(queue, { durable: true }),
  });

  senderChannelWrapper
    .sendToQueue(queue, message, {
      contentType: "application/json",
      persistent: true,
    })
    .then(() => {
      console.log("[AMQP] - Message sent to queue =>", queue);
      senderChannelWrapper.close();
    })
    .catch((err) => {
      console.error(
        "[AMQP] - Message to queue => " + queue + "<= was rejected! ",
        err.stack
      );
      senderChannelWrapper.close();
    });
};

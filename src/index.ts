import createConfig from "./config";
import createAsk from "./ask";
import createBot from "./bot";
import createTTS from "./tts";

const ask = createAsk();

const messages = {
  [Symbol.asyncIterator]: () => ({
    next: () =>
      ask().then(
        (value) => ({ value, done: false }),
        () => ({ value: "", done: false }),
      ),
  }),
};

const bot = createBot();

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    bot.logout();
    process.exit(0);
  });
});

(async () => {
  const config = createConfig();

  const { token, subscriptionKey } = config.exist()
    ? config.load()
    : config.create({
      token: await ask("Your Discord Bot Token").catch(() => {
        throw new Error("Nothing provided.");
      }),
      subscriptionKey: await ask("Your Azure Subscription Key").catch(() => {
        throw new Error("Nothing provided.");
      }),
    });

  const tts = createTTS(subscriptionKey);

  bot.login(token);

  for await (const message of messages) {
    if (message) {
      bot.speak(await tts(message));
    }
  }
})().catch((error: Error) => {
  bot.logout();
  console.log(error.message);
  process.exit(1);
});

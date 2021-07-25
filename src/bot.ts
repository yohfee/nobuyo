import { Readable } from "stream";
import { Client } from "discord.js";

export default () => {
  const client = new Client();

  client.on("message", async ({ guild, member, author: { bot } }) => {
    if (guild && member && !bot) {
      await member.voice.channel?.join();
    }
  });

  return {
    login: (token: string) => client.login(token),

    logout: () => {
      client.voice?.connections.forEach((connection) => {
        connection.disconnect();
        connection.channel.leave();
      });
      client.destroy();
    },

    speak: (audio: Readable) => {
      client.voice?.connections.forEach((connection) => {
        const dispatcher = connection.play(audio);
        dispatcher.on("finish", dispatcher.destroy);
      });
    },
  };
};

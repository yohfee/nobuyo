import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  token: string;
  subscriptionKey: string;
};

export default (
  dir = path.join(os.homedir(), ".config"),
  filename = "nobuyo.json",
) => {
  const file = path.join(dir, filename);

  return {
    exist: () => fs.existsSync(file),

    load(): Config {
      if (!this.exist()) {
        throw new Error("Config is not present!");
      }
      return JSON.parse(fs.readFileSync(file).toString()) as Config;
    },

    create(config: Config): Config {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(file, Buffer.from(JSON.stringify(config, null, 2)));
      return config;
    },
  };
};

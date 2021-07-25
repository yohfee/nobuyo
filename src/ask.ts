import readline from "readline";

export const ask = (
  query: string,
  input: NodeJS.ReadableStream,
  output: NodeJS.WritableStream,
) => {
  const rl = readline.createInterface({ input, output });

  return new Promise<string>((resolve, reject) => {
    rl.question(query, (message) => {
      rl.close();
      message ? resolve(message) : reject();
    });
  });
};

export default (
  prompt = "> ",
  input = process.stdin,
  output = process.stdout,
): (query?: string) => Promise<string> =>
  (query = "") => ask(`${query}${prompt}`, input, output);

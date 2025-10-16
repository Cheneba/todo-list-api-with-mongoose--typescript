import { createServer } from "./server";
import env from "./config";

const server = createServer();

server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

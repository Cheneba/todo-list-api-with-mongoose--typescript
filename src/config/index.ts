import dotenv from "dotenv";
dotenv.config({ quiet: true });

const env = {
  invironment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_db_connection: process.env.DB_CONNECTION_STRING,
};

export default env;

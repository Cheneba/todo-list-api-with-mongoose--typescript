import dotenv from "dotenv";
dotenv.config({ quiet: true });

const env = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_db_connection: process.env.DB_CONNECTION_STRING,
  jwt_key: process.env.JWT_SECRETE_KEY,
};

export default env;

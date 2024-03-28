import { config } from "dotenv";
config()

const {API_ID, API_HASH,DB_URL} = process.env
export const apiCred = {apiId:Number(API_ID),apiHash:API_HASH}
export const CONNECTION_RETRIES = 5
export const dbUri = DB_URL
const { default: axios } = require("axios");
export const BACKEND_URL = "http://localhost:8080";

export const clientServer = axios.create({
  baseURL: BACKEND_URL,  // backend url
 
});
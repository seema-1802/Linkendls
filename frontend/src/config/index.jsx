const { default: axios } = require("axios");
export const BACKEND_URL = "https://linkendls-2.onrender.com";

export const clientServer = axios.create({
  baseURL: BACKEND_URL,  // backend url
 
});
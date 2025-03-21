import axios from 'axios';
const API_URL = 'http://localhost:8000/pro/';

export const getdelivery = async (delivery) => {
  const url = `${API_URL}delivery`;
  return axios.get(url,delivery);
}
export const createdelivery = async (delivery) => {
  const url = `${API_URL}delivery`;
  return axios.post(url, delivery);
}

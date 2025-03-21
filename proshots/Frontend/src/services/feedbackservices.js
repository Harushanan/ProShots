import axios from 'axios';
const API_URL = 'http://localhost:8000/pro/';

export const getFeedbacks = async (feedback) => {
  const url = `${API_URL}feedback`;
  return axios.get(url,feedback);
}
export const createFeedback = async (feedback) => {
  const url = `${API_URL}feedback`;
  return axios.post(url, feedback);
}

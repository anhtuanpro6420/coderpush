import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use(async (request) => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    request.headers!.userId = userId as string;
  }
  return request;
});

export default instance;

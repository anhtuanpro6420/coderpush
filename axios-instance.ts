import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://dummyapi.io/data/v1',
    headers: {'app-id': '61ea23bc527fe66636e4224a'}
});

export default instance;

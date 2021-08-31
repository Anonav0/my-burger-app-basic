import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-my-burger-8d2e4-default-rtdb.firebaseio.com/'
});

export default instance;
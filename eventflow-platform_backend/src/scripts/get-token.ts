import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getToken = async () => {
    try {
        const response = await axios.post('http://localhost:5050/api/auth/login', {
            email: 'admin@mail.com',
            password: 'password123'
        });
        console.log('Token:', response.data.token);
    } catch (error: any) {
        console.error('Login failed:', error.response?.status, error.response?.data);
    }
};

getToken();

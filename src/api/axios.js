import axios from 'axios';
// now we make the api seen across the complete project
const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})
export default API;
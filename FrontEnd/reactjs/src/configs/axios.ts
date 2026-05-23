import axios from 'axios' ;


const api = axios.create({
    basseURL : import.meta.env.VITE_BASEURL || 'http://localhost:3000 '
})

export default api;
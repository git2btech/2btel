import { AppError } from '@utils/AppError';
import axios from 'axios';

const api = axios.create({
    baseURL: "https://portal.2btech.com.br/tmt/api/v1/"
})

// api.interceptors.response.use(response => response, error => {
//     if(error.response && error.response.data){
//         return Promise.reject(new AppError(error.response.data[0].message));
//     } else {
//         return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde'));
//     }
// });

//export { api };
export default api;
import axios from 'axios';

// Делаем запрос на сервер     // Making a request to the server
export const requestHTTP = async (inputText, PAGE_COUNTER) => {
    const BASE_URL = `https://pixabay.com/api/?key=31454499-ec52e8bd9c7e30e7100714677&`;
    const OPTION = `q=${inputText}&image_type=photo&page=${PAGE_COUNTER}&per_page=40`
    try {
        const response = await axios.get(`${BASE_URL}${OPTION}`);
        return response;
    } catch (error) {
        return console.log(error);
    }
};

import axios from 'axios';
import convertCountry from '../convertCountry'; 

export const fetchMovie = async (id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movies/${id}`);
        const movieData = response.data;

        // origin_country가 문자열로 오면 배열로 변환
        if (movieData.origin_country) {
            let originCountries;
            try {
                if (typeof movieData.origin_country === 'string') {
                    // 문자열일 경우 배열로 변환
                    originCountries = JSON.parse(movieData.origin_country.replace(/'/g, '"'));
                } else if (Array.isArray(movieData.origin_country)) {
                    originCountries = movieData.origin_country;
                } else {
                    originCountries = [];
                }
            } catch (e) {
                console.error('Error parsing origin_country:', e);
                originCountries = [];
            }
            
            // 국가 코드 매핑
            movieData.origin_country = originCountries.map(convertCountry);
        }
        return movieData;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error; // 에러 발생 시 호출한 곳에서 처리 가능하도록 에러 던짐
    }
};

// 배우 정보 API 호출
export const fetchActors = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/actors/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching actors:', error);
        throw error;
    }
};

// 영화 배우 정보 API 호출
export const fetchMovieActors = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movieactors/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie actors:', error);
        throw error;
    }
};
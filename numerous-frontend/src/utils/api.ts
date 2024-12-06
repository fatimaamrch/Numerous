import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const createGame = async () => {
    try {
        const response = await axios.post(`${API_URL}/game`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la partie:', error);
        throw error;
    }
};

export const joinGame = async (id: string) => {
    return axios.get(`${API_URL}/game/${id}`);
};

export const sendGuess = async (id: string, guess: string) => {
    return axios.post(`${API_URL}/game/${id}/guess`, { guess });
};

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, List, message } from 'antd';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Game: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [guess, setGuess] = useState<string>('');
    const [proximity, setProximity] = useState<string>('');
    const [leaderboard, setLeaderboard] = useState<string[]>([]);

    useEffect(() => {
        socket.emit('joinGame', id);

        socket.on('newGuess', (data: string) => {
            setLeaderboard((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const sendGuess = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/game/${id}/guess`, {
                playerName: 'Player1',
                guess,
            });
            setProximity(`Proximité : ${response.data.proximity}`);
            socket.emit('sendGuess', { gameId: id, guess });
        } catch (error) {
            message.error('Erreur lors de l’envoi de la réponse.');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Jeu Numerous</h1>
            <Input
                placeholder="Votre réponse"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
            />
            <Button type="primary" onClick={sendGuess}>
                Envoyer
            </Button>
            <p>{proximity}</p>
            <h2>Leaderboard</h2>
            <List
                bordered
                dataSource={leaderboard}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </div>
    );
};

export default Game;

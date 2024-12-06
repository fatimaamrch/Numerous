import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        navigate('/game/new');
    };

    const handleJoinGame = () => {
        navigate('/game/join');
    };

    return (
        <Box p={8} maxW="600px" mx="auto">
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="xl" textAlign="center">
                    Bienvenue sur Numerous
                </Heading>
                <Text fontSize="lg" textAlign="center">
                    Numerous est un jeu multijoueurs où le but est de trouver un nombre mystère élevé.
                    Créez une nouvelle partie ou rejoignez une partie existante pour commencer à jouer.
                </Text>
                <Button colorScheme="teal" size="lg" onClick={handleCreateGame}>
                    Créer une nouvelle partie
                </Button>
                <Button variant="outline" size="lg" onClick={handleJoinGame}>
                    Rejoindre une partie existante
                </Button>
            </VStack>
        </Box>
    );
};

export default Home;

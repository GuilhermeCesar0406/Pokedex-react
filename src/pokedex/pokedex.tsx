import React, { useEffect, useState } from 'react';
import { listPokemons, PokemonListInterface } from '../pokemon/ListPokemons';
import { getPokemonDetails } from '../pokemon/services/getPokemonDetails';
import { PokemonDetail } from '../pokemon/Interfaces/PokemonDetail';
import {
    AppBar, Box, Button, Card, CardActions, CardContent, CardMedia,
    Container, Grid, IconButton, Toolbar, Typography, Modal
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
    },
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    color: 'white',
    textAlign: 'center',
});

const StyledButton = styled(Button)({
    backgroundColor: '#FFD700',
    color: '#333',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#FFA500',
    },
});

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'white',
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    textAlign: 'center',
    background: 'linear-gradient(to right, #FF6A00, #FF3A00)',
    color: 'white',
};

export const Pokedex: React.FC = () => {
    const [pokemons, setPokemons] = useState<PokemonListInterface[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListInterface | undefined>(undefined);
    const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetail | undefined>(undefined);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        listPokemons().then((response) => setPokemons(response.results));
    }, []);

    useEffect(() => {
        if (!selectedPokemon) return;
        getPokemonDetails(selectedPokemon.name).then((response) => {
            setSelectedPokemonDetails(response);
            setOpen(true);
        });
    }, [selectedPokemon]);

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(circle, #ffcc00, #ff4500)', padding: '20px' }}>
            <ButtonAppBar />

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {pokemons.map((pokemon: PokemonListInterface) => {
                        const pokemonId = pokemon.url.split("/")[6];
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

                        return (
                            <Grid item xs={6} sm={4} md={3} key={pokemon.name}>
                                <StyledCard>
                                    <CardMedia component="img" height="200" image={imageUrl} alt={pokemon.name} />
                                    <CardContent>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{pokemon.name}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <StyledButton size="small" onClick={() => setSelectedPokemon(pokemon)}>Ver detalhes</StyledButton>
                                    </CardActions>
                                </StyledCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    {selectedPokemonDetails && (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {selectedPokemonDetails.name}
                            </Typography>
                            <Card sx={{ display: 'flex', mt: 2, justifyContent: 'center', alignItems: 'center', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '10px' }}>
                                <CardMedia component="img" sx={{ width: 200 }} image={selectedPokemonDetails.sprites?.front_default} alt={selectedPokemonDetails.name} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                                    <Typography variant="h6">Tipo: {selectedPokemonDetails.types.map((type) => type.type.name).join(', ')}</Typography>
                                    <Typography variant="h6">Habilidades: {selectedPokemonDetails.abilities.map((ability) => ability.ability.name).join(', ')}</Typography>
                                </Box>
                            </Card>
                            <Button onClick={() => setOpen(false)} sx={{ mt: 2, backgroundColor: '#FF4500', color: '#fff', '&:hover': { backgroundColor: '#FF0000' } }}>Fechar</Button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

const ButtonAppBar: React.FC = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#FF4500' }}>
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Pokédex</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Pokedex;

import React, { useEffect, useState } from 'react';
import { listPokemons } from '../pokemon/ListPokemons'; // Importa a função para pegar pokémons paginados
import { getPokemonDetails } from '../pokemon/services/getPokemonDetails';
import { PokemonDetail } from '../pokemon/Interfaces/PokemonDetail';
import {
    AppBar, Box, Button, Card, CardActions, CardContent, CardMedia,
    Container, Grid, Typography, Modal, TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

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
    width: '90%',
    maxWidth: '600px',
    bgcolor: '#FFF',
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    textAlign: 'center',
    color: '#000',
    outline: '3px solid black',
};

export const Pokedex: React.FC = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);  // Ajuste o tipo conforme necessário
    const [allPokemons, setAllPokemons] = useState<any[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<any | undefined>(undefined);
    const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetail | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPokemons = async () => {
            let all: any[] = [];  // Lista para armazenar os pokémons únicos
            let offset = 0;
            const limit = 200;
            const seenPokemons = new Set<string>();  // Para garantir que pegaremos pokémons únicos

            // Carregamento dos Pokémons
            while (all.length < limit) {
                try {
                    // Agora chamamos listPokemons com offset e limit
                    const response = await listPokemons(offset, 20);  // Passando os parâmetros
                    const newPokemons = response.results.filter((pokemon: any) => {
                        if (!seenPokemons.has(pokemon.name)) {
                            seenPokemons.add(pokemon.name);  // Adiciona o nome ao conjunto para não duplicar
                            return true;
                        }
                        return false;
                    });

                    all = [...all, ...newPokemons];
                    if (all.length >= limit) break;  // Para o carregamento quando tivermos 200 pokémons
                    offset += 20;  // Aumenta o offset para a próxima página
                } catch (error) {
                    console.error('Erro ao carregar Pokémons:', error);
                    break;
                }
            }

            setAllPokemons(all.slice(0, limit));
            setPokemons(all.slice(0, limit));
            setLoading(false);
        };

        loadPokemons();
    }, []);

    useEffect(() => {
        if (!selectedPokemon) return;
        getPokemonDetails(selectedPokemon.name).then((response) => {
            setSelectedPokemonDetails(response);
            setOpen(true);
        });
    }, [selectedPokemon]);

    useEffect(() => {
        const filteredPokemons = allPokemons.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(search.toLowerCase())
        );
        setPokemons(filteredPokemons);
    }, [search, allPokemons]);

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(circle, #ffcc00, #ff4500)', padding: '20px' }}>
            <AppBar position="static" sx={{ backgroundColor: '#FF4500', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginLeft: '10px' }}>Pokédex</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFF', borderRadius: '5px', padding: '5px', marginRight: '10px' }}>
                    <SearchIcon sx={{ color: '#000', marginRight: '5px' }} />
                    <TextField
                        variant="standard"
                        placeholder="Buscar Pokémon..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        sx={{ input: { color: '#000' } }}
                    />
                </Box>
            </AppBar>

            <Container maxWidth="lg">
                {loading ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>Carregando Pokémons...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {pokemons.map((pokemon: any) => {
                            const pokemonId = pokemon.url.split("/")[6];
                            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

                            return (
                                <Grid item xs={12} sm={6} md={3} key={pokemon.name}>
                                    <StyledCard>
                                        <CardMedia component="img" image={imageUrl} alt={pokemon.name} />
                                        <CardContent>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{capitalizeFirstLetter(pokemon.name)}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <StyledButton size="small" onClick={() => setSelectedPokemon(pokemon)}>Ver detalhes</StyledButton>
                                        </CardActions>
                                    </StyledCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    {selectedPokemonDetails && (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{capitalizeFirstLetter(selectedPokemonDetails.name)}</Typography>
                            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                <CardMedia component="img" image={selectedPokemonDetails.sprites?.front_default} alt={selectedPokemonDetails.name} sx={{ width: 200, height: 200 }} />
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="h6">Tipo: {selectedPokemonDetails.types.map(type => type.type.name).join(', ')}</Typography>
                                    <Typography variant="h6">Habilidades: {selectedPokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}</Typography>
                                </Box>
                            </Card>
                            <Button onClick={() => setOpen(false)} sx={{ mt: 2, backgroundColor: '#FF4500', color: '#fff' }}>Fechar</Button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default Pokedex;

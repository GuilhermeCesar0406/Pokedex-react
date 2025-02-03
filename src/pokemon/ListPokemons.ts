// Supondo que a API seja como o padrão da PokeAPI

// Função para buscar pokémons com paginação
export const listPokemons = async (offset: number, limit: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data; // Retorna a lista de pokémons, normalmente estará em "results"
};

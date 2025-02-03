// Supondo que você tenha uma função listPokemons na API que retorna a lista de pokemons com parâmetros
export const listPokemons = async (offset: number, limit: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  return data; // Retorna os dados com a chave "results" contendo os pokémons
};

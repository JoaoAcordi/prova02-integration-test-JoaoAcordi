import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('API de Pokémon', () => {
  const baseUrlPokemon = 'https://pokeapi.co/api/v2/pokemon';

  pactum.request.setDefaultTimeout(30000);

  describe('Buscar Pokémon', () => {
    it('Deve retornar as informações corretas de um Pokémon pelo nome', async () => {
      await pactum
        .spec()
        .get(`${baseUrlPokemon}/pikachu`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'pikachu',
          species: {
            name: 'pikachu'
          },
          types: [
            {
              type: {
                name: 'electric'
              }
            }
          ]
        });
    });

    it('Deve retornar um erro para um Pokémon que não existe', async () => {
      await pactum
        .spec()
        .get(`${baseUrlPokemon}/nonexistentpokemon`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('Not Found');
    });

    it('Deve retornar as informações corretas de um Pokémon pelo ID', async () => {
      await pactum
        .spec()
        .get(`${baseUrlPokemon}/25`) // ID do Pikachu
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 25,
          name: 'pikachu',
          types: [
            {
              type: {
                name: 'electric'
              }
            }
          ]
        });
    });

    it('Deve retornar erro para um ID de Pokémon inválido', async () => {
      await pactum
        .spec()
        .get(`${baseUrlPokemon}/99999`) // ID inválido
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('Not Found');
    });
  });
});

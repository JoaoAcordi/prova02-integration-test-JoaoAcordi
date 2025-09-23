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
        .get(`${baseUrlPokemon}/25`) 
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
        .get(`${baseUrlPokemon}/99999`) 
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('Not Found');
    });
  });

  // Teste para o PATCH
  describe('Atualizar Pokémon (PATCH)', () => {
    it('Deve atualizar o nome de um Pokémon com sucesso', async () => {
      const updatedData = {
        name: 'pikachu-updated'  
      };

      await pactum
        .spec()
        .patch(`${baseUrlPokemon}/25`)  
        .withJson(updatedData)  
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'pikachu-updated',
          id: 25,
          types: [
            {
              type: {
                name: 'electric'
              }
            }
          ]
        });
    });

    it('Deve retornar erro ao tentar atualizar um Pokémon inexistente', async () => {
      const updatedData = {
        name: 'nonexistentpokemon-updated'
      };

      await pactum
        .spec()
        .patch(`${baseUrlPokemon}/99999`)  
        .withJson(updatedData)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('Not Found');
    });
  });
});

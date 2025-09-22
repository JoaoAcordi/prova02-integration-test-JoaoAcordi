import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Testes de API', () => {
  const p = pactum;
  const rep = SimpleReporter;

  // URL base para cada API
  const baseUrlCep = 'https://viacep.com.br/ws';
  const baseUrlClima = 'http://api.openweathermap.org/data/2.5/weather';
  const baseUrlPokemon = 'https://pokeapi.co/api/v2/pokemon';

  // Chave da API de clima
  const apiKey = 'sua-api-key';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  // =========================================
  // Testes da API de CEP
  // =========================================
  describe('API de CEP', () => {
    it('Deve retornar o endereço correto para um CEP válido', async () => {
      await p
        .spec()
        .get(`${baseUrlCep}/01001000/json/`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
        });
    });

    it('Deve retornar erro para um CEP inválido', async () => {
      await p
        .spec()
        .get(`${baseUrlCep}/00000000/json/`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('CEP não encontrado');
    });
  });

  // =========================================
  // Testes da API de Clima
  // =========================================
  describe('API de Clima', () => {
    it('Deve retornar o clima da cidade de São Paulo', async () => {
      await p
        .spec()
        .get(`${baseUrlClima}?q=São Paulo&appid=${apiKey}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'São Paulo',
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
            },
          ],
        })
        .expectBodyContains('temp');
    });

    it('Deve retornar erro para uma cidade inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrlClima}?q=CidadeInexistente&appid=${apiKey}`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('city not found');
    });
  });

  // =========================================
  // Testes da API de Pokémon
  // =========================================
  describe('API de Pokémon', () => {
    it('Deve retornar os dados do Pokémon Pikachu', async () => {
      await p
        .spec()
        .get(`${baseUrlPokemon}/pikachu`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'pikachu',
          abilities: [
            { ability: { name: 'static' } },
            { ability: { name: 'lightning-rod' } },
          ],
        });
    });

    it('Deve retornar erro para um Pokémon inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrlPokemon}/notapokemon`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('not found');
    });
  });
});

import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API de CEP', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://viacep.com.br/ws';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Buscar CEP', () => {
    it('Deve retornar o endereço correto para um CEP válido', async () => {
      await p
        .spec()
        .get(`${baseUrl}/01001000/json/`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP'
        });
    });

    it('Deve retornar erro para um CEP inválido', async () => {
      await p
        .spec()
        .get(`${baseUrl}/00000000/json/`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('CEP não encontrado');
    });
  });
});

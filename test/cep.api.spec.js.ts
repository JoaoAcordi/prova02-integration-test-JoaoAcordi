import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API de CEP - POST', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://viacep.com.br/ws';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Buscar CEP via POST', () => {
    it('Deve retornar o endereço correto para um CEP válido enviado via POST', async () => {
      const requestBody = {
        cep: '01001000'
      };

      await p
        .spec()
        .post(`${baseUrl}/json/`)
        .withJson(requestBody)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP'
        });
    });

    it('Deve retornar erro para um CEP inválido enviado via POST', async () => {
      const requestBody = {
        cep: '00000000'
      };

      await p
        .spec()
        .post(`${baseUrl}/json/`)
        .withJson(requestBody)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('CEP não encontrado');
    });

    it('Deve retornar erro se o formato do CEP enviado for inválido no POST', async () => {
      const requestBody = {
        cep: 'abcd1234'
      };

      await p
        .spec()
        .post(`${baseUrl}/json/`)
        .withJson(requestBody)
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Formato de CEP inválido');
    });
  });
});

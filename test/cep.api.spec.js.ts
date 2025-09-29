import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API de CEP - ViaCEP', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://viacep.com.br/ws';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Consultas de CEP', () => {

    it('Deve retornar informações corretas para um CEP válido', async () => {
      await p.spec()
        .get(`${baseUrl}/01001000/json`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          cep: "01001-000",
          localidade: "São Paulo",
          uf: "SP"
        });
    });

    it('Deve retornar erro para um CEP inválido', async () => {
      await p.spec()
        .get(`${baseUrl}/123/json`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

    it('Deve retornar erro para um CEP inexistente', async () => {
      await p.spec()
        .get(`${baseUrl}/00000000/json`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          erro: "true"
        });
    });

    it('Deve retornar erro ao acessar um endpoint mal formado', async () => {
      await p.spec()
        .get(`${baseUrl}/json/01001000`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

  });

  describe('Validação de métodos não permitidos', () => {

    it('Não deve aceitar PUT em um endpoint de CEP válido', async () => {
      await p.spec()
        .put(`${baseUrl}/01001000/json`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('Não deve aceitar PATCH em um endpoint de CEP válido', async () => {
      await p.spec()
        .patch(`${baseUrl}/01001000/json`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('Não deve aceitar PUT em um CEP inexistente', async () => {
      await p.spec()
        .put(`${baseUrl}/00000000/json`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('Não deve aceitar PATCH em um CEP inexistente', async () => {
      await p.spec()
        .patch(`${baseUrl}/00000000/json`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('Não deve aceitar PUT em endpoint mal formado', async () => {
      await p.spec()
        .put(`${baseUrl}/json/01001000`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

    it('Não deve aceitar PATCH em endpoint mal formado', async () => {
      await p.spec()
        .patch(`${baseUrl}/json/01001000`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

  });
});

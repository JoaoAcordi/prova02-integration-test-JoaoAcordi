const pactum = require('pactum');

describe('API de CEP - ViaCEP', () => {

  const baseUrl = 'https://viacep.com.br/ws';

  it('Deve retornar informações corretas para um CEP válido', async () => {
    await pactum.spec()
      .get(`${baseUrl}/01001000/json`)
      .expectStatus(200)
      .expectJsonLike({
        cep: "01001-000",
        localidade: "São Paulo",
        uf: "SP"
      });
  });

  it('Deve retornar erro para um CEP com formato inválido (menos dígitos)', async () => {
    await pactum.spec()
      .get(`${baseUrl}/123/json`)
      .expectStatus(400);
  });

  it('Deve retornar erro para um CEP inexistente', async () => {
    await pactum.spec()
      .get(`${baseUrl}/00000000/json`)
      .expectStatus(200)
      .expectJsonLike({
        erro: "true" // Corrigido: era boolean true, agora string "true"
      });
  });

  it('Deve retornar erro ao acessar um endpoint mal formado', async () => {
    await pactum.spec()
      .get(`${baseUrl}/json/01001000`) // Ordem errada
      .expectStatus(400); // Corrigido: era 404, agora 400
  });

});

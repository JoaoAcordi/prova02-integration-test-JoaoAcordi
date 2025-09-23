import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('API de Futebol', () => {
  const baseUrlFutebol = 'https://api.football-api.com/2.0'; 
  const apiKeyFutebol = 'YOUR_API_KEY'; 

  pactum.request.setDefaultTimeout(30000);

  describe('Buscar Campeonatos', () => {
    it('Deve retornar informações sobre os campeonatos disponíveis', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions?Authorization=${apiKeyFutebol}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([
          {
            id: 1,
            name: 'Premier League',
            country: 'England',
            type: 'League'
          },
          {
            id: 2,
            name: 'La Liga',
            country: 'Spain',
            type: 'League'
          }
        ]);
    });

    it('Deve retornar erro ao tentar acessar campeonatos com chave de API inválida', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions?Authorization=INVALID_API_KEY`)
        .expectStatus(StatusCodes.FORBIDDEN)
        .expectBodyContains('Forbidden');
    });
  });

  describe('Buscar Equipes de um Campeonato', () => {
    it('Deve retornar informações sobre as equipes de um campeonato', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions/1/teams?Authorization=${apiKeyFutebol}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([
          {
            id: 1,
            name: 'Manchester United',
            country: 'England'
          },
          {
            id: 2,
            name: 'Liverpool',
            country: 'England'
          }
        ]);
    });

    it('Deve retornar erro ao tentar acessar equipes de campeonato com chave de API inválida', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions/1/teams?Authorization=INVALID_API_KEY`)
        .expectStatus(StatusCodes.FORBIDDEN)
        .expectBodyContains('Forbidden');
    });
  });

  describe('Buscar Resultados de Partidas', () => {
    it('Deve retornar os resultados de partidas de um campeonato', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions/1/matches?Authorization=${apiKeyFutebol}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([
          {
            id: 12345,
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            score: {
              homeTeam: 2,
              awayTeam: 1
            }
          }
        ]);
    });

    it('Deve retornar erro ao tentar acessar os resultados de partidas com chave de API inválida', async () => {
      await pactum
        .spec()
        .get(`${baseUrlFutebol}/competitions/1/matches?Authorization=INVALID_API_KEY`)
        .expectStatus(StatusCodes.FORBIDDEN)
        .expectBodyContains('Forbidden');
    });
  });


  describe('Excluir Competição ou Time (DELETE)', () => {
    it('Deve excluir uma competição com sucesso', async () => {
      const competitionId = 1; 
      
      await pactum
        .spec()
        .delete(`${baseUrlFutebol}/competitions/${competitionId}?Authorization=${apiKeyFutebol}`)
        .expectStatus(StatusCodes.NO_CONTENT); 
    });

    it('Deve retornar erro ao tentar excluir uma competição com chave de API inválida', async () => {
      const competitionId = 1; 

      await pactum
        .spec()
        .delete(`${baseUrlFutebol}/competitions/${competitionId}?Authorization=INVALID_API_KEY`)
        .expectStatus(StatusCodes.FORBIDDEN)
        .expectBodyContains('Forbidden');
    });

    it('Deve retornar erro ao tentar excluir uma competição inexistente', async () => {
      const invalidCompetitionId = 9999; 

      await pactum
        .spec()
        .delete(`${baseUrlFutebol}/competitions/${invalidCompetitionId}?Authorization=${apiKeyFutebol}`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('Not Found');
    });
  });
});

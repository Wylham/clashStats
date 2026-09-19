# Nosso MVP inicial

## Player

- Perfil básico
- Battle Log focado em desempenho
- League History

## Clan

- Perfil básico
- Membros
- Busca de clãs
- War Log
- Current War

## Fora do MVP

- Verify Token
- CWL
- Capital Raid Seasons

## Configuração

Além de `DATABASE_URL`, a aplicação aceita:

```env
CLASH_API_BASE_URL=https://api.clashofclans.com/v1/
CLASH_API_TOKEN=seu-token
REDIS_URL=redis://localhost:6379
CLAN_CACHE_TTL=300
```

`GET /clan/:tag` consulta primeiro o Redis usando a chave `clan:{tag}`. Em caso de cache miss, consulta a API do Clash, grava a resposta pelo TTL configurado e retorna os dados. Se o Redis estiver indisponível, a consulta à API continua normalmente sem cache.

O `POST /clan` permanece responsável pelo fluxo existente de persistência via Prisma.

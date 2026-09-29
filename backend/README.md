# Musicfy API

API Hono do Musicfy App, versão 1.0.0.

## Desenvolvimento local

1. Copie `.env.example` para `.env`.
2. Preencha as credenciais do MySQL.
3. Execute:

```sh
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3050/api`.

## Deploy no Netlify

Crie um projeto Netlify usando a pasta `backend` como diretório-base. O arquivo
`netlify.toml` configura o build e a função `netlify/functions/api.js`.

Cadastre estas variáveis no painel do Netlify:

```text
ENVIRONMENT=production
CORS_ORIGIN=https://DOMINIO-DO-FRONTEND.netlify.app
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_CONNECTION_LIMIT=2
DB_CONNECT_TIMEOUT=10000
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

Use `DB_SSL=false` somente quando o provedor do banco não oferecer ou não exigir
TLS. Se o provedor utilizar certificado próprio, siga a documentação dele antes
de alterar `DB_SSL_REJECT_UNAUTHORIZED`.

Depois do deploy, valide:

```text
https://DOMINIO-DA-API.netlify.app/api/status/
```

O frontend deve receber:

```text
VITE_API_BASE=https://DOMINIO-DA-API.netlify.app/api
```

O banco precisa estar hospedado fora do computador local e aceitar conexões da
região escolhida para a Netlify Function.

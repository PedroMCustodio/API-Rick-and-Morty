# Rick and Morty API

API RESTful desenvolvida em Node.js que consome a [Rick and Morty API](https://rickandmortyapi.com/) com sistema de autenticação JWT, favoritos e rate limiting.

## Funcionalidades

### Autenticação
- **Cadastro de usuários** com validação de dados
- **Login** com JWT (JSON Web Token)
- **Perfil do usuário** autenticado

### Sistema de Consultas com Rate Limiting
- **Usuários não autenticados**: 3 consultas por dia
- **Usuários autenticados**: 10 consultas por dia
- Rate limiting global para prevenção de ataques

### Favoritos (apenas usuários autenticados)
- Favoritar até **3 personagens**
- Listar personagens favoritos
- Atualizar personagem favorito
- Remover favorito
- Consultar episódios por personagem favorito
- Consultar episódios únicos de todos os favoritos

### Consumo da Rick and Morty API
- Listar personagens com filtros (nome, status, espécie, gênero)
- Buscar personagem por ID
- Buscar múltiplos personagens
- Listar episódios
- Listar locações
- Sistema de cache para otimização

## Tecnologias Utilizadas

- **Node.js** (v18+)
- **Express.js** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **node-cache** - Cache em memória
- **express-rate-limit** - Rate limiting

## Instalação e Configuração

### Pré-requisitos
- Node.js v18 ou superior
- npm ou yarn

### 1. Clone o repositório

git clone <https://github.com/PedroMCustodio/API-Rick-and-Morty>
cd API-Rick-and-Morty



### 2. Instale as dependências

npm install


### 3. Configure as variáveis de ambiente

cp .env.example .env


Edite o arquivo `.env` com suas configurações:

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# API
PORT=3000
NODE_ENV="development"

# Rick and Morty API
RICK_MORTY_API_BASE_URL="https://rickandmortyapi.com/api"


### 4. Configure o banco de dados

# Gerar o cliente Prisma
npm run db:generate

# Criar/sincronizar o banco de dados
npm run db:push


### 5. Inicie o servidor

#### Desenvolvimento

npm run dev


#### Produção

npm start


O servidor estará rodando em `http://localhost:3000`

## Documentação da API

### Base URL

http://localhost:3000/api


### Health Check

GET /api/health


### Autenticação

#### Cadastro de Usuário

POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}


#### Login

POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "123456"
}


#### Perfil do Usuário

GET /api/auth/profile
Authorization: Bearer <jwt_token>


### Personagens

#### Listar Personagens

GET /api/characters?page=1&name=rick&status=alive&species=human&gender=male


#### Buscar Personagem por ID

GET /api/characters/1


#### Buscar Múltiplos Personagens

GET /api/characters/multiple?ids=1,2,3


### Favoritos (Requer Autenticação)

#### Listar Favoritos

GET /api/favorites
Authorization: Bearer <jwt_token>


#### Adicionar Favorito

POST /api/favorites
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "characterId": 1
}


#### Atualizar Favorito

PUT /api/favorites/{favorite_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "characterId": 2
}


#### Remover Favorito

DELETE /api/favorites/{favorite_id}
Authorization: Bearer <jwt_token>


#### Episódios por Favorito

GET /api/favorites/episodes
Authorization: Bearer <jwt_token>


#### Episódios Únicos de Todos os Favoritos

GET /api/favorites/episodes/unique
Authorization: Bearer <jwt_token>


### Episódios

#### Listar Episódios

GET /api/episodes?page=1&name=pilot&episode=S01E01


#### Buscar Episódio por ID

GET /api/episodes/1


### Locações

#### Listar Locações

GET /api/locations?page=1&name=earth&type=planet&dimension=C-137


## Sistema de Rate Limiting

### Rate Limits por Tipo de Usuário
- **Não autenticados**: 3 consultas de personagens por dia
- **Autenticados**: 10 consultas de personagens por dia

### Rate Limits Globais
- **Geral**: 100 requests por IP a cada 15 minutos
- **Autenticação**: 5 tentativas de login por IP a cada 15 minutos

### Headers de Rate Limit
A API retorna headers informativos sobre o rate limiting:
- `X-RateLimit-Limit`: Limite total
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Used`: Requests utilizados

## 🗄️ Comandos do Banco de Dados


# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com banco
npm run db:push

# Abrir Prisma Studio (interface visual)
npm run db:studio

# Reset do banco de dados
npm run db:reset


## Estrutura do Projeto


src/
├── config/
│   └── database.js          # Configuração do Prisma
├── controllers/
│   ├── authController.js    # Controlador de autenticação
│   ├── charactersController.js
│   ├── favoritesController.js
│   ├── episodesController.js
│   └── locationsController.js
├── middleware/
│   ├── auth.js              # Middleware de autenticação
│   ├── rateLimit.js         # Middleware de rate limiting
│   └── errorHandler.js      # Middleware de tratamento de erros
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── characters.js        # Rotas de personagens
│   ├── favorites.js         # Rotas de favoritos
│   ├── episodes.js          # Rotas de episódios
│   ├── locations.js         # Rotas de locações
│   └── index.js             # Agregador de rotas
├── services/
│   └── rickMortyService.js  # Serviço para consumir API externa
├── utils/
│   └── jwt.js               # Utilitários JWT
├── validators/
│   └── index.js             # Validadores de dados
├── app.js                   # Configuração do Express
└── server.js                # Entrada da aplicação

prisma/
└── schema.prisma            # Schema do banco de dados


## Scripts Disponíveis

npm run dev          # Inicia servidor em modo desenvolvimento
npm start            # Inicia servidor em produção
npm run db:generate  # Gera cliente Prisma
npm run db:push
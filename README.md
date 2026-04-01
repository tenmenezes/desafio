# Desafio técnico Full stack Hubfy.ai

## Descrição 
Aplicação full stack de gerenciamento de tarefas desenvolvida como parte do desafio técnico da Hubfy.ai.

O projeto foi construído com foco inicial na base da aplicação, incluindo configuração do ambiente, modelagem do banco de dados, autenticação de usuários e estruturação inicial da API.

## Tecnologias utilizadas
- Next.js 16+
- React.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL
- Zod
- JWT
- bcryptjs

## Funcionalidades implementadas
- Configuração inicial do projeto com Next.js + TypeScript + Tailwind 
- Integração com banco de dados MySQL via Prisma ORM
- Modelagem das tabelas de usuários e tarefas
- Endpoint de registro de usuários
- Endpoint de login com autenticação JWT
- Hash seguro de senha com bcryptjs
- Validação de dados com Zod
- CRUD completo de tarefas autenticadas
- Proteção completa das rotas de tarefas
- Interface frontend completa (login, registro e dashboard)

## Funcionalidades pendentes
- Testes automatizados
- Expandir a cobertura de testes do frontend
- Extras

## Estrutura completa do projeto
```
├── database
│   └── schema.sql
├── prisma
│   ├── migrations
│   │   ├── 20260331133253_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── route.ts
│   │   │   │   └── register
│   │   │   │       └── route.ts
│   │   │   └── tasks
│   │   │       ├── [id]
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   ├── generated
│   ├── lib
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── get-auth-user.ts
│   │   ├── prisma.ts
│   │   ├── proxy.ts
│   │   └── validations.ts
│   └── types
├── tests
│   ├── api
│   │   ├── auth.test.ts
│   │   └── tasks.test.ts
│   └── components
├── .gitignore
├── API.md
├── LICENSE
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
└── tsconfig.json
```

## Pré-requisitos
- Node.js 18+
- MySQL 8+
- npm / npx 

## Configuração do ambiente
Crie um arquivo `.env` com base no `.env.example`

### Exemplo:
```
DATABASE_URL="mysql://usuario:senha@localhost:3306/desafio"

DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="usuario"
DATABASE_PASSWORD="senha"
DATABASE_NAME="desafio"

JWT_SECRET="sua_chave_secreta"
```

## Instalação
```
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Banco de dados
O banco foi modelado com Prisma para MySQL, com duas entidades principais:
- `Users`
- `Tasks`

## Endpoints implementados

### `POST /api/auth/register`
- Cria um novo usuário com validação de dados e hash da senha.

### `POST /api/auth/login`
- Autentica um usuário e retorna um token JWT.

> Todas as rotas de tarefas exigem autenticação via Bearer token no header `Authorization`.

### `GET /api/tasks`
- Lista todas as tarefas do usuário autenticado.

### `POST /api/tasks`
- Cria uma nova tarefa para o usuário autenticado.

### `PUT /api/tasks/[id]`
- Atualiza uma tarefa específica do usuário autenticado.

### `DELETE /api/tasks/[id]`
- Remove uma tarefa específica do usuário autenticado.

> Documentação completa em [APIs](./API.md)

## Decisões técnicas
- Prisma foi utilizado para acelerar a integração com MySQL e reduzir a complexidade de queries manuais.
- Zod foi utilizado para validação de payloads.
- JWT foi escolhido para autenticação stateless.
- bcryptjs foi utilizado para armazenamento seguro de senhas.
- A interface foi mantida simples e funcional, priorizando a implementação completa dos requisitos obrigatórios dentro do prazo disponível.

## Limitações atuais
- A aplicação ainda não contempla testes automatizados.
- A interface foi construída com foco funcional, priorizando os requisitos obrigatórios do desafio.

## Próximos passos
- Implementar testes de integração
- Expandir a cobertura de testes do frontend
- Extras

# Autor

> Yago Menezes

# APIs da aplicação

## Base URL
```text
http://localhost:3000
```

# Autenticação

## `POST /api/auth/register`

### Descrição
Registra um novo usuário no sistema

### Headers
- `Content-Type: application/json`

### Body:

```json
{
    "name": "Yago",
    "email": "yago@email.com",
    "password": "12345678"
}
```

### Resposta de sucesso - `201`

```json
{
    "message": "Usuário registrado com sucesso",
    "user": {
        "id": 1,
        "name": "Yago",
        "email": "yago@email.com"
    }
}
```

### Resposta de erro - `400`

```json
{
    "error": "Dados inválidos",
}
```

### Resposta de erro - `409`

```json
{
    "error": "Email já está em uso",
}
```

## `POST /api/auth/login`

### Descrição
Autentica um usuário e retorna um token JWT

### Headers
- `Content-Type: application/json`

### Body

```json
{
    "email": "yago@email.com",
    "password": "12345678"
}
```

### Resposta de sucesso - `201`

```json
{
    "token": "jwt_token",
    "user": {
        "id": 1,
        "name": "Yago",
        "email": "yago@email.com"
    }
}
```

### Resposta de erro - `401`

```json
{
    "error": "Email ou senha inválidos",
}
```
# Tarefas
> Todas as tarefas abaixo exigem autenticação via Bearer Token no header `Authorization`

## `GET /api/tasks`

### Descrição
Lista todas as tarefas do usuário autenticado.

### Headers
- `Authorization: Bearer {token}`

### Resposta de sucesso - 201

```json
{
    "tasks": [
        {
            "id": 1,
            "userId": 1,
            "title": "Estudar Spring Boot",
            "description": "Revisar arquitetura Spring",
            "status": "pending",
            "createdAt": "2026-03-31T12:00:00.000Z",
            "updatedAt": "2026-03-31T12:00:00.000Z"
        }
    ]
}
```

### Resposta de erro - 400

```json
{
    "error": "Não autorizado"
}
```

## `POST /api/tasks`

### Descrição
Cria uma nova tarefa para o usuário autenticado.

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

### Body

```json
{
  "title": "Estudar Java",
  "description": "Revisar Estrutura de dados",
  "status": "in_progress"
}
```

### Resposta de sucesso - 201

```json
{
  "task": {
    "id": 1,
    "userId": 1,
    "title": "Estudar Java",
    "description": "Revisar Estrutura de dados",
    "status": "in_progress",
    "createdAt": "2026-03-31T12:00:00.000Z",
    "updatedAt": "2026-03-31T12:00:00.000Z"
}
```

### Resposta de erro - 400

```json
{
    "error": "Dados inválidos"
}
```

### Resposta de erro - 401

```json
{
    "error": "Não autorizado"
}
```

## `PUT /api/tasks/[id]`

### Descrição
Atualiza uma tarefa específica do usuário autenticado.

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

### Parâmetros de rota
- `id` - Identificador da tarefa

### Body

```json
{
  "title": "Estudar React.js",
  "description": "Revisar Hooks",
  "status": "completed"
}
```

### Resposta de sucesso - 200

```json
{
  "task": {
    "id": 1,
    "userId": 1,
    "title": "Estudar React.js",
    "description": "Revisar Hooks",
    "status": "completed",
    "createdAt": "2026-03-31T12:00:00.000Z",
    "updatedAt": "2026-03-31T12:00:00.000Z"
}
```

### Resposta de erro - 400

```json
{
    "error": "ID da tarefa inválido"
}
```

### Resposta de erro - 401

```json
{
    "error": "Não autorizado"
}
```

### Resposta de erro - 404

```json
{
    "error": "Tarefa não encontrada"
}
```

## `DELETE /api/tasks/[id]`

### Descrição
Remove uma tarefa específica do usuário autenticado.

### Headers
- `Authorization: Bearer {token}`

### Parâmetros de rota
- `id` - Identificador da tarefa

### Resposta de sucesso - 200

```json
{
  "message": "Tarefa deletada com sucesso"
}
```

### Resposta de erro - 400

```json
{
    "error": "ID da tarefa inválido"
}
```

### Resposta de erro - 401

```json
{
    "error": "Não autorizado"
}
```

### Resposta de erro - 404

```json
{
    "error": "Tarefa não encontrada"
}
```
# Projetando a estrutura de dados.

- No SQL

- Nós podemos usar ferramentas online para desenhar as tabelas e relacionálas

- No noSQL

- Podemos imaginar mais livremente como será o banco de dados e depois ir alterando

- O que podemos prever sobre o banco do projeto?

- Tables

- Notes

- Users

- JSON da Table Note

- {

- "title": String,

- "body": String,

- "created_at": Date,

- "updated_at": Date

- }

- JSON Da Table Users

- {

- "name": String,

- "email": String,

- "password": String,

- "created_at": Date,

- "updated_at": Date

- } 

E as relações?

Uma nota sempre terá um author("user)

um usuário podera ter muitas notas

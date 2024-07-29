# Documentação Técnica do Projeto

## Introdução
Este documento fornece uma visão detalhada do projeto FIAP Tech Challenge, uma aplicação Node.js que utiliza Express, TypeScript, Swagger e EJS. O objetivo é oferecer uma base sólida para o desenvolvimento e a utilização das APIs, facilitando a manutenção e a expansão do sistema.
________________________________________
Setup Inicial
1.	Pré-requisitos:
- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- PostgreSQL
- Docker (opcional, para execução em contêiner)

2.	Instalação:
Clone o repositório do projeto:
git clone <URL_DO_REPOSITORIO>
cd fiap-tech-challenge-2fase

3. Instale as dependências do projeto:
npm install

4.	Configuração:
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
POSTGRESDB_USER=<seu_usuario>
POSTGRESDB_ROOT_PASSWORD=<sua_senha>
POSTGRESDB_DATABASE=<seu_banco_de_dados>
POSTGRESDB_DOCKER_PORT=<sua_porta>
POSTGRESDB_LOCAL_PORT=<sua_porta>

NODE_LOCAL_PORT=<sua_porta>
NODE_DOCKER_PORT=<sua_porta>

DB_USER=<seu_usuario>
DB_HOST=<seu_host>
DB_DATABASE=<seu_banco_de_dados>
DB_PASSWORD=<sua_senha>
DB_PORT=<sua_porta>

5.	Execução:
Para iniciar a aplicação em modo de desenvolvimento:
npm run start:dev

Para compilar e iniciar a aplicação:
npm run build 
npm start

---
## Arquitetura da Aplicação

A aplicação é estruturada conforme o modelo MVC (Model-View-Controller), separando responsabilidades em diferentes camadas para melhor organização e manutenção do código.
1.	Models:
Localizados na pasta models, os modelos representam as entidades do banco de dados. No exemplo, temos o PostsModel que gerencia operações relacionadas aos posts.

3.	Rotas:
As rotas são definidas na pasta routes e mapeiam os endpoints da API. Por exemplo, posts.js define as rotas para operações de CRUD relacionadas aos posts.

4.	Controllers:
As funções controladoras são responsáveis por lidar com a lógica das requisições e respostas. No exemplo, as funções dentro de posts.js implementam a lógica para listar, buscar, criar, atualizar e deletar posts.

5.	Views:
Utilizamos o EJS como motor de visualização, com templates localizados na pasta views. Isso permite a renderização de páginas dinâmicas no servidor.

6.	Documentação de APIs:
Utilizamos Swagger para documentar nossas APIs, facilitando a compreensão e uso das mesmas. Os arquivos de configuração do Swagger estão localizados na pasta swagger. A documentação pode ser acessada usando a rota "/api-docs".
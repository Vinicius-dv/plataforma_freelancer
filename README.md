# 💼 Freela Jovem

Uma plataforma simples e eficiente para conectar **freelancers** e **contratantes**, com foco em funcionalidades essenciais e segurança.

## 🧠 Sobre o projeto

O **Freela Jovem** permite que usuários se cadastrem como **freelancers** ou **contratantes**, criando uma rede de oportunidades. O sistema é seguro, leve e responsivo — ideal para quem busca um projeto direto ao ponto e com boas práticas no backend.

[🔗 Veja o projeto aqui](https://vinicius-dv.github.io/plataforma_freelancer/principal/home.html)

## 🚀 Tecnologias utilizadas

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript
- **Banco de dados:** MongoDB
- **Autenticação:** JWT, Cookies HttpOnly
- **Segurança:** bcrypt,middlewares customizados
- **Outros:** CORS, validações, organização de rotas

## 🔐 Funcionalidades

- Cadastro e login com autenticação segura
- Perfis para freelancers e contratantes
- Criação e edição de perfis
- Freelancers podem criar posts (vagas/serviços)
- Contratantes podem oferecer propostas (simples)
- Sessão segura com JWT + Cookie HttpOnly
- Middleware de proteção de rotas
- Interface simples, bonita e responsiva


## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- MongoDB (pode ser local ou Atlas)

### Passos

```bash
# Clone o repositório
git clone https://github.com/Vinicius-dv/plataforma_freelancer.git

# Acesse a pasta do backend
cd plataforma_freelancer/Back_end

# Instale as dependências
npm install

# Inicie o servidor
node back_end.js

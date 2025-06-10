const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../Cadastro')))
app.use(express.static(path.join(__dirname, '../Criar_conta')))
app.use(express.static(path.join(__dirname, '../principal')))

app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/plataforma_freelancer', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err))

const cadastro_contratante_Schema = new mongoose.Schema({
    nome:String,
    email:String,
    senha:String,
    role: String
})

const cadastro_contratante = mongoose.model('User_contratante',cadastro_contratante_Schema)

const cadastro_freelancer_Schema = new mongoose.Schema({
    nome:String,
    email:String,
    senha:String,
    role: String
})

const cadastro_freelancer = mongoose.model('User_freelancer',cadastro_freelancer_Schema)

const cadastro_projeto_Schema = new mongoose.Schema({
    nome:String,
    desc_projeto:String
})

const cadastro_projeto = mongoose.model('User_projeto',cadastro_projeto_Schema)


const cadastro_estatistica_Schema = new mongoose.Schema({
    valor: { type: Number, default: 0 }
})

const cadastro_estatistica = mongoose.model('User_estatistica',cadastro_estatistica_Schema)


app.post('/cadastro_contratante', (req, res) => {
    const {role} = req.body
    if (role !== 'contratante') return res.status(400).send('Role inválido!')
    const {nome} = req.body
    const {email} = req.body 
    const {senha} = req.body
    cadastro_contratante.findOne({
        $or: [{ nome }, { email }]
    })
    .then(usuario_existe => {
        if (usuario_existe) {
            return res.status(400).json({
                success: false,
                message: 'Nome ou email já cadastrados!'
            })
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log('Erro ao gerar o salt', err)
                    return res.status(500).json('Erro interno')
                }

                bcrypt.hash(senha, salt, (err, hash) => {
                    if (err) {
                        console.log('Erro ao gerar o hash', err)
                        return res.status(500).json('Erro interno')
                    }

                    const novo_cadastro = new cadastro_contratante({
                        nome,
                        email,
                        senha: hash,
                        role
                    })
                    novo_cadastro.save()
                    .then(() => {
                        console.log('Cadastro realizado com sucesso')
                        return res.status(200).json({
                            success: true,
                            message: 'Cadastro realizado com sucesso!'
                        });
                    })
                    .catch(err => {
                        console.log('Erro ao salvar no banco:', err);
                        return res.status(500).json({ success: false, message: 'Erro ao salvar os dados no banco!' })
                    })
                })
            })
        }
    })
    .catch((err) => {
        res.status(500).json({ message: 'Erro ao verificar dados: ' + err })
    })
})


app.post('/cadastro_freelancer', (req, res) => {
    const {role} = req.body
    if (role !== 'freelancer') return res.status(403).send('Role inválido!')
    const {nome} = req.body
    const {email} = req.body 
    const {senha} = req.body
    cadastro_freelancer.findOne({
        $or: [{ nome }, { email }]
    })
    .then(usuario_existe => {
        if (usuario_existe) {
            return res.status(401).json({
                success: false,
                message: 'Nome ou email já cadastrados!'
            })
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log('Erro ao gerar o salt', err)
                    return res.status(500).json('Erro interno')
                }

                bcrypt.hash(senha, salt, (err, hash) => {
                    if (err) {
                        console.log('Erro ao gerar o hash', err)
                        return res.status(500).json('Erro interno')
                    }

                    const novo_cadastro = new cadastro_freelancer({
                        nome,
                        email,
                        senha: hash,
                        role
                    })
                    novo_cadastro.save()
                    .then(() => {
                        console.log('Cadastro realizado com sucesso')
                        return res.status(200).json({
                            success: true,
                            message: 'Cadastro realizado com sucesso!'
                        });
                    })
                    .catch(err => {
                        console.log('Erro ao salvar no banco:', err)
                        return res.status(500).json({ success: false, message: 'Erro ao salvar os dados no banco!' })
                    })
                })
            })
        }
    })
    .catch((err) => {
        res.status(500).json({ message: 'Erro ao verificar dados: ' + err })
    })
})

app.put('/cadastro_freelancer_upd',(req,res)=>{
    const {valor_textarea} = req.body
    cadastro_freelancer.findOneAndUpdate(
        {},
        { $set: { nome: valor_textarea } },
        { new: true }
    )
    .then(dados=>{
        res.status(200).json(dados)
    })
})

app.get('/valor',(req,res)=>{
    cadastro_estatistica.findOne()
    .then(valor => {
        console.log(valor)
        if (!valor) {
            return res.json({ valor: 0 })
        }
        res.json({ valor: valor.valor })
    })
    .catch(erro => {
        console.error(erro)
        res.status(500).json({ erro: "Erro ao buscar valor" })
    })
})

app.get('/info_perfil',(req,res)=>{
    cadastro_freelancer.findOne()
    .then(dados=>{
        if(!dados){
            return res.status(400).json({message:'Não existe informações salvas',success:false})
        }

        return res.status(200).json({
            success:true,
            dados
        })
    })
})

app.post('/cadastro_estatistica',(req,res)=>{
    const incremento = Number(req.body.incremento)
     cadastro_estatistica.findOne()
     .then(valor=>{
        if (!valor) {
            return cadastro_estatistica.create({ valor: incremento })
        }
        valor.valor += incremento
        return valor.save()
     })
     .then(valor_atualizado=>{
        res.json({valor:valor_atualizado})
     })
     .catch(erro => {
        console.error(erro)
        res.status(500).json({ erro: "Erro ao atualizar estatística" })
    })
})

app.post('/cadastro_projeto',(req,res)=>{
    const { nome, desc_projeto} = req.body
    const novo_projeto = new cadastro_projeto({
        nome,
        desc_projeto
    })
    novo_projeto.save()
    .then(()=>{
        console.log('projeto publicado com sucesso')
        return res.status(200).json({
            success:true,
            message: 'projeto publicado com sucesso'
        })
    })
    .catch(err => {
        console.log('Erro ao salvar no banco:', err)
        return res.status(500).json({ success: false, message: 'Erro ao salvar os dados no banco!'})
    })
})

app.get('/info_projeto',(req,res)=>{
    cadastro_projeto.find()
    .then(projetos=>{
        if(!projetos){
            return res.status(400).json({
                success:false,
                message:'Nenhum projeto existente'
            })
        }
        return res.status(200).json({
            success:true,
            projetos
        })
    })
})

app.delete('/remover_projeto/:id', (req, res) => {
    const { id } = req.params
    cadastro_projeto.findByIdAndDelete(id)
    .then(projeto => {
        if (!projeto) {
            return res.status(400).json({
                success: false,
                message: 'Projeto não encontrado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Projeto removido com sucesso'
        })
    })
    .catch(err => {
        console.error('Erro ao remover projeto:', err)
        return res.status(500).json({
            success: false,
            message: 'Erro ao remover o projeto'
        })
    })
})

app.post('/login_contratante',(req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const {role} = req.body
    if (role !== 'contratante') return res.status(400).send('Role inválido!')

    cadastro_contratante.findOne({email,role})
    .then(usuario=>{
        if(!usuario){  
            return res.status(400).json({
            success: false,
            message: 'Usuário não encontrado!,faça seu cadastro!',
        })
    }

        bcrypt.compare(senha,usuario.senha,(err,ismatch)=>{
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao comparar as senhas!'
            })
            }

            if(!ismatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Senha incorreta!',
            })
            }
            const token = jwt.sign({ role }, 'peixe', { expiresIn: '30d' })
            res.cookie('token', token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 })
            return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido!'
            })
        })
    })
    .catch((err)=>{
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login: ' + err,
        })
    })
})


app.post('/login_freelancer',(req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const {role} = req.body
    if (role !== 'freelancer') return res.status(400).send('Role inválido!')

    cadastro_freelancer.findOne({email,role})
    .then(usuario=>{
        if(!usuario){  
            return res.status(400).json({
            success: false,
            message: 'Usuário não encontrado!,faça seu cadastro!',
        })
    }

        bcrypt.compare(senha,usuario.senha,(err,ismatch)=>{
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao comparar as senhas!'
            })
            }

            if(!ismatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Senha incorreta!',
            })
        }
        const token = jwt.sign({ role }, 'peixe', { expiresIn: '30d' })
        res.cookie('token', token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido!'
        })
        })
    })
    .catch((err)=>{
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login: ' + err,
        })
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/Criar_conta')
})

//Middlewares
const verificar_token = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({ success: false, message: 'Token não fornecido!' })
    }

    jwt.verify(token, 'peixe', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token inválido!' })
        }
        req.user = decoded
        next()
    })
}

function verificar_login_contrato(req,res,next){
    const token = req.cookies.token
    if (!token) {
        return next()
    }
    try {
        const decoded = jwt.verify(token, 'peixe')
        if (decoded.role === 'contratante') {
            return res.sendFile(path.join(__dirname, '../Painel_contrato/painel_contrato.html'))
        } else {
            return res.status(403).send('Acesso negado! Você já está logado como freelancer.')
        }
    } catch (err) {
        return next()
    }
}

function verificar_login_freelancer(req,res,next){
    const token = req.cookies.token
    if (!token) {
        return next()
    }
    try {
        const decoded = jwt.verify(token, 'peixe')
        if (decoded.role === 'freelancer') {
            return res.sendFile(path.join(__dirname, '../Painel_freelancer/painel_freelancer.html'))
        } else {
            return res.status(403).send('Acesso negado! Você já está logado como contratante.')
        }
    } catch (err) {
        return next()
    }
}

//Fim middlewares


//Rotas
app.get('/Login_contrato/login_contrato.html',verificar_login_contrato,(req, res,next) => {
    res.sendFile(path.join(__dirname, '../Login_contrato/login_contrato.html'))
})

app.get('/Pagina_projetos/projetos.html',verificar_token,(req, res,next) => {
    res.sendFile(path.join(__dirname, '../Pagina_projetos/projetos.html'))
})


app.get('/Login_freelancer/login_freelancer.html',verificar_login_freelancer,(req, res) => {
    res.sendFile(path.join(__dirname, '../Login_freelancer/login_freelancer.html'))
})

app.get('/Pagina_perfil/perfil.html',verificar_login_contrato,verificar_login_freelancer,(req, res) => {
    res.sendFile(path.join(__dirname, '../Pagina_perfil/perfil.html'))
})

app.get('/Painel_contrato/painel_contrato.html', verificar_token, (req, res) => {
    res.sendFile(path.join(__dirname, '../Painel_contrato/painel_contrato.html'))
})


app.get('/Painel_freelancer/painel_freelancer.html', verificar_token, (req, res) => {
    res.sendFile(path.join(__dirname, '../Painel_freelancer/painel_freelancer.html'))
})
//Fim rotas

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))

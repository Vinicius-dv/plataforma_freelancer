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
app.use(cors({

}))

/*app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))*/

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


app.post('/login_contratante',(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha
    const {role} = req.body
    if (role !== 'contratante') return res.status(400).send('Role inválido!')

    cadastro_contratante.findOne({email,nome,role})
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
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha
    const {role} = req.body
    if (role !== 'freelancer') return res.status(400).send('Role inválido!')

    cadastro_freelancer.findOne({email,nome,role})
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

function verificar_acesso(role){
    return (req,res,next)=>{
        const token = req.cookies.token
        if(!token){
            return res.status(401).send('acesso negado')
        }
        const decoded = jwt.verify(token,'peixe')
        req.user = decoded
        if(req.user.role!=role)return res.status(403).send('acesso proibido')
        next()
    }
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



app.get('/Login_contrato/login_contrato.html',verificar_login_contrato,(req, res,next) => {
    res.sendFile(path.join(__dirname, '../Login_contrato/login_contrato.html'))
})


app.get('/Login_freelancer/login_freelancer.html',verificar_login_freelancer,(req, res) => {
    res.sendFile(path.join(__dirname, '../Login_freelancer/login_freelancer.html'))
})


app.get('/Painel_contrato/painel_contrato.html', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../Painel_contrato/painel_contrato.html'))
    next()
}, verificar_acesso('contratante'), (req, res) => {
    console.log('Middleware passou, servindo o arquivo')
})


app.get('/Painel_freelancer/painel_freelancer.html',(req, res, next) => {
    res.sendFile(path.join(__dirname, '../painel_freelancer/painel_freelancer.html'))
    next()
}, verificar_acesso('freelancer'), (req, res) => {
    console.log('Middleware passou, servindo o arquivo')
})


app.listen(3000, () => console.log('Servidor rodando na porta 3000'))

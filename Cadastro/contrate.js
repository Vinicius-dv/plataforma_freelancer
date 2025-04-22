const menuHamburguer = document.getElementById("menu_hamburguer")
const mainMobile = document.getElementById("main_mobile")
const menuItens = document.querySelector(".menu_itens")

menuHamburguer.addEventListener("click", () => {
    mainMobile.classList.toggle("show")
    menuItens.classList.toggle("open")
})

mainMobile.addEventListener('click',(e)=>{
    if(e.target ===mainMobile){
        mainMobile.classList.remove('show')
        menuItens.classList.remove("open")
    }
})   
const button_cadastro = document.getElementById('button_cadastro')
button_cadastro.addEventListener('click',()=>{
console.log('Clique detectado')
const nome = document.getElementById('nome').value
const email = document.getElementById('email').value
const senha = document.getElementById('senha').value
const mensagem = document.getElementById('mensagem')
if(nome ===''||email ===''||senha ===''){
    mensagem.innerHTML = 'Complete o formulario'
    mensagem.style.color = 'red'
    return
}
fetch('http://localhost:3000/cadastro_contratante',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',  
    },
    body:JSON.stringify({nome,email,senha,role:'contratante'})
})
.then(res=>res.json())
.then((dados)=>{
    if(dados.success){
        mensagem.innerText = dados.message
        mensagem.style.color = 'green'
        window.location.href = '../Login_contrato/login_contrato.html'
    }else{
        mensagem.innerText = dados.message
        mensagem.style.color = 'red'
    }
})
.catch(error => {
    console.error('Erro de rede:', error)
    alert('Erro ao fazer a requisição!')
})
})

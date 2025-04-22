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
button_cadastro.addEventListener('click',(e)=>{
    const contrato = document.getElementById('contrato').checked
    const freelancer = document.getElementById('freela').checked
    if(contrato){
        window.location.href = 'contrate.html'
    }else if(freelancer){
        window.location.href = 'freelancer.html'
    }
})
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
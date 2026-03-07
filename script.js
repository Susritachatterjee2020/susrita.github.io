// MOBILE NAV

const toggle = document.querySelector(".menu-toggle")
const nav = document.querySelector(".nav-links")

toggle.addEventListener("click",()=>{

nav.classList.toggle("active")

})



// SMOOTH SCROLL

document.querySelectorAll(".nav-links a").forEach(link=>{

link.addEventListener("click",function(e){

e.preventDefault()

const target=document.querySelector(this.getAttribute("href"))

target.scrollIntoView({
behavior:"smooth"
})

})

})



// EXPERIENCE DROPDOWN

const expButtons=document.querySelectorAll(".exp-btn")

expButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

const content=btn.nextElementSibling

content.classList.toggle("show")

})

})

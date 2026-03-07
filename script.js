AOS.init({
duration:1000,
once:true
});

particlesJS("particles-js",{
particles:{
number:{value:40},
size:{value:3},
move:{speed:1},
line_linked:{enable:true}
}
});


const toggle=document.querySelector(".menu-toggle")
const nav=document.querySelector(".nav-links")

toggle.addEventListener("click",()=>{
nav.classList.toggle("active")
})

document.querySelectorAll(".nav-links a").forEach(link=>{
link.addEventListener("click",function(e){
e.preventDefault()
const target=document.querySelector(this.getAttribute("href"))
target.scrollIntoView({behavior:"smooth"})
})
})

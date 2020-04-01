const selectElement=function(element){
return document.querySelector(element);
};
let menuToggler = selectElement('.menu-toggle');
let body = selectElement('body');
menuToggler.addEventListener('click',function() {
    body.classList.toggle('open');
});  

window.sr=ScrollReveal();
sr.reveal(".animate-left",{
    origin:"left",
    duration:1500,//duration is in milliseconds
    distance:'25rem',
    delay:300
});
sr.reveal(".animate-right", {
    origin: "right",
    duration: 1500,//duration is in milliseconds
    distance: '25rem',
    delay: 300
});
var si = 1;
showDivs(si);

function plusDivs(n) {
    showDivs(si += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) { si = 1 }
    if (n < 1) { si = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[si - 1].style.display = "block";
}
var slideIndex = 1;
showDivison(slideIndex);

function plusDivison(n) {
    showDivison(slideIndex += n);
}

function showDivison(n) {
    var i;
    var x = document.getElementsByClassName("ms");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.display = "block";
}
var s = 1;
showDi(s);

function plusDi(n) {
    showDi(s += n);
}

function showDi(n) {
    var i;
    var x = document.getElementsByClassName("m");
    if (n > x.length) { s = 1 }
    if (n < 1) { s = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[s - 1].style.display = "block";
}
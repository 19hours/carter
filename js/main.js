//Swiper slider
var swiper = new Swiper(".bg-slider-thumbs", {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 0,
    freeMode:4,
    watchSlidesProgress:true,
});

var swiper2 = new Swiper(".bg-slider", {
    loop: true,
    spaceBetween: 10,
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});

//Navigation bar effects on scroll

window.addEventListener('scroll',function(){
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});

//redirect

document.getElementById("findCarPark").onclick = function () {
    location.href = "/";
};

document.getElementById("rental").onclick = function () {
    location.href = "/";
};


document.getElementById("lots").onclick = function () {
    location.href = "/";
};
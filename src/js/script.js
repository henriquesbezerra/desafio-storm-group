(function(){
    var $menu__brand = document.querySelector("#menu__brand");
    var $menu__nav = document.querySelector("#menu__nav");   
    $menu__brand.addEventListener("click",function(){
        if($menu__brand.classList.contains('active') && $menu__nav.classList.contains('active')){           
            $menu__brand.classList.remove("active");
            $menu__nav.classList.remove("active");
        }else{          
            $menu__brand.classList.add("active");
            $menu__nav.classList.add("active");
        }        
    });
     
})();

$(document).ready(function(){
   $(".owl-carousel").owlCarousel({
       items: 1,
       loop: true,
       nav: true,
       autoplay: true,
       autoplayHoverPause: true,
       smartSpeed: 200    
   });
});

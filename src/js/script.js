$(document).ready(function(){     
    $("#menu__brand").click(function(){      
       $(this).toggleClass("active");
       $("#menu__nav").toggleClass("active");
    });

    $(".owl-carousel").owlCarousel({
       items: 1,
       loop: true,
       nav: true,
       autoplay: true,
       autoplayHoverPause: true,
       smartSpeed: 200    
   });
});

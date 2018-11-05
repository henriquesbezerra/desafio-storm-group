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

    function btnTweet(){
        var twitterScriptTag = document.createElement('script');
        twitterScriptTag.type = 'text/javascript';
        twitterScriptTag.async = true;
        twitterScriptTag.src = 'https://platform.twitter.com/widgets.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(twitterScriptTag, s);
    }
    function btnFacebook(d,s,id){        
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v3.2&appId=274817086272641&autoLogAppEvents=1';
        fjs.parentNode.insertBefore(js, fjs);            
    }
   
    var source   = document.getElementById("post-template").innerHTML;
    var template = Handlebars.compile(source);
   
    // Busca de um json simples com ajax ajax de 3 postagens             
    $.getJSON('https://api.myjson.com/bins/d8qx2')
    .done(function(response) {        
        var context = response;                
        var html    = template(context[0]); 
        
        $("#post__item").html(html.toString());
        
        
        // Tweet Button Tweeter
        btnTweet(); 
        // Like Button Facebook
        btnFacebook(document, 'script', 'facebook-jssdk');
    });
      
});


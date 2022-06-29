window.LandpageHomeController = function($scope){
    $scope.showModalLangepageContact = function(){
        portal.ui.show({
            icon: 'fas fa-envelope',
            title: 'Trabalhe Conosco',
            url: portal.config.URL_VIEW_LANDPAGE_CONTACT,
            modal: true,
            class: 'landpage-contact-modal'
        });
    }
}
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function() {
    mainNav.classList.toggle("active");
});


$('.nav-links, .navbar-brand').click(function() {
    var sectionTo = $(this).attr('href');
    if(isNullOrEmpty(sectionTo)){return;}
    $('html, body').animate({
        scrollTop: $(sectionTo).offset().top
    }, 500);
});


/* SCRIPT JQUERY PARA TROCAR DE COR NAVBAR */
$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('.navbar').css("background-color", "rgba(255, 255, 255)")
    } else {
        $('.navbar').css("background-color", "rgba(255, 255, 255, 0.863)");
        $('.navbar').css("box-shadow", "0px 4px 25px -10px rgba(69,69,69,1)")
    }
});

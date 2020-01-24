var clickedCount = 0; // click count for navbar to slide up and down accordingly
var prevScrollpos = window.pageYOffset; // window scroll

// when jQuery is ready to be used
$(document).ready(function () {
    // console log jQuery for debug
    console.log('jQuery is ready!');


    $(".navbar-toggler").click(function () {
        // console log when toggle button is pressed
        console.log('Toggle button got pressed.');
        if ($('.navbar-toggler-icon').css("transform") == 'none') {
            $('.navbar-toggler-icon').css("transform", "rotate(90deg)"); // rotate toggle 90 degree angle
        } else {
            $('.navbar-toggler-icon').css("transform", "");
        }
        clickedCount++; // increment for keeping track
    });
})

// navbar slide up and down as scroll accordingly
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        if (clickedCount % 2 == 0)
            document.getElementById("navbar").style.top = "-66px";
        else {
            document.getElementById("navbar").style.top = "-226px";
        }
    }
    prevScrollpos = currentScrollPos;
}

// smooth scrolling when clicked on href links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
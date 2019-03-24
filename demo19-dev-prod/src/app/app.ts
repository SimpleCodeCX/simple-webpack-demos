import '../assets/styles/app.scss';
import "../assets/fonts/icomoon.css";
import 'swiper/dist/css/swiper.min.css';
import * as Swiper from 'swiper/dist/js/swiper';

var iframe = document.getElementById("iframe1");
if (iframe['attachEvent']) {
  iframe['attachEvent']("onload", function () {
    new Swiper('.swiper-container', {
      autoplay: {
        delay: 50
      },
      loop: true,
      speed: 50
    });
  });
} else {
  iframe.onload = function () {
    new Swiper('.swiper-container', {
      autoplay: {
        delay: 5000
      },
      loop: true,
      speed: 1500
    });
  };
}





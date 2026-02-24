setTimeout(() => {

  document.querySelector(".overlay").style.background =
    "rgba(0,0,0,0.65)";

  document.querySelector(".logo").style.opacity = "1";
  document.querySelector(".logo").style.transform = "translateY(0)";

  document.querySelector(".title").style.opacity = "1";
  document.querySelector(".title").style.transform = "translateY(0)";

  document.querySelector(".tagline").style.opacity = "1";
  document.querySelector(".tagline").style.transform = "translateY(0)";

}, 5000);

setTimeout(() => {
  const btn = document.querySelector(".cta-btn");
  btn.style.opacity = 1;
  btn.style.transform = "translateY(0)";
}, 7000);


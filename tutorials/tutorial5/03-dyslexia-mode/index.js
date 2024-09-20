/* 
  See Smashing Magazine Tutorial:
  https://www.smashingmagazine.com/2021/11/dyslexia-friendly-mode-website/
*/

const dyslexiaModeToggle = document.querySelector('#dyslexia-toggle');

dyslexiaModeToggle.addEventListener('click', e => {
  e.preventDefault();
  document.body.classList.toggle('dyslexia-mode');
});

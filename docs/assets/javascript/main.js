// from https://codepen.io/KanatSahanov/pen/raGXXa

(function() {
  function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  randomColor();
  ready(openModal);
  ready(closeModal);
}());

function randomColor() {
  var colorList = [
    '#DD0A39',
    '#FD3000',
    '#678F8D',
    '#D86090',
    '#828EEC',
    '#F9A602',
    '#3CB371'
  ];

  var randomColor = colorList[Math.floor(Math.random() * colorList.length)];

  document.documentElement.style.setProperty(`--primary-color`, randomColor);
}

function openModal() {
  var modalTrigger = document.getElementsByClassName('jsModalTrigger');

  for(var i = 0; i < modalTrigger.length; i++) {
    modalTrigger[i].onclick = function() {
      var target = this.getAttribute('href').substr(1);
      var modalWindow = document.getElementById(target);

      modalWindow.classList ? modalWindow.classList.add('open') : modalWindow.className += ' ' + 'open';
    }
  }
}

function closeModal(){
  var closeButton = document.getElementsByClassName('jsModalClose');
  var closeOverlay = document.getElementsByClassName('jsOverlay');

  for(var i = 0; i < closeButton.length; i++) {
    closeButton[i].onclick = function() {
      var modalWindow = this.parentNode.parentNode;

      modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  for(var i = 0; i < closeOverlay.length; i++) {
    closeOverlay[i].onclick = function() {
      var modalWindow = this.parentNode;

      modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
}

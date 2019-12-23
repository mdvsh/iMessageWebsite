
window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var speed = 28;
  var loadingText = '<b>.</b><b>.</b><b>.</b>';
  var indM = 0;

  var getTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 5 && current < 19) return 'Have a great day ahead';
    if (current >= 19 && current < 22) return 'Have a blissfull evening';
    if (current >= 22 || current < 5) return 'Have a good night';
  }

  var messages = [
    'Well, Hello There',
    'My name is Madhav Sharma',
    'And I\'m a sixteen year-old student from New Delhi, India',
    '...who does quizzing and is deeply in 💖 with Machine Learning.',
    'I\'m currently working on the Business Plan of our Conrad Challenge Product: <a target="_blank" href="https://zytabinc.github.io">ZyTab.</a> 🚀',
    'See my Machine Learning work and other endeavours on <a target="_blank" href="https://github.com/pseudocodenerd">GitHub</a> or on <a target="_blank" href="https://www.kaggle.com/sharmadhav">Kaggle</a>',
    'If you\'d like to get in touch, feel free to <a href="mailto:talktosharmadhav@gmail.com">email</a> me.',
    getTime(),
    '🖖 <i>Cheerio!</i>'
  ]

  var sizeText = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var convertSize = function(px) {
    return px / sizeText() + 'rem';
  }

  var getSize = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: convertSize(elements.bubble.offsetWidth + 3),
        h: convertSize(elements.bubble.offsetHeight)
      },
      message: {
        w: convertSize(elements.message.offsetWidth + 3),
        h: convertSize(elements.message.offsetHeight)
      }
    }
  }

  var initialize = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }
  
  var send = function(message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * speed) + 500;
    var elements = initialize(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getSize(elements);
    elements.bubble.style.opacity = 1;
    elements.bubble.style.width = '0rem';
    elements.message.style.width = dimensions.message.w;
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.height = dimensions.message.h;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (indM < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 70);
  }

  var sendMessages = function() {
    var message = messages[indM];
    if (!message) return;
    send(message);
    ++indM;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * speed) + anime.random(800, 1600));
  }

  sendMessages();

}

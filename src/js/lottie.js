import bodymovin from 'lottie-web';

var loading_animation = bodymovin.loadAnimation({
    container: document.getElementById('loading_animation'), // Required
    path: './public/animations/data.json', // Required
    renderer: 'svg', // Fixed: Use a valid renderer ('svg', 'canvas', or 'html')
    loop: false, // Optional
    autoplay: false, // Optional
    name: "Hello World", // Name for future reference. Optional.
  })

  var intro_animation = bodymovin.loadAnimation({
    container: document.getElementById('intro_animation'), // Required
    path: './public/animations/intro.json', // Required
    renderer: 'svg', // Fixed: Use a valid renderer ('svg', 'canvas', or 'html')
    loop: false, // Optional
    autoplay: true, // Optional
    name: "Hello World", // Name for future reference. Optional.
  })

  // var saving_animation = bodymovin.loadAnimation({
  //   container: document.getElementById('save_button'), // Required
  //   path: './public/animations/save_button.json', // Required
  //   renderer: 'svg', // Fixed: Use a valid renderer ('svg', 'canvas', or 'html')
  //   loop: false, // Optional
  //   autoplay: false, // Optional
  //   name: "Hello World", // Name for future reference. Optional.
  // })

  // var playing_animation = bodymovin.loadAnimation({
  //   container: document.getElementById('play_button'), // Required
  //   path: './public/animations/play_button.json', // Required
  //   renderer: 'svg', // Fixed: Use a valid renderer ('svg', 'canvas', or 'html')
  //   loop: false, // Optional
  //   autoplay: false, // Optional
  //   name: "Hello World", // Name for future reference. Optional.
  // })

  // playing_animation.addEventListener('DOMLoaded', function() {

  // playing_animation.goToAndStop(playing_animation.totalFrames,true)
  // });



export{loading_animation,intro_animation};
var frameRate = 45;
var gameLoop  = new Geartech.GameLoop(frameRate);

var player0 = new Geartech.Player('mario');
var player1 = new Geartech.Player('luigi');

//bitwise flag conatiner for multiplayer support
//1:player0Up,2:player0Right,4:player1Up,8:player1Right
var keypressFlags = 0;

var gameDelta = 1.0/frameRate;

var finishLine = 0;

var groundHeight = 0.0;
var bgGround = 0.0;
var bgSky = 0.0;
var GRAVITY = -9.8;



$( document ).ready(function() {
      finishLine = $('#arena').width();
      $( window ).resize(function() {
        finishLine = $('#arena').width();
      });

      var paused = false;
      // Start the gameLoop; it will create an ID when it starts for the first time
      var gameLoopID = gameLoop.start();

      // It's a good idea to stop the game when the user doesn't see it anyway
      $(window).on('blur',  gameLoop.stop);
      $(window).on('focus', gameLoop.start);


      //GAME LOOP
      $('body').on('updateGame',function() {
        //super crappy physics engine
        player0.setForce(player0.getForce()+GRAVITY);
        player1.setForce(player1.getForce()+GRAVITY);

        if(keypressFlags & 1 && !player0.inAir()) {
          player0.setForce(player0.getForce()+100.0);
          player0.setAir(true);
        }
        if(keypressFlags & 4 && !player1.inAir()) {
          player1.setForce(player1.getForce()+100.0);
          player1.setAir(true);
        }

        //apply acceleration
        player0.setAccel(player0.getAccel()+player0.getForce()*gameDelta);
        player1.setAccel(player1.getAccel()+player1.getForce()*gameDelta);

        //apply fake friction
        player0.setAccel(player0.getAccel()*0.9);
        player1.setAccel(player1.getAccel()*0.9);

        //Euler integration
        player0.setPos("Y",player0.getPos("Y")+player0.getAccel()*gameDelta);
        player1.setPos("Y",player1.getPos("Y")+player1.getAccel()*gameDelta);

        //slow backwards decay
        player0.setPos("X",player0.getPos("X")-0.5);
        player1.setPos("X",player1.getPos("X")-0.5);

        if(player0.getPos("Y")<groundHeight) {
          player0.setPos("Y",groundHeight);
          player0.setAir(false);
        }
        if(player1.getPos("Y")<groundHeight) {
          player1.setPos("Y",groundHeight);
          player1.setAir(false);
        }

        if(player0.getPos("X")<0.0)
          player0.setPos("X",0.0);
        if(player1.getPos("X")<0.0)
          player1.setPos("X",0.0);

        if(keypressFlags & 2)
          player0.setPos("X",player0.getPos("X")+3.0);
        if(keypressFlags & 8)
          player1.setPos("X",player1.getPos("X")+3.0);

        //console.log(player0.getPos("Y"));

        if(player0.getPos("X")>=finishLine){
          $('#congrats_text').html("congratufuckinlations "+player0.name());
          $('#congrats').fadeIn("slow");
          gameLoop.stop();
        }
        if(player1.getPos("X")>=finishLine){
          $('#congrats_text').html("congratufuckinlations "+player1.name());
          $('#congrats').fadeIn("slow");
          gameLoop.stop();
        }
      });
      //RENDER LOOP
      $('body').on('updateRender',function() {
        //scroll background parallax
        if((bgSky -= 0.5) < 0.0)
          bgSky = 480.0;
        if((bgGround -= 1.0) < 0.0)
          bgGround = 128.0;
        //update css junk
        $('#arena').css("backgroundPosition", bgSky+"px -10px");
        $('#ground').css("backgroundPosition", bgGround+"px 0");
        $('#player0').css("left",player0.getPos("X"));
        $('#player0').css("bottom",30+player0.getPos("Y"));
        $('#player1').css("left",player1.getPos("X"));
        $('#player1').css("bottom",61+player1.getPos("Y"));
      });

      //KEY PRESS FLAGS
      $(document).on('keyup', function(event) {
        switch( event.keyCode ) {
          case 80:
            //toggle and pause in one line
            if(paused = !paused){
              console.log("start");
              gameLoop.stop();
            }else{
              console.log("stop");
              gameLoop.start();
            }
            break;
          //Player 0
          case 65:
            //console.log( "left" );
            break;
          case 68:
            //console.log( "right" );
            keypressFlags = keypressFlags & ~2;
            break;
          case 87:
            //console.log( "up" );
            //1:player0Up,2:player0Right,4:player1Up,8:player1Right
            keypressFlags = keypressFlags & ~1;
            break;
          case 83:
            //console.log( "down" );
            break;
          //Player 1
          case 37:
            //console.log( "left" );
            break;
          case 39:
            //console.log( "right" );
            keypressFlags = keypressFlags & ~8;
            break;
          case 38:
            //console.log( "up" );
            keypressFlags = keypressFlags & ~4;
            break;
          case 40:
            //console.log( "down" );
            break;
        }
        //console.log("Keys Up: "+keypressFlags);
      });
      $( document ).on('keydown', function( event ) {
          switch( event.keyCode ) {
            //Player 0
            case 65:
              //console.log( "left" );
              break;
            case 68:
              //console.log( "right" );
              keypressFlags = keypressFlags | 2;
              break;
            case 87:
              //console.log( "up" );
              //1:player0Up,2:player0Right,4:player1Up,8:player1Right
              keypressFlags = keypressFlags | 1;
              break;
            case 83:
              //console.log( "down" );
              break;
            //Player 1
            case 37:
              //console.log( "left" );
              break;
            case 39:
              //console.log( "right" );
              keypressFlags = keypressFlags | 8;
              break;
            case 38:
              //console.log( "up" );
              keypressFlags = keypressFlags | 4;
              break;
            case 40:
              //console.log( "down" );
              break;
          }
          //console.log("Keys Down: "+keypressFlags);
        });
});

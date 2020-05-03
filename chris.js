var myGameArea = {
    canvas: document.createElement('canvas'),
    start: function(){
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = this.canvas.getContext('2d');
        this.frameNo = 0;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    intervalFunction: function(){
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
        canvasElement.removeEventListener('click', jumpClickFunction);
        canvasElement.removeEventListener('click', clickImage);
        // backgroundMusic.stop();
        bestScoreFunction();
        deadSound.play();
        if(bestScore){
            if(bestScore <  score){
                localStorage.setItem('colorswitch', JSON.stringify(score));
                bestScore = score;
            }
        } else{
            localStorage.setItem('colorswitch', JSON.stringify(score));
            bestScore = score;
        }
        //to wait for play again
        setTimeout(() => {
            var ctx = this.context;
            ctx.fillStyle = "rgba(1,1,1,0.7)";
            ctx.textAlign = "center";
            var centerWidth = myGameArea.canvas.width/2;
            var centerHeight = myGameArea.canvas.height/2;
            ctx.fillRect(centerWidth - 135, centerHeight-50, 270, 100);
            // ctx.fillRect(200, 250, 250, 1);
            ctx.font = "25px Consolas";
            ctx.fillStyle = "white";
            ctx.textContent = "center";
            ctx.fillText("Your score is " + score, centerWidth, centerHeight-20);
            ctx.fillText("Highest Score: " + bestScore, centerWidth, centerHeight +10); 
            ctx.font = "15px Consolas";
            setTimeout(() => {
                ctx.fillText("click anywhere to play again", centerWidth, centerHeight + 40);
                canvasElement.addEventListener('click', screen);
            },700)
        }, 100);
        
        
    }
}

// var gamestate = 1;
var score = 0;
const mouse = {
    x: myGameArea.canvas.width,
    y: myGameArea.canvas.height
}
var toggle;
// var soundtoggle;
// addEventListener('click', clickImage);

function clickImage(e){
    mouse.x = event.x;
    mouse.y = event.y;
    toggle = pauseandplay.check();
    pauseandplay.update();
    if(toggle){
        canvasElement.removeEventListener('click', jumpClickFunction);
        console.log(toggle);
        console.log(pauseandplay.state);
        if(pauseandplay.state == 0){ //pause
            clearInterval(myGameArea.interval);
            // canvasElement.removeEventListener('click', jumpClickFunction);
        }else{ //play
            setTimeout(function(){
                canvasElement.addEventListener('click', jumpClickFunction);
                myGameArea.intervalFunction();
            }, 300);
            // canvasElement.addEventListener('click', jumpClickFunction);
        }
    }

    // soundtoggle = soundOnAndOff.check();
    // soundOnAndOff.update();
    // if(soundtoggle){
    //     if(soundOnAndOff.state == 0){ //pause
    //         soundVolume(0);
    //     }else{ //play
    //         soundVolume(1);
    //     }
    // }
}

// addEventListener('mousedown', function(e){
//     mouse.x = event.x;
//     mouse.y = event.y;
// })

// addEventListener('mouseup', function(e){
//     mouse.x = myGameArea.canvas.width;
//     mouse.y = myGameArea.canvas.height
// })

function component(x, y){
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.dy = 0;
    this.gravity = 0.05;
    this.count = 0;

    this.update = function(){

        // if(this.y +  this.radius + this.dy> myGameArea.canvas.height - 50){
        //     // this.dy = -this.dy; 
        // } else{
        //     this.dy += this.gravity;
        // }
        this.dy += this.gravity;
        if(gamePieceYOnTap - gamePiece.y > 30){
            this.dy = -this.dy;
        }
        this.y += this.dy;
        this.hitBottom();
        this.draw();
    }

    this.draw = function(){
        var ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "blue";
        ctx.fill();
    }

    this.hitBottom = function(){
        var rockBottom = myGameArea.canvas.height - 100;
        if(this.y>=rockBottom  && (!gamePieceYOnTap)){
            this.y = rockBottom;
            this.dy = 0;
            // this.gravitySpeed = -(this.gravitySpeed * 1);
        }
        if(gamePieceYOnTap && this.y + this.radius + this.dy >= myGameArea.canvas.height){
            this.y = myGameArea.canvas.height - this.radius;
            myGameArea.stop();
        }
        this.draw();
    }

    this.crashWith = function(otherObs){

        var pieceTop = this.y - this.radius;
        var pieceBottom = this.y + this.radius;
        var otherBottoma = otherObs.y + otherObs.radius - otherObs.lineWidth/2;
        var otherBottomb = otherObs.y + otherObs.radius + otherObs.lineWidth/2;
        var otherTopb = otherObs.y - otherObs.radius + otherObs.lineWidth/2;
        var otherTopa = otherObs.y - otherObs.radius - otherObs.lineWidth/2;


        //for the detection when the ball enter 1st time
        if(otherBottomb >= pieceTop && otherObs.count == 0){
            var radians = (otherObs.radians)%(Math.PI*2);
            if(radians > (Math.PI/2) && radians < 3*(Math.PI/2)){
                otherObs.count++;
                if(otherObs.firstTime == 0){
                    otherObs.firstTime++;
                    score++;
                    // console.log(score);
                }
                // console.log("blue");
            }else{
                // console.log("red");
                myGameArea.stop();
            }
            // console.log(otherObs.count);
        }

        //for the detetcion when the ball get out from bottom after enetering
        if(otherObs.count == 1 && pieceBottom > otherBottoma){
            var radians = (otherObs.radians)%(Math.PI*2);
            if(radians > (Math.PI/2) && radians < 3*(Math.PI/2)){
                otherObs.count--;
                // console.log("blue");
            }else{
                // console.log("red");
                myGameArea.stop();
            }
        }

        //for the detetcion when the ball get out from above after enetering
        if(otherObs.count == 1 && pieceTop < otherTopb){
            // console.log("hey");
            var radians = (otherObs.radians)%(Math.PI*2);
            if(radians > (Math.PI/2) && radians < 3*(Math.PI/2)){
                // console.log("red");
                myGameArea.stop();
            }else{
                otherObs.count++;
                // console.log("blue");
            }
        }

        //for the detetcion when the ball get out from above after enetering
        if(otherObs.count == 2 && pieceBottom > otherTopa){
            var radians = (otherObs.radians)%(Math.PI*2);
            if(radians > (Math.PI/2) && radians < 3*(Math.PI/2)){
                // console.log("red");
                myGameArea.stop();
            }else{
                otherObs.count--;
                // console.log("blue");
            }
        }


        // var crash = true;
        // var mytop = this.y - this.radius;
        // var mybottom = this.y + this.radius;
        // var othertopabove = otherObs.y - otherObs.radius - 10;
        // var othertopbelow = otherObs.y - otherObs.radius + 10;
        // var otherbottomabove = otherObs.y + otherObs.radius - 10;
        // var otherbottombelow = otherObs.y + otherObs.radius + 10;
        // if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)){

        //     // var radians = (otherObs.radians)%(Math.PI*2);
        //     // if(radians > (Math.PI/2) && radians < 3*(Math.PI/2)){
        //     //     console.log("blue");
        //     // }else{
        //     //     console.log("red");
        //     // }
        //     myGameArea.stop();
        // }
    }
}

function obstacle(x, y, color, angle1, angle2){
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.dx = 0;
    this.dy = 0;
    this.radius = 90;
    this.radians = 0;
    this.velocity = 0.03;
    this.lineWidth = 20;
    this.count = 0;
    this.firstTime = 0;
    this.update = function(){
        this.radians += this.velocity;
        if(this.y - this.yOnTap > 35){
            this.dy = 0;
        }
        this.y += this.dy;
        this.draw();
    }
    this.draw = function(){
        var ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, angle1 + this.radians, angle2+this.radians);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI + this.radians, Math.PI*2+ this.radians);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        // ctx.beginPath();
        // ctx.rect(100, this.y+this.radius -10, 400, 1);
        // ctx.fill();
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
    //   console.log(this.sound);
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

function rectangle(x, y, color, width, height, type){
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.type = type;

    this.draw = function(){
        ctx = myGameArea.context;
        if(this.type == "score"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(score, this.x, this.y);
        }else{
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function imageButton(src1, src2, x, y, width, height){
    // this.src = src1;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = 1;

    this.image = new Image();
    // this.image.src = src;.
    // console.log(this.src);
    this.draw = function(){
        var ctx = myGameArea.context;
        // ctx.drawImage(this.image.src, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.src, this.x, this.y, this.width, this.height);
    }
    this.update = function(){
        // if(this.state == 1){
        //     if(mouse.x - (this.x + this.width/2) <= this.width && mouse.x - (this.x + this.width/2) >= -this.width && mouse.y - (this.y + this.height/2) <= this.height && mouse.y - (this.y + this.height/2) >= -this.height){
        //         console.log("hello");
        //         this.state = 0;
        //     }
        // }
        if(this.state == 1){
            this.src = src1;
        }else{
            this.src = src2;
        }
        this.draw();
    }
    this.check = function(){
        // if(this.state == 1){
            if(mouse.x - (this.x + this.width/2) <= this.width/2 && mouse.x - (this.x + this.width/2) >= -this.width/2 && mouse.y - (this.y + this.height/2) <= this.height/2 && mouse.y - (this.y + this.height/2) >= -this.height/2){
                // console.log("hello");
                this.state = this.state == 1 ? 0 : 1;
                return true;
            }
            return false;
        // }
    }
}

var canvasElement;
function startScreen(){
    myGameArea.start();
    var ctx = myGameArea.context;
    var grd = ctx.createLinearGradient(0, 0, myGameArea.canvas.width, 0);
    grd.addColorStop(1,"#A1FFCE");
    grd.addColorStop(0,"#FAFFD1");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    var width = 400;
    // ctx.fillRect(centerWidth, 100, width, 1);
    // ctx.fillRect(centerWidth, 300, width, 1);
    var centerWidth = myGameArea.canvas.width/2;
    var centerHeight = myGameArea.canvas.height/2;
    ctx.font = "25px Consolas";
    ctx.fillStyle = "black";
    ctx.textContent = "center";
    ctx.fillText("Instructions:", centerWidth, 130)
    // ctx.fillText("Your score is "+score, 210, 190);
    ctx.font = "15px Consolas";
    ctx.fillText("1. Click to jump", centerWidth, 180);
    ctx.fillText("2. Don't Collide with other colour obstacle", centerWidth, 220);
    ctx.fillText("3. Click here to start the game", centerWidth, 260);
    // gameStart();
    canvasElement = myGameArea.canvas;
    canvasElement.addEventListener('click', screen);
}
startScreen();

// to start the game on click
function screen(){
    init();
    backgroundMusic = new sound("./assets/sounds/background.mp3");
    backgroundMusic.sound.loop = true;
    backgroundMusic.sound.volume = 0.3;
    backgroundMusic.play();
    myGameArea.intervalFunction();
    gamePieceYOnTap = 0;
}

var gamePiece;
var myObstacle = [];
var jumpSound;
var backgroundMusic;
var deadSound;
var myScore;
var pauseandplay;
var soundOnAndOff;
function init(){
    // gamestate = 1;
    canvasElement.removeEventListener('click', screen);
    canvasElement.addEventListener('click', jumpClickFunction);
    canvasElement.addEventListener('click', clickImage);
    // myGameArea.start();
    // myGameArea.intervalFunction();
    myObstacle = [];
    score = 0 ;
    gamePiece = new component(myGameArea.canvas.width/2, myGameArea.canvas.height -100);
    var canvasHeight = myGameArea.canvas.height;
    var gap = 300;
    while(canvasHeight > 200){
    myObstacle.push(new obstacle(myGameArea.canvas.width/2, canvasHeight - gap, "red", 0, Math.PI));
    canvasHeight -= gap;
    }
    myScore = new rectangle(myGameArea.canvas.width/40, myGameArea.canvas.height/15, "white", "40px", "Consolas", "score");
    jumpSound = new sound("./assets/sounds/jump.wav");
    deadSound = new sound("./assets/sounds/dead.wav");
    var img1 = document.getElementById('pause');
    var img2 = document.getElementById('play');
    pauseandplay = new imageButton(img1, img2, myGameArea.canvas.width - myGameArea.canvas.width/15, myGameArea.canvas.height/30, myGameArea.canvas.width/20, myGameArea.canvas.width/20);
    console.log(pauseandplay);
    // var img3 = document.getElementById('soundon');
    // var img4 = document.getElementById('soundof');
    // soundOnAndOff = new imageButton(img3, img4, myGameArea.canvas.width - 2*myGameArea.canvas.width/15, myGameArea.canvas.height/30, myGameArea.canvas.width/20, myGameArea.canvas.width/20);
    // // soundVolume(soundtoggle);
    // if(!soundtoggle){
    //     console.log(soundtoggle);
    //     soundVolume(0);
    // }
    
}
// init();

// var hey = 300;
// var first = 1;
function updateGameArea(){
    // gamePiece.crashWith(myObstacle1);
    myGameArea.clear();
    for(var i=0; i < myObstacle.length; i++){
        gamePiece.crashWith(myObstacle[i]);
    }
    myGameArea.frameNo++;
    // if(everyInterval(100) || myGameArea.frameNo == 1){
    //     hey += -500;
    // myObstacle.push(new obstacle(200, -200, "red", 0, Math.PI));
    //     console.log(myObstacle);
    // }
    // if(myGameArea.frameNo == 1){
    //     myObstacle.push(new obstacle(200, -200, "red", 0, Math.PI));
    // }
    // if(myObstacle[0].y + 120 >= myGameArea.canvas.height - 50 && first == 1){
    //     first++;
    //     myObstacle.push(new obstacle(200, -100, "red", 0, Math.PI));
    //     console.log(myObstacle);
    // }else if(myObstacle[myObstacle.length-1].y + 120 == myGameArea.canvas.height){
    //     myObstacle.push(new obstacle(200, -300, "red", 0, Math.PI));
    //     console.log(myObstacle);
    // }
    if(myObstacle[myObstacle.length-1].y > 200){
        myObstacle.push(new obstacle(myGameArea.canvas.width/2, -100, "red", 0, Math.PI));
        console.log(myObstacle);
    }
    myObstacle.forEach((obstacle)=>{
        obstacle.update();
    })
    // myObstacle.update();
    // myObstacle1.update();
    myScore.draw();
    // soundOnAndOff.update();
    pauseandplay.update();
    gamePiece.update();
}

var bestScore;
function bestScoreFunction(){
    if(localStorage.getItem("colorswitch")){
       bestScore = parseInt(JSON.parse(localStorage.getItem("colorswitch")));
    }
}

var gamePieceYOnTap;
// addEventListener('click', jumpClickFunction);

function jumpClickFunction(){
    console.log('hi');
    jumpSound.play();
    gamePieceYOnTap = gamePiece.y;
    gamePiece.dy = -2;
    myObstacle.forEach((obstacle)=>{
        obstacle.yOnTap = obstacle.y;
        obstacle.dy = 3;
    })

    // myObstacle.y +=7;
    // myObstacle1.y +=7;
    // gamePiece.gravity = -0.05;
}

// function soundVolume(volume){
//     backgroundMusic.sound.volume = volume;
//     jumpSound.sound.volume = volume;
//     deadSound.sound.volume = volume;
// }

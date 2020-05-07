function canvasStart(){

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
        deadSound.play();
        backgroundMusic.stop();
        bestScoreFunction();
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

var score = 0;
const mouse = {
    x: myGameArea.canvas.width,
    y: myGameArea.canvas.height
}
var toggle;
//toggle the pause and play image on click
function clickImage(e){
    mouse.x = event.x;
    mouse.y = event.y;
    toggle = pauseandplay.check();
    pauseandplay.update();
    if(toggle){
        canvasElement.removeEventListener('click', jumpClickFunction);
        if(pauseandplay.state == 0){ //pause
            clearInterval(myGameArea.interval);
            var ctx = myGameArea.context;
            ctx.fillStyle = "rgba(1,1,1,0.7)";
            ctx.fillRect(myGameArea.canvas.width/2 - 150, myGameArea.canvas.height/2-50, 300, 100);
            ctx.font = "40px Consolas";
            ctx.fillStyle = "white";
            ctx.textContent = "center";
            ctx.fillText("Paused", myGameArea.canvas.width/2, myGameArea.canvas.height/2-10);
            ctx.font = "15px Consolas";
            ctx.fillText("Click the icon again to resume", myGameArea.canvas.width/2, myGameArea.canvas.height/2+20);
        }else{ //play
            setTimeout(function(){
                canvasElement.addEventListener('click', jumpClickFunction);
                myGameArea.intervalFunction();
            }, 300);
        }
    }
}

//for the angles at corresponding colors
var color2 = ["#FAE100", "#32DBF0"];
var colorAngle2 = [
    {
        bottom: {
            angle1: Math.PI/2,
            angle2: 3*Math.PI/2,
            angle3: true //0 in between the limits
        },
        top: {
            angle1: Math.PI/2,
            angle2: 3*Math.PI/2
        }
    },{
        bottom: {
            angle1: Math.PI/2,
            angle2: 3*Math.PI/2
        },
        top: {
            angle1: Math.PI/2,
            angle2: 3*Math.PI/2,
            angle3: true
        }
    }
]
var color3 = ["#FAE100", "#32DBF0", "#FF0181"];
var colorAngle3 = [
    {
        bottom: {
            angle1: Math.PI/2,
            angle2: 11*Math.PI/6,
            angle3: true
        },
        top: {
            angle1: 5*Math.PI/6,
            angle2: 3*Math.PI/2
        }
    },{
        bottom: {
            angle1: 7*Math.PI/6,
            angle2: 11*Math.PI/6
        },
        top: {
            angle1: Math.PI/6,
            angle2: 5*Math.PI/6
        }
    },{
        bottom: {
            angle1: Math.PI/2,
            angle2: 7*Math.PI/6
        },
        top: {
            angle1: Math.PI/6,
            angle2: 3*Math.PI/2,
            angle3: true
        }
    }
]
var color4 = ["#FAE100", "#32DBF0", "#FF0181", "#900DFF"];
var colorAngle4 = [
    {
        bottom: {
            angle1: 0,
            angle2: Math.PI/2
        },
        top: {
            angle1: Math.PI,
            angle2: 3*Math.PI/2
        }
    },{
        bottom: {
            angle1: 3*Math.PI/2,
            angle2: 2*Math.PI,
        },
        top: {
            angle1: Math.PI/2,
            angle2: Math.PI
        }
    },{
        bottom: {
            angle1: Math.PI,
            angle2: 3*Math.PI/2
        },
        top: {
            angle1: 0,
            angle2: Math.PI/2
        }
    },{
        bottom: {
            angle1: Math.PI/2,
            angle2: Math.PI
        },
        top: {
            angle1: 3*Math.PI/2,
            angle2: 2*Math.PI
        }
    }
]
//objects
//main gamepiece ball
function component(x, y){
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.dy = 0;
    this.gravity = 0.09;
    this.count = 0;
    this.color = randomColor(color2);

    this.update = function(){
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
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    this.hitBottom = function(){
        var rockBottom = myGameArea.canvas.height - 100;
        if(this.y>=rockBottom  && (score == 0)){
            this.y = rockBottom;
            this.dy = 0;
        }
        if(gamePieceYOnTap && this.y + this.radius + this.dy >= myGameArea.canvas.height){
            this.y = myGameArea.canvas.height - this.radius;
            myGameArea.stop();
        }
    }

    this.crashWith = function(otherObs){
        if(otherObs.type == "ring"){    
            var parts = otherObs.parts;
            if(parts == 4){
                this.ringCrash(color4, colorAngle4, otherObs);
            }else if(parts == 3){
                this.ringCrash(color3, colorAngle3, otherObs);
            }else if(parts == 2){
                this.ringCrash(color2, colorAngle2, otherObs);
            }
        }else if(otherObs.type == "rectangle"){
            var myTop = this.y - this.radius;
            var myBottom = this.y + (this.radius);
            var otherTop = otherObs.y;
            var otherBottom = otherObs.y + (otherObs.angle2);
            if((myBottom < otherTop) || (myTop > otherBottom)){
                // crash = false;
            } else{
                // console.log("hey");
                    if(otherObs.parts == 1){
                    if(otherObs.color == this.color){
                        otherObs.count++;
            
                        if(otherObs.firstTime == 0){
                            otherObs.firstTime++;
                            // score++;
                            score += dScore;
                        }
                    }else{
                        myGameArea.stop();
                    }
                }  
            }
        }else if(otherObs.type == "rotRect"){
            var angle = (otherObs.angle+(Math.PI/4))%(Math.PI/2);
            var angleCheck = (otherObs.angle+(Math.PI/4))%(Math.PI*2);
            var myTop = this.y - this.radius;
            var myBottom = this.y + (this.radius);
            var otherTop = otherObs.y + (100/Math.SQRT2)*Math.tan(angle - (Math.PI/4));
            var otherBottom = otherObs.y + (100/Math.SQRT2)*Math.tan(angle - (Math.PI/4)) + 15;
            if((myBottom < otherTop) || (myTop > otherBottom)){
                // crash = false;
            } else{
                var ballColor = this.color;
                var colorIndex = color4.indexOf(ballColor);
                if(angleCheck >= colorIndex*(Math.PI/2) && angleCheck < (colorIndex+1)*(Math.PI/2)){
                    otherObs.count++;
            
                    if(otherObs.firstTime == 0){
                        otherObs.firstTime++;
                        score += dScore;
                    }
                }else{
                    myGameArea.stop();
                }  
            }
        }
    }

    this.ringCrash = function(color, colorAngle, otherObs){ 
        if(otherObs.type == "ring"){
            var ballColor = this.color; 
            var colorIndex = color.indexOf(ballColor);
            if(colorIndex == -1){
                var bottomAngle1 = -1;
                var bottomAngle2 = -1;
                var topAngle1 = -1;
                var topAngle2 = -1;
                var bottomAngle3 = false;
                var topAngle3 = false;
            }else{
                var bottomAngle1 = colorAngle[colorIndex].bottom.angle1;
                var bottomAngle2 = colorAngle[colorIndex].bottom.angle2;
                var bottomAngle3 = colorAngle[colorIndex].bottom.angle3;
                var topAngle1 = colorAngle[colorIndex].top.angle1;
                var topAngle2 = colorAngle[colorIndex].top.angle2;
                var topAngle3 = colorAngle[colorIndex].top.angle3;
            }

            var pieceTop = this.y - this.radius;
            var pieceBottom = this.y + this.radius;
            var otherBottoma = otherObs.y + otherObs.radius - otherObs.lineWidth/2;
            var otherBottomb = otherObs.y + otherObs.radius + otherObs.lineWidth/2;
            var otherTopb = otherObs.y - otherObs.radius + otherObs.lineWidth/2;
            var otherTopa = otherObs.y - otherObs.radius - otherObs.lineWidth/2;

            //for the detection when the ball enter 1st time
            if(otherObs.count == 0 && otherBottomb >= pieceTop){
                var radians = (otherObs.radians)%(Math.PI*2);
                if(bottomAngle3){
                    if(radians > bottomAngle1 && radians < bottomAngle2){
                        myGameArea.stop();
                    } else{
                        otherObs.count++;
        
                        if(otherObs.firstTime == 0){
                            otherObs.firstTime++;
                            score += dScore;
                        }
                    }
                }else{
                    if(radians > bottomAngle1 && radians < bottomAngle2){
                        otherObs.count++;
        
                        if(otherObs.firstTime == 0){
                            otherObs.firstTime++;
                            score += dScore;
                        }
                    } else{
                        myGameArea.stop();
                    }
                }      
            }

            //for the detetcion when the ball get out from bottom after enetering
            if(otherObs.count == 1 && pieceBottom > otherBottoma){
                var radians = (otherObs.radians)%(Math.PI*2);
                if(bottomAngle3){
                    if(radians > bottomAngle1 && radians < bottomAngle2){   
                        myGameArea.stop();
                    } else{
                        otherObs.count--;
                    }
                }else{
                    if(radians > bottomAngle1 && radians < bottomAngle2){
                        otherObs.count--;
                    } else{
                        myGameArea.stop();
                    }
                }   
            }

            //for the detetcion when the ball get out from above after enetering
            if(otherObs.count == 1 && pieceTop < otherTopb){
                var radians = (otherObs.radians)%(Math.PI*2);
                if(topAngle3){
                    if(radians > topAngle1 && radians < topAngle2){               
                        myGameArea.stop();
                    }else{
                        otherObs.count++;
                    }
                }else{
                    if(radians > topAngle1 && radians < topAngle2){
                        otherObs.count++;
                    }else{               
                        myGameArea.stop();
                    }
                }
            }

            //for the detetcion when the ball get in from above after leaving
            if(otherObs.count == 2 && pieceBottom > otherTopa){
                var radians = (otherObs.radians)%(Math.PI*2);
                if(topAngle3){
                    if(radians > topAngle1 && radians < topAngle2){               
                        myGameArea.stop();
                    }else{
                        otherObs.count--;
                    }
                }else{
                    if(radians > topAngle1 && radians < topAngle2){
                        otherObs.count--;
                    }else{               
                        myGameArea.stop();
                    }
                }  
            }
        }
    }
}

function obstacle(x, y, angle1, angle2, type, parts, number){
    this.x = x;
    this.y = y;
    this.color = randomColor(color2);
    this.angle1 = angle1;  //width for rectangles
    this.angle2 = angle2;  //height for rectangles
    this.type = type;
    this.parts = parts;
    this.number = number>0 ? number : 0;  //number of obstacle
    this.dx = 0;
    this.dy = 0;
    this.radius = 90;
    this.lineWidth = 20;
    this.count = 0;
    this.firstTime = 0;

    this.angle =  -Math.PI/4;  //for four rotRect
    if(this.type == "ring"){
        if(randomIntFromRange(0,1)){
            this.radians = 0;
            this.velocity = 0.03;
        }else{
            this.radians = 2*Math.PI;
            this.velocity = -0.03;
        }
        this.velocity += (this.velocity/3)*parseInt(this.number/5);
    }

    this.update = function(){
        if(this.type == "ring"){
            if(this.radians < 0){
                this.radians = 2*Math.PI;
            }
            this.radians += this.velocity;
        }else if(this.type == "rotRect"){
            this.angle += 1 * Math.PI / 180;
        }
        if(this.y - this.yOnTap > 35){
            this.dy = 0;
        }
        this.y += this.dy;
        this.draw();
    }

    this.draw = function(){
        var ctx = myGameArea.context;
        if(this.type == "ring"){
            if(this.parts == 2){
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, angle1 + this.radians, angle2+this.radians);
                ctx.strokeStyle = color4[0];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
        
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI + this.radians, Math.PI*2+ this.radians);
                ctx.strokeStyle = color4[1];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            } else if(this.parts == 3){
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, angle1 + this.radians, Math.PI*2/3 + this.radians);
                ctx.strokeStyle = color4[0];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
        
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI*2/3 + this.radians, Math.PI*4/3+ this.radians);
                ctx.strokeStyle = color4[1];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
        
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI*4/3 + this.radians, Math.PI*2+ this.radians);
                ctx.strokeStyle = color4[2];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            } else if(this.parts == 4){
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0 + this.radians, Math.PI/2 +this.radians);
                ctx.strokeStyle = color4[0];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
    
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI/2 + this.radians, Math.PI+ this.radians);
                ctx.strokeStyle = color4[1];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
    
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI + this.radians, 3*Math.PI/2 +this.radians);
                ctx.strokeStyle = color4[2];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
    
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2 + this.radians, 2*Math.PI+ this.radians);
                ctx.strokeStyle = color4[3];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            }else{
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, angle1 + this.radians, angle2+this.radians);
                ctx.strokeStyle = color4[0];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
        
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, Math.PI + this.radians, Math.PI*2+ this.radians);
                ctx.strokeStyle = color4[1];
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            }
        } else if (this.type == "rectangle"){
            if(this.parts == 1){
                ctx.beginPath();
                if(everyInterval(100)){
                    this.color = this.color == color2[0] ? color2[1] : color2[0];
                }
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.angle1/2, this.y, this.angle1, angle2);
                ctx.fill();
            }
        }else if(this.type == "rotRect"){
            var ctx = myGameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);        
            ctx.rotate(this.angle);
            ctx.fillStyle = color4[0];
            ctx.fillRect(0, 0, 100, 20);        
            ctx.restore();
            
            ctx.save();
            ctx.translate(this.x, this.y);        
            ctx.rotate(Math.PI/2 + this.angle);
            ctx.fillStyle = color4[3];
            ctx.fillRect(0, 0, 100, 20);        
            ctx.restore();
            
            ctx.save();
            ctx.translate(this.x, this.y);        
            ctx.rotate(Math.PI + this.angle);
            ctx.fillStyle = color4[2];
            ctx.fillRect(0, 0, 100, 20);        
            ctx.restore();

            ctx.save();
            ctx.translate(this.x, this.y);        
            ctx.rotate(3*Math.PI/2 + this.angle);
            ctx.fillStyle = color4[1];
            ctx.fillRect(0, 0, 100, 20);        
            ctx.restore();
        }
    }
}

var backgroundMusic = new sound("./assets/sounds/background.mp3");
var jumpSound = new sound("./assets/sounds/jump.wav");
var deadSound = new sound("./assets/sounds/dead.wav");
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
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
    this.dy = 0;

    this.draw = function(){
        var ctx = myGameArea.context;
        if(this.type == "score"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(score, this.x, this.y);
        } else if(this.type = "bestScore"){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width/2 - 70, this.height);
            ctx.textAlign = "center";
            ctx.font = "25px serif";
            ctx.fillText("High-Score", this.width/2, this.y + 10);
            ctx.fillRect(this.x + this.width/2 + 70, this.y, this.width/2 - 70, this.height);
        } else{
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.update = function(){
        this.radians += this.velocity;
        if(this.y - this.yOnTap > 35){
            this.dy = 0;
        }
        this.y += this.dy;
        this.draw();
    }
}

function colorSwitch(x, y, parts){
    this.x = x;
    this.y = y;
    this.parts = parts;
    this.radius = 5;
    this.dy = 0;

    this.update = function(){
        if(this.y - this.yOnTap > 35){
            this.dy = 0;
        }
        this.y += this.dy;
        this.draw();
    }

    this.draw = function(){
        var ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI/2);
        ctx.strokeStyle = color4[0];
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI/2, Math.PI);
        ctx.strokeStyle = color4[1];
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 3*Math.PI/2);
        ctx.strokeStyle = color4[2];
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI*2);
        ctx.strokeStyle = color4[3];
        ctx.stroke();
    }
    
    this.crashWith = function(otherObj){
        var myTop = this.y - this.radius;
        var myBottom = this.y + (this.radius);
        var otherTop = otherObj.y - otherObj.radius;
        var otherBottom = otherObj.y + (otherObj.radius);
        if((myBottom < otherTop) || (myTop > otherBottom)){
            // crash = false;
        } else{
            if(this.parts == 3){
                gamePiece.color = randomColor(color3);
            } else if (this.parts == 4){
                gamePiece.color = randomColor(color4);
            }else{
                gamePiece.color = randomColor(color2);
            }
            myColorSwitch.shift();
        }
    }
}

function imageButton(src1, src2, x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = 1;

    this.image = new Image();
    this.draw = function(){
        var ctx = myGameArea.context;
        ctx.drawImage(this.src, this.x, this.y, this.width, this.height);
    }
    this.update = function(){
        if(this.state == 1){
            this.src = src1;
        }else{
            this.src = src2;
        }
        this.draw();
    }
    this.check = function(){
            if(mouse.x - (this.x + this.width/2) <= this.width/2 && mouse.x - (this.x + this.width/2) >= -this.width/2 && mouse.y - (this.y + this.height/2) <= this.height/2 && mouse.y - (this.y + this.height/2) >= -this.height/2){
                this.state = this.state == 1 ? 0 : 1;
                return true;
            }
            return false;
    }
}

function powerup(src, x, type){
    this.src = src;
    this.x = x;
    this.y = -100;
    this.width = 50;
    this.height = 50;
    this.type = type;
    this.dy = 0;
    this.image = new Image();

    this.draw = function(){
        var ctx = myGameArea.context;
        ctx.drawImage(this.src, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }

    this.update = function(){
        if(this.y - this.yOnTap > 35){
            this.dy = 0;
        }
        this.y += this.dy;
        this.draw();
    }

    this.crashWith = function(otherObj){
        var myTop = this.y - this.height/2;
        var myBottom = this.y + this.height/2;
        var otherTop = otherObj.y - otherObj.radius;
        var otherBottom = otherObj.y + (otherObj.radius);
        if((myBottom < otherTop) || (myTop > otherBottom)){
            // crash = false;
        } else{
            if(this.type == "plus5"){
                score +=5;
            }else if(this.type == "slowmo"){
                var c = 0;
                myObstacle.forEach((obstacle)=>{
                    obstacle.velocity = obstacle.velocity/3;
                    c++;
                })
                setTimeout(function(){
                    myObstacle.forEach((obstacle,index)=>{
                        if(index<c){
                            obstacle.velocity = obstacle.velocity*3;
                        }
                        
                    })
                }, 5000)
            }else if(this.type == "doubleScore"){
                dScore = 2;
                setTimeout(function(){
                    dScore = 1;
                }, 5000)
            }
            myPowerUps.shift();
        }
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
    var centerWidth = myGameArea.canvas.width/2;
    var centerHeight = myGameArea.canvas.height/2;
    ctx.font = "25px Consolas";
    ctx.fillStyle = "black";
    ctx.textContent = "center";
    ctx.fillText("Instructions:", centerWidth, 130);
    ctx.font = "15px Consolas";
    ctx.fillText("1. Click to jump", centerWidth, 180);
    ctx.fillText("2. Don't Collide with other colour obstacle", centerWidth, 220);
    ctx.fillText("3. Click here to start the game", centerWidth, 260);
    canvasElement = myGameArea.canvas;
    canvasElement.addEventListener('click', screen);
}
startScreen();

// to start the game on click
function screen(){
    init();
    backgroundMusic.sound.loop = true;
    backgroundMusic.sound.volume = 0.3;
    backgroundMusic.play();
    myGameArea.intervalFunction();
    gamePieceYOnTap = 0;
}

//implementation
var gamePiece;
var myObstacle = [];
var myColorSwitch = [];
var myPowerUps = [];
var myScore;
var dScore = 1;
var pauseandplay;
var bestScoreUpdate;
var intialObstacleCount;
//images
var plus5 = document.getElementById("plus5");
var slowmo = document.getElementById("slowmo");
var doubleScore = document.getElementById("doubleScore");
var img1 = document.getElementById('pause'); //pause
var img2 = document.getElementById('play'); //play

function init(){
    canvasElement.removeEventListener('click', screen);
    canvasElement.addEventListener('click', jumpClickFunction);
    canvasElement.addEventListener('click', clickImage);

    //for new game when restart
    intialObstacleCount = 0;
    myObstacle = [];
    myColorSwitch = [];
    myPowerUps = [];
    score = 0;
    gamePiece = new component(myGameArea.canvas.width/2, myGameArea.canvas.height -100);

    var canvasHeight = myGameArea.canvas.height;
    var gap = 300;
    while(canvasHeight > 200){
        var random = randomIntFromRange(0,4);
        if(random < 3){
            myObstacle.push(new obstacle(myGameArea.canvas.width/2, canvasHeight - gap, 0, Math.PI, "ring", random+2));
        }else if(random == 3){
            myObstacle.push(new obstacle(myGameArea.canvas.width/2-100/Math.SQRT2, canvasHeight - gap, 100, 20, "rotRect"));
        }else{
            myObstacle.push(new obstacle(myGameArea.canvas.width/2, canvasHeight - gap, 200, 20, "rectangle", 1));
        }
        canvasHeight -= gap;
        intialObstacleCount++;
    }
    myScore = new rectangle(myGameArea.canvas.width/40, myGameArea.canvas.height/15, "white", "40px", "Consolas", "score");
    pauseandplay = new imageButton(img1, img2, myGameArea.canvas.width - 60, 30, 70, 70);
    bestScoreFunction();
    bestScoreUpdate = 0;
}

//Animation Loop
function updateGameArea(){
    myGameArea.clear();
    for(var i=0; i < myObstacle.length; i++){
        gamePiece.crashWith(myObstacle[i]);
    }
    for(var j=0; j<myColorSwitch.length; j++){
        myColorSwitch[j].crashWith(gamePiece);
    }
    for(var k=0; k<myPowerUps.length; k++){
        myPowerUps[k].crashWith(gamePiece);
    }
    myGameArea.frameNo++;
    if(myObstacle[myObstacle.length-1].y > 200){
        var myObstacleY = -100;
        var random = randomIntFromRange(0,4);
        var powerProb = randomIntFromRange(0,1);
        if(random < 3){
            myObstacle.push(new obstacle(myGameArea.canvas.width/2, myObstacleY , 0, Math.PI, "ring", random+2, myObstacle.length));
            if(powerProb){
                var prob = randomIntFromRange(0,2);
                if(prob == 0){
                    myPowerUps.push(new powerup(plus5, myGameArea.canvas.width/2, "plus5"));
                }else if(prob == 1){
                    myPowerUps.push(new powerup(slowmo, myGameArea.canvas.width/2, "slowmo"));
                }else if(prob == 2){
                    myPowerUps.push(new powerup(doubleScore, myGameArea.canvas.width/2, "doubleScore"));
                }
            }
            myColorSwitch.push(new colorSwitch(myGameArea.canvas.width/2, 50, random+2));
        }else if(random == 3){
            myObstacle.push(new obstacle(myGameArea.canvas.width/2-100/Math.SQRT2, myObstacleY , 100, 20, "rotRect"));
            myColorSwitch.push(new colorSwitch(myGameArea.canvas.width/2, 50, 4));
        }else{
            myObstacle.push(new obstacle(myGameArea.canvas.width/2, myObstacleY , 200, 20, "rectangle", 1));
            myColorSwitch.push(new colorSwitch(myGameArea.canvas.width/2, 50, 2));
        }
    }
    if(score+1 > bestScore && !(bestScoreUpdate)){
        if(score - bestScore > 2){
            var height = gamePiece.y - 150;
        }else{
            var height = gamePiece.y - 250;
        }
        bestScoreUpdate = new rectangle(0, height, "#FF0000", myGameArea.canvas.width, 2, "bestscore");
    }
    if(bestScoreUpdate){
        bestScoreUpdate.update();
    }
    myColorSwitch.forEach((particle)=>{
        particle.update();
    })
    myObstacle.forEach((obstacle)=>{
        obstacle.update();
    })
    myPowerUps.forEach((powerup)=>{
        powerup.update();
    })
    myScore.draw();
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
function jumpClickFunction(){
    jumpSound.play();
    gamePieceYOnTap = gamePiece.y;
    gamePiece.dy = -2;
    posUpOnJump(myObstacle);
    posUpOnJump(myColorSwitch);
    posUpOnJump(myPowerUps);

    if(bestScoreUpdate){
        bestScoreUpdate.yOnTap = bestScoreUpdate.y;
        bestScoreUpdate.dy = 3;
    }
}
function posUpOnJump(objects){
    objects.forEach((object)=>{
        object.yOnTap = object.y;
        object.dy = 3;
    })
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function everyInterval(n){
    if((myGameArea.frameNo / n)%1 == 0){
        return true;
    }
    return false;
}}


//to start the game on click
function play(){
    var section = document.querySelector('section');
    section.style.display = "none";
    canvasStart();
}
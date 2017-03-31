var myGamePiece;
var myObstacles = [];
var myScore;
var g_gameState = 1; // 1:Start and 0:game over
// To set level in game.
var gameLevel = {   name:       new Number(),
                    score:      new Number(),
                    speed:      new Number(),
                    narrowW:    new Number(),
                    narrowH:    new Number(),
                    background: new String(),
                    wattle:     new String(),

};

function startGame() {
    // Create bird, background, gravity and score
    myGamePiece = new component(70, 70, "../img/game/flappy_bird_jump.gif", 10, 120, "image");
    myBackground = new component(700, 500, "../img/game/desert-level.jpg", 0, 0, "image");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.startup();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    startup : function() {
        this.canvas.width = 700;
        this.canvas.height = 300;
        this.canvas.opacity = 0.3;
        this.canvas.style.marginLeft = "auto";
        this.canvas.style.marginRight = "auto";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[6]);
        this.frameNo = 0;
        g_gameState = 1;
        setGameArea();
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    pause : function() {
        clearInterval(this.interval);
    },
    continue: function() {
        this.interval = setInterval(updateGameArea, 20);
    },
    restart : function() {
        this.frameNo = 0;
        myObstacles = [];
        g_gameState = 1;
    },
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;    
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
       this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();        
    }
    // When bird fly into bottom
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    // When bird crashes to wattle.
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function setGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(20, height, "green", x, 0));
        myObstacles.push(new component(20, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            g_gameState = 0; // Die
            document.getElementById("btnPlay").textContent = "RESTART";
            return;
        }
    }
    myGameArea.frameNo += 1;
    setGameArea();
    return;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

// Fly
function move(n) {
    myGamePiece.image.src = "../img/game/flappy_bird_jump.gif";
    myGamePiece.gravity = n;
}

function drop() {
    myGamePiece.image.src = "../img/game/flappy_bird_boom.gif"
}

// button
var i = 0;
function gameBtnPlay() {
    if (g_gameState == 0)
    {
        document.getElementById("btnPlay").textContent = "PAUSE";
        myGameArea.restart();
    }
    else
    {
        i = !i;
        if (i == 0) { 
            document.getElementById("btnPlay").textContent = "PLAY";
            myGameArea.pause();
        }
        else{
            document.getElementById("btnPlay").textContent = "PAUSE";
            myGameArea.continue();
        }
    }
}



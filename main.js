var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasPlayer = document.getElementById('canvasPlayer');
var ctxPlayer = canvasPlayer.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0, 0%, 0%, 0.5)";
ctxHUD.font = "bold 20px Arial";
 
var player1 = new Player();
var btnPlay = new Button(100, 500, 245, 370);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var bgDrawX1 = 0;
var bgDrawX2 = 0;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
var enemies = [];
var imgSprite = new Image();
imgSprite.src = 'images/sprite.png';
imgSprite.addEventListener('load', init, false);
 
 
// main functions
 
function init() {
    spawnEnemy(5);
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}
 
function playGame() {
    drawBg();
    startLoop();
    updateHUD();
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}
 
function spawnEnemy(number) {
    for (var i = 0; i < number; i++) {
        enemies[enemies.length] = new Enemy();
    }
}
 
function drawAllEnemies() {
    clearCtxEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}
 
function loop() {
    if (isPlaying) {
        //moveBg();
        player1.draw();
        drawAllEnemies();
        requestAnimFrame(loop);
    }
}
 
function startLoop() {
    isPlaying = true;
    loop();
}
 
function stopLoop() {
    isPlaying = false;
}
 
function drawMenu() {
    ctxBg.drawImage(imgSprite, 0, 531, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}
 
function drawBg() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX1, 0, 1600, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX2, 0, 1600, gameHeight);
}
 
/*function moveBg() {
    bgDrawX1 -= 5;
    bgDrawX2 -= 5;
    if (bgDrawX1 <= -1600) {
        bgDrawX1 = 1600;
    } else if (bgDrawX2 <= -1600) {
        bgDrawX2 = 1600;
    }
    drawBg();
}
*/
 
function updateHUD() {
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("Score: " +  player1.score, 0,0);
}
// end of main functions
 
 
// Player functions
 
function Player() {
    this.srcX = 0;
    this.srcY = 478;
    this.width = 18;
    this.height = 24;
    this.speed = 5;
    this.drawX = 40;
    this.drawY = 200;
    this.noseX = this.drawX + 20;
    this.noseY = this.drawY + 30;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet(this);
    }
    this.score = 0;
}
 
Player.prototype.draw = function() {
    clearCtxPlayer();
    this.updateCoors();
    this.checkDirection();
    this.checkShooting();
    this.drawAllBullets();
    ctxPlayer.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width+20, this.height+20);
};
 
Player.prototype.updateCoors = function() { //xy
    this.noseX = this.drawX+30;
    this.noseY = this.drawY+26;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
};
 
Player.prototype.checkDirection = function() {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
    }
};
 
Player.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
    }
};
 
Player.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
};
 
Player.prototype.updateScore = function(points) {
    this.score += points;
    updateHUD();
};
 
function clearCtxPlayer() {
    ctxPlayer.clearRect(0, 0, gameWidth, gameHeight);
}
// end of player functions
 
 
// bullet functions
 
function Bullet(j) {
    this.player = j;
    this.srcX = 0;
    this.srcY = 524;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 11;
    this.height = 7;
    this.explosion = new Explosion();
}
 
Bullet.prototype.draw = function() {
    this.drawX += 3;
    ctxPlayer.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width-1, this.height-1);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};
 
Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};
 
Bullet.prototype.checkHitEnemy = function() {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height) {
                this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
                this.explosion.drawY = enemies[i].drawY;
                this.explosion.hasHit = true;
                this.recycle();
                enemies[i].recycleEnemy();
                this.player.updateScore(enemies[i].rewardPoints);
        }
    }
};
 
Bullet.prototype.recycle = function() {
    this.drawX = -20;
};
// end of bullet functions
 
 
// explosion functions
 
function Explosion() {
    this.srcX = 750;
    this.srcY = 500;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 50;
    this.height = 50;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 10;
}
 
Explosion.prototype.draw = function() {
    if (this.currentFrame <= this.totalFrames) {
        ctxPlayer.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    } else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
// end of explosion functions
 
 
// enemy functions
 
function Enemy() {
    this.srcX = 0;
    this.srcY = 502;
    this.width = 18;
    this.height = 22;
    this.speed = 2;
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
    this.rewardPoints = 5;
}
 
Enemy.prototype.draw = function() {
    this.drawX -= this.speed;
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width+20, this.height+20);
    this.checkEscaped();
};
 
Enemy.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0) {
        this.recycleEnemy();
    }
};
 
Enemy.prototype.recycleEnemy = function() {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
};
 
function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}
// end enemy functions
 
 
// button functions
 
function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}
 
Button.prototype.checkClicked = function() {
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};
// end of button functions
 
 
// event functions
function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying) {
        if (btnPlay.checkClicked()) playGame();
    }
}
 
function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        player1.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        player1.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        player1.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        player1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        player1.isSpacebar = true;
        e.preventDefault();
    }
}
 
function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        player1.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        player1.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        player1.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        player1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        player1.isSpacebar = false;
        e.preventDefault();
    }
}
// end of event functions

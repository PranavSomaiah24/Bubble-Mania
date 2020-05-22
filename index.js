let canvas, ctx;
let gameOver = false,
  timer;
let bubbles = [];
let mouseX, mouseY;
let score = 0;
let bubbleArea = 0;
let bubbleSpeed = 30;
let BubbleCount = 0;
let isSlow = false;
let timeCount = 0;
let bombOnScreen = false;
let highScore;
let isRockEntered = false;
let pop = new Audio("Gum_Bubble_Pop-Sound_Explorer-1206462561.mp3"),
  explosion = new Audio("Explosion+1.mp3"),
  potionDrink = new Audio("Minecraft Potion drinking Sound Effect.mp3");
let isPaused = false;
if (localStorage.getItem(highScore) == null) {
  localStorage.setItem(highScore, "0.00");
}

function init() {
  (canvas = document.getElementById("myCanvas")),
    (ctx = canvas.getContext("2d"));
}
init();
const area = canvas.width * canvas.height * 0.25;

function startTimer(duration, display) {
  display.style.display = "block";
  timer = duration;
  let seconds;
  setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    display.textContent = seconds;

    if (--timer < 0) {
      timer = 0;
    }
  }, 1000);
}

function Bubble(x, y, radius) {
  this.x = x;
  this.y = y;
  this.colour =
    "rgba(" +
    Math.floor(Math.random() * 256).toString() +
    "," +
    Math.floor(Math.random() * 256).toString() +
    "," +
    Math.floor(Math.random() * 256).toString() +
    ",0.8";
  (")");
  this.radius = radius;
  this.vx = Math.floor(Math.random() * 4);
  this.vy = Math.floor(Math.random() * 4);
  this.counted = false;
  this.clicks = 1;
  this.mass = 1;
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  this.update = function (bubbles) {
    for (i = 0; i < bubbles.length; i++) {
      if (this == bubbles[i] || bubbles[i].mass == 2) {
        continue;
      }
      dxx = bubbles[i].x - this.x;
      dyy = bubbles[i].y - this.y;
      distance = Math.sqrt(dxx * dxx + dyy * dyy);
      if (distance < bubbles[i].radius + this.radius)
        resolveCollision(this, bubbles[i]);
    }

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx *= -1;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 80) {
      this.vy *= -1;
    }
    this.x += this.vx;
    this.y += this.vy;
  };
}
function RockBubble() {
  this.x = Math.floor(Math.random() * 300 + 100);
  this.y = Math.floor(Math.random() * 300 + 180);
  this.radius = Math.floor(Math.random() * 40 + 80);
  this.vx = Math.floor(Math.random() * 5);
  this.vy = Math.floor(Math.random() * 5);
  this.counted = false;
  this.clicks = 5;
  this.img = new Image();
  this.img.src = "Asteroid Brown.png";
  this.mass = 2;
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.drawImage(this.img, 0, 0, this.radius, this.radius);
    ctx.restore();
  };
  this.update = function (bubbles) {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx *= -1;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 80) {
      this.vy *= -1;
    }
    this.x += this.vx;
    this.y += this.vy;
  };
}
function drawScore() {
  ctx.save();
  ctx.translate(5, 25);
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.fillText("SCORE: " + score.toString(), 0, 0);
  ctx.restore();
}
function drawHighScore() {
  ctx.save();
  ctx.translate(510, 25);
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.fillText("HIGHSCORE: " + localStorage.getItem(highScore), 0, 0);
  ctx.restore();
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
  let circleDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  return circleDistance <= (r1 - r2) * (r1 - r2);
}

function checkHighScore() {
  let high;
  if (
    Number(localStorage.getItem(highScore)) < score ||
    Number(localStorage.getItem(highScore)) == 0.0
  ) {
    high = score;
    localStorage.setItem(highScore, high.toString());
  }
}

function addBubble() {
  let isInside = false;
  if (bubbles.length > 0) {
    x = Math.floor(Math.random() * 300 + 100);
    y = Math.floor(Math.random() * 300 + 180);
    radius = Math.floor(Math.random() * 40 + 30);
    for (j = 0; j < bubbles.length; j++) {
      dx = bubbles[j].x - x;
      dy = bubbles[j].y - y;
      distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= radius + bubbles[j].radius) {
        isInside = true;
        break;
      }
    }
    if (isInside == false) {
      obj = new Bubble(x, y, radius);
      bubbles.push(obj);
    }
  } else {
    x = Math.floor(Math.random() * 300 + 100);
    y = Math.floor(Math.random() * 300 + 180);
    radius = Math.floor(Math.random() * 40 + 30);
    obj = new Bubble(x, y, radius);
    bubbles.push(obj);
  }
  if (score % 25 == 0 && score != 0 && isRockEntered == false) {
    obj = new RockBubble();
    isRockEntered = true;
    bubbles.push(obj);
  }
}
let frame = 0;
let isClicked = false;
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  isClicked = true;
});

function PotionSprite() {
  this.x = canvas.width / 2;
  this.y = 0;
  this.collected = 0;
  this.size = 64;
  this.frame = 0;
  this.img = new Image();
  this.img.src = "Potions.png";
  this.draw = function () {
    let dx, dy;

    ctx.save();
    ctx.translate(this.x - 17, this.y);
    ctx.beginPath();
    ctx.drawImage(
      this.img,
      this.frame * this.size,
      0,
      this.size,
      this.size,
      0,
      0,
      this.size,
      this.size
    );
    ctx.restore();
    if (isClicked == true) {
      dx = this.x - mouseX;
      dy = this.y - mouseY;
    }

    if (
      dx * dx + dy * dy <= this.size * this.size &&
      isClicked == true &&
      gameOver == false &&
      this.collected < 2
    ) {
      potionDrink.play();
      isSlow = true;
      this.frame++;
      this.collected++;
      isClicked = false;
    }
  };
}
function BombSprite() {
  this.x = Math.floor(Math.random() * 300 + 100);
  this.y = Math.floor(Math.random() * 300 + 180);
  this.vx = Math.floor(Math.random() * 5);
  this.vy = Math.floor(Math.random() * 5);
  this.collected = 0;
  this.counted = true;
  this.radius = 100;
  this.img = new Image();
  this.img.src = "bomb.png";
  this.draw = function () {
    let dx, dy;

    ctx.save();
    ctx.translate(this.x - 17, this.y);
    ctx.beginPath();
    ctx.drawImage(this.img, 0, 0, 1000, 1050, 0, 0, this.radius, this.radius);
    ctx.restore();
    if (isClicked == true) {
      dx = this.x - mouseX;
      dy = this.y - mouseY;
    }

    if (
      dx * dx + dy * dy <= this.radius * this.radius &&
      isClicked == true &&
      gameOver == false
    ) {
      this.radius = 0;
      explosion.play();
      bubbles.splice(0, bubbles.length / 2);
      bubbleArea /= 2;
      isClicked = false;
      bombOnScreen = false;
    }
  };
  this.update = function () {
    if (this.x + this.radius > canvas.width || this.x < 0) {
      this.vx *= -1;
    }
    if (this.y + this.radius > canvas.height || this.y < 80) {
      this.vy *= -1;
    }
    this.x += this.vx;
    this.y += this.vy;
  };
}

let potion = new PotionSprite();
let isTimeLeft = true;

const particlesPerExplosion = 30;
const particlesMinSpeed = 3;
const particlesMaxSpeed = 6;
const particlesMinSize = 3;
const particlesMaxSize = 5;
const explosions = [];

function randInt(min, max = min - (min = 0)) {
  return Math.floor(Math.random() * (max - min) + min);
}
function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.size = randInt(particlesMinSize, particlesMaxSize, true);
  this.r = randInt(113, 222);
  this.g = "00";
  this.b = randInt(105, 255);
}
function clicked(mouseX, mouseY) {
  explosions.push(new Explosion(mouseX, mouseY));
}
function rotate(vx, vy, angle) {
  const rotatedVelocities = {
    x: vx * Math.cos(angle) - vy * Math.sin(angle),
    y: vx * Math.sin(angle) + vy * Math.cos(angle),
  };

  return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.vx - otherParticle.vx;
  const yVelocityDiff = particle.vy - otherParticle.vy;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    const u1 = rotate(particle.vx, particle.vy, angle);
    const u2 = rotate(otherParticle.vx, otherParticle.vy, angle);
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    particle.vx = vFinal1.x;
    particle.vy = vFinal1.y;
    otherParticle.vx = vFinal2.x;
    otherParticle.vy = vFinal2.y;
  }
}
function drawExplosion() {
  if (explosions.length === 0) {
    return;
  }

  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i];
    const particles = explosion.particles;

    if (particles.length === 0) {
      explosions.splice(i, 1);
      continue;
    }

    const particlesAfterRemoval = particles.slice();
    for (let ii = 0; ii < particles.length; ii++) {
      const particle = particles[ii];
      if (particle.size <= 0) {
        particlesAfterRemoval.splice(ii, 1);
        continue;
      }
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, Math.PI * 2, 0, false);
      ctx.closePath();
      ctx.fillStyle =
        "rgb(" + particle.r + "," + particle.g + "," + particle.b + ")";
      ctx.fill();
      ctx.restore();
      particle.x += particle.xv;
      particle.y += particle.yv;
      particle.size -= 0.1;
    }

    explosion.particles = particlesAfterRemoval;
  }
}

function Explosion(x, y) {
  this.particles = [];

  for (let i = 0; i < particlesPerExplosion; i++) {
    this.particles.push(new Particle(x, y));
  }
}

function animate() {
  let dx, dy;

  if (gameOver == false && !isPaused) {
    if (frame > bubbleSpeed - Math.floor(score / 10) * 2 && isSlow == false) {
      addBubble();
      frame = 0;
      count = 0;
      BubbleCount++;
    } else if (frame > 150 && isSlow == true) {
      addBubble();
      frame = 0;
      timeCount++;
    }
  }
  if (!isPaused) {
    ctx.fillRect(0, 0, 700, 700);
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(700, 80);
    ctx.strokeStyle = "grey";
    ctx.stroke();
    drawScore();
    checkHighScore();
    drawHighScore();
    potion.draw();

    for (let i = 0; i < bubbles.length; i++) {
      isSpliced = false;
      dx = 0;
      dy = 0;
      bubbles[i].update(bubbles);
      bubbles[i].draw();
      if (bubbles[i].counted == false) {
        bubbleArea += bubbles[i].radius * bubbles[i].radius * Math.PI;
        bubbles[i].counted = true;
      }
      if (isClicked == true) {
        dx = bubbles[i].x - mouseX;
        dy = bubbles[i].y - mouseY;
      }

      if (
        dx * dx + dy * dy <= bubbles[i].radius * bubbles[i].radius &&
        isClicked == true &&
        gameOver == false
      ) {
        if (bubbles[i].clicks == 1) {
          score++;
          isRockEntered = false;
          bubbleArea -= bubbles[i].radius * bubbles[i].radius * Math.PI;
          pop.play();
          bubbles.splice(i, 1);
          clicked(mouseX, mouseY);
          isSpliced = true;
        } else {
          bubbles[i].clicks--;
        }

        isClicked = false;
      }
    }

    if (BubbleCount % 35 == 0 && BubbleCount != 0 && bombOnScreen == false) {
      bomb = new BombSprite();
      bombOnScreen = true;
    }
    if (bombOnScreen == true) {
      bomb.draw();
      bomb.update();
    }
    drawExplosion();
    if (bubbleArea > area) {
      if (isTimeLeft == true) {
        startTimer(5, document.getElementById("timer"));
        isTimeLeft = false;
      }

      if (timer == 0) {
        gameOver = true;
        document.getElementById("timer").style.display = "none";
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillText("GAME OVER-CLICK TO RESTART.", 0, 0);
        ctx.restore();
        if (isClicked == true) {
          gameRestart();
        }
      }
    } else if (isTimeLeft == false && bubbleArea < area) {
      document.getElementById("timer").style.display = "none";
      timer = 5;
      isTimeLeft = true;
    }
    isClicked = false;
    frame++;
    if (timeCount > 4) {
      isSlow = false;
      timeCount = 0;
    }
  }
  requestAnimationFrame(animate);
}

function gameRestart() {
  bubbleArea = 0;
  ctx.fillRect(0, 0, 700, 700);
  bubbles.splice(0, bubbles.length);
  isClicked = false;
  gameOver = false;
  score = 0;
  frame = 0;
  count = 0;
  timeCount = 0;
  isSlow = false;
  BubbleCount = 0;
  isTimeLeft = true;
  bombOnScreen = false;
  potion = new PotionSprite();
}
let btnStart = document.getElementById("btnStart");
let btnPlay = document.getElementById("playBtn"),
  btnPause = document.getElementById("pauseBtn");
btnStart.addEventListener("click", () => {
  btnPlay.style.display = "block";
  btnPause.style.display = "block";
  document.getElementById("gameMode").style.display = "none";
  canvas.style.display = "block";
  animate();
});

btnPlay.addEventListener("click", () => {
  isPaused = false;
});
btnPause.addEventListener("click", () => {
  isPaused = true;
});

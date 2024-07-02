const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const background = new Image();
background.src = "./img/background.png";

const spriteRunRight = new Image();
spriteRunRight.src = "./img/RunRight.png";
const spriteRunLeft = new Image();
spriteRunLeft.src = "./img/RunLeft.png";

const spriteStandRight = new Image();
spriteStandRight.src = "./img/IdleRight.png";
const spriteStandLeft = new Image();
spriteStandLeft.src = "./img/IdleLeft.png";

const spriteJumpRight = new Image();
spriteJumpRight.src = "./img/JumpRight.png";

canvas.width = 1024;
canvas.height = 576;
const gravity = 1;
let scrollScore = 0;
let doubleJump = false;
let isGameWon = false;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 30;
    this.height = 30;
    this.jumpCount = 0;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        multi: 10,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        multi: 9,
      },
      jump: {
        right: spriteJumpRight,
        multi: 1,
      },
    };
    this.currentSprite = spriteStandRight;
    this.currentMulti = 10;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      32 * this.frames,
      0,
      32,
      32,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (this.frames > this.currentMulti) this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.jumpCount = 0;
    }
  }
}

class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 290;
    this.height = 50;
    this.image = new Image();
    this.image.src = "./img/plateform.png";
  }

  draw() {
    if (this.image.complete) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      c.fillStyle = "blue";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}

class Box {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 28;
    this.height = 24;
    this.image = new Image();
    this.image.src = "./img/box.png";
    this.frames = 0;
  }
  draw() {
    if (this.image.complete) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}

class EndCheck {
  constructor() {
    this.position = {
      x: 3400,
      y: canvas.height - 157,
    };
    this.width = 64;
    this.height = 64;
    this.image = new Image();
    this.image.src = "./img/End.png";
    this.frames = 0;
  }

  draw() {
    c.drawImage(
      this.image,
      64 * this.frames,
      0,
      64,
      64,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (this.frames > this.currentMulti) this.frames = 0;
    this.draw();
  }
}

let player = new Player();
let endCheck = new EndCheck();
let platforms = [
  new Platform({ x: 200, y: 300 }),
  new Platform({ x: 800, y: 200 }),
  new Platform({ x: 1900, y: 300 }),
  new Platform({ x: 2500, y: 100 }),
  new Platform({ x: 3300, y: canvas.height - 100 }),
  new Platform({ x: 0, y: canvas.height - 50 }),
  new Platform({ x: 290, y: canvas.height - 50 }),
  new Platform({ x: 290 * 2, y: canvas.height - 50 }),
  new Platform({ x: 290 * 3, y: canvas.height - 50 }),
  new Platform({ x: 290 * 5, y: canvas.height - 50 }),
];

let boxes = [
  new Box({ x: 0, y: canvas.height - 70 }),
  new Box({ x: 25, y: canvas.height - 70 }),
  new Box({ x: 50, y: canvas.height - 70 }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function init() {
  player = new Player();
  endCheck = new EndCheck();
  platforms = [
    new Platform({ x: 200, y: 300 }),
    new Platform({ x: 800, y: 200 }),
    new Platform({ x: 1900, y: 300 }),
    new Platform({ x: 2500, y: 100 }),
    new Platform({ x: 3300, y: canvas.height - 100 }),
    new Platform({ x: 0, y: canvas.height - 50 }),
    new Platform({ x: 290, y: canvas.height - 50 }),
    new Platform({ x: 290 * 2, y: canvas.height - 50 }),
    new Platform({ x: 290 * 3, y: canvas.height - 50 }),
    new Platform({ x: 290 * 5, y: canvas.height - 50 }),
  ];

  boxes = [
    new Box({ x: 0, y: canvas.height - 70 }),
    new Box({ x: 25, y: canvas.height - 70 }),
    new Box({ x: 50, y: canvas.height - 70 }),
  ];
}

function animate() {
  if (isGameWon) return;
  requestAnimationFrame(animate);
  if (background.complete) {
    const pattern = c.createPattern(background, "repeat");
    c.fillStyle = pattern;
    c.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });
  boxes.forEach((box) => {
    box.draw();
  });
  endCheck.draw();

  if (keys.right.pressed && !keys.left.pressed && player.position.x < 500) {
    player.velocity.x = 5;
    player.currentSprite = player.sprites.run.right;
  } else if (
    keys.left.pressed &&
    !keys.right.pressed &&
    player.position.x > 50
  ) {
    player.velocity.x = -5;
    player.currentSprite = player.sprites.run.left;
  } else player.velocity.x = 0;

  if (keys.right.pressed && !keys.left.pressed && player.position.x >= 500) {
    platforms.forEach((platform) => {
      platform.position.x -= 5;
      scrollScore += 1;
    });
    boxes.forEach((box) => {
      box.position.x -= 5;
    });
    endCheck.position.x -= 5;
  } else if (
    keys.left.pressed &&
    !keys.right.pressed &&
    player.position.x <= 50
  ) {
    platforms.forEach((platform) => {
      platform.position.x += 5;
      scrollScore -= 1;
    });
    boxes.forEach((box) => {
      box.position.x += 5;
    });
    endCheck.position.x += 5;
  }

  // plateform collision
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      player.jumpCount = 0;
    }
  });

  //win condition
  if (
    player.position.x + player.width >= endCheck.position.x &&
    player.position.x <= endCheck.position.x + endCheck.width &&
    player.position.y + player.height >= endCheck.position.y &&
    player.position.y <= endCheck.position.y + endCheck.height
  ) {
    console.log("You Win!");
    isGameWon = true;
    createVictoryWindow();
    // Ajouter toute logique de victoire ici
  }
  //lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

function createVictoryWindow() {
  const victoryWindow = document.getElementById("victoryWindow");
  if (isGameWon) {
    victoryWindow.style.display = "block";
  }

  document.getElementById("playAgain").addEventListener("click", (e) => {
    isGameWon = false;
    victoryWindow.style.display = "none";
    requestAnimationFrame(animate);
    init();
  });
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left;
      player.currentMulti = player.sprites.run.multi;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
      player.currentMulti = player.sprites.run.multi;

      break;
    case 38:
      console.log("up");
      if (player.jumpCount < 2) {
        player.velocity.y = -20;
        // player.currentSprite = player.sprites.jump.right;
        // player.currentMulti = player.sprites.jump.multi;

        player.jumpCount++;
      }
      break;
    case 40:
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.currentMulti = player.sprites.stand.multi;

      break;
    case 39:
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentMulti = player.sprites.stand.multi;

      break;
    case 38:
      break;
    case 40:
      break;
  }
});

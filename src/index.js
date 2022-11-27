import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: { y: 400 },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const flapVelocity = 250;
const VELOCITY = 200;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };
const gravity = 400;
// const gravity = 0;
const PIPES_TO_RENDER = 4;

let bird = null;
let pipes = null;
// let pipeHorizontalDistance = 0;

const pipeVerticalDistanceRange = [150, 250];
let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
const pipeHorizontalDistanceRange = [250, 400];
let pipeHorizontalDistance = Phaser.Math.Between(
  ...pipeHorizontalDistanceRange
);
let pipeVerticalPosition = Phaser.Math.Between(
  0 + 20,
  config.height - 20 - pipeVerticalDistance
);
const pipeVerticalPositionRange = [
  20,
  config.height - 20 - pipeVerticalDistance,
];

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = gravity;

  pipes = this.physics.add.group();

  for (let index = 0; index < PIPES_TO_RENDER; index++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);
    placePipes(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
}

function update(time, delta) {
  if (bird.y > config.height - bird.height || bird.y < 0) {
    restartBirdtPosition();
  }
  recyclePipes();
}

function restartBirdtPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = VELOCITY;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function placePipes(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(
    ...pipeVerticalDistanceRange
  );
  const pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );
  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );
  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;
  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach((pipe) => {
    if (pipe.getBounds().right < 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipes(...tempPipes);
      }
    }
  });
}

function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function (pipe) {
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}

new Phaser.Game(config);

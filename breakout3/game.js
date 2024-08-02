var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

var bricks;
var paddle;
var ball;

var game = new Phaser.Game(config);

function preload() {
	// Load assets using the atlas
	this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
}

function create() {
	// Enable world bounds, but disable the floor
	this.physics.world.setBoundsCollision(true, true, true, false);

	// Calculate the grid size based on the screen width
	var cols = Math.floor(window.innerWidth / 64) - 2; // Reduce one column from the left
	var rows = 7; // Increase one row
	var offsetX = (window.innerWidth - cols * 64) / 2;
	var offsetY = window.innerHeight / 8; // Adjusted to place the bricks higher

	// Create the bricks in a grid
	bricks = this.physics.add.staticGroup({
		key: 'assets',
		frame: ['blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1'],
		frameQuantity: cols,
		gridAlign: {
			width: cols,
			height: rows,
			cellWidth: 64,
			cellHeight: 32,
			x: offsetX,
			y: offsetY,
		},
	});

	ball = this.physics.add
		.image(
			window.innerWidth / 2,
			(window.innerHeight * 2) / 3,
			'assets',
			'ball1'
		)
		.setCollideWorldBounds(true)
		.setBounce(1);
	ball.setData('onPaddle', true);

	paddle = this.physics.add
		.image(
			window.innerWidth / 2,
			(window.innerHeight * 2) / 3 + 50,
			'assets',
			'paddle1'
		)
		.setImmovable();

	// Set up collision
	this.physics.add.collider(ball, bricks, hitBrick, null, this);
	this.physics.add.collider(ball, paddle, hitPaddle, null, this);

	// Mouse movement
	this.input.on(
		'pointermove',
		function (pointer) {
			paddle.x = Phaser.Math.Clamp(pointer.x, 52, window.innerWidth - 52);

			if (ball.getData('onPaddle')) {
				ball.x = paddle.x;
			}
		},
		this
	);

	// Mouse click
	this.input.on(
		'pointerup',
		function (pointer) {
			if (ball.getData('onPaddle')) {
				ball.setVelocity(-150, -600);
				ball.setData('onPaddle', false);
			}
		},
		this
	);
}

function update() {
	if (ball.y > window.innerHeight) {
		resetBall();
	}
}

function hitBrick(ball, brick) {
	brick.disableBody(true, true);

	if (bricks.countActive() === 0) {
		resetLevel();
	}
}

function resetBall() {
	ball.setVelocity(0);
	ball.setPosition(paddle.x, (window.innerHeight * 2) / 3);
	ball.setData('onPaddle', true);
}

function resetLevel() {
	resetBall();
	bricks.children.each(function (brick) {
		brick.enableBody(false, 0, 0, true, true);
	});
}

function hitPaddle(ball, paddle) {
	var diff = 0;

	if (ball.x < paddle.x) {
		diff = paddle.x - ball.x;
		ball.setVelocityX(-10 * diff);
	} else if (ball.x > paddle.x) {
		diff = ball.x - paddle.x;
		ball.setVelocityX(10 * diff);
	} else {
		ball.setVelocityX(2 + Math.random() * 8);
	}
}

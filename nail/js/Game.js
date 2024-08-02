MyGame.Game = function (game) {
	game.direction = 1;
	this.nailNumber = 1;
	this.score = 0;
	this.hitWall = false;
	game.isRun = false;
};

MyGame.Game.prototype = {
	create: function () {
		game.stage.backgroundColor = '#d4d8d3';

		GameUI.Game_element();

		// 添加屏幕中间的圆
		this.circle = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			game.circleGraphics.generateTexture()
		);
		this.circle.anchor.set(0.5);

		// 调整分数文字大小以适应不同屏幕
		var scoreFontSize = Math.min(game.world.height / 4, 238);
		this.scoreText = this.add.text(
			this.world.centerX,
			this.world.centerY + 20,
			'0',
			{
				font: 'bold ' + scoreFontSize + 'px Microsoft YaHei',
				fill: '#d4d8d3',
				align: 'center',
			}
		);
		this.scoreText.anchor.set(0.5);

		// 添加上下矩形
		this.rectTop = game.add.sprite(0, 0, game.rectGraphics.generateTexture());
		this.rectBottom = game.add.sprite(
			0,
			game.world.height - 80,
			game.rectGraphics.generateTexture()
		);
		this.rectTop.width = game.world.width;
		this.rectBottom.width = game.world.width;

		// 添加小鸟
		this.bird = this.add.sprite(game.world.centerX, game.world.centerY, 'bird');
		this.bird.anchor.set(0.5);
		game.physics.enable([this.bird], Phaser.Physics.ARCADE);
		this.bird.body.collideWorldBounds = true;
		this.bird.body.bounce.set(0.8);

		// 添加钉子组
		this.upbottomNailGroup = game.add.physicsGroup();
		this.leftrigthNailGroup = game.add.physicsGroup();

		this.createUpBottomNails();
		this.createNail(2);

		this.GameStart();

		game.input.onTap.add(this.birdJump, this);

		// 销毁图形
		game.circleGraphics.destroy();
		game.NailGraphics.destroy();
		game.rectGraphics.destroy();
	},

	createUpBottomNails: function () {
		var nailWidth = game.world.width / 8;
		for (var i = 0; i < 16; i++) {
			var x = i < 8 ? nailWidth * i : nailWidth * (i - 8);
			var y = i < 8 ? 80 + 20 : game.world.height - 80 - 20;
			this.Nail = game.add.sprite(x, y, game.NailGraphics.generateTexture());
			this.Nail.width = nailWidth;
			if (i >= 8) this.Nail.scale.y = -1;
			this.upbottomNailGroup.add(this.Nail);
		}

		this.upbottomNailGroup.forEach(function (i) {
			i.anchor.set(0, 0.5);
			i.body.immovable = true;
		});
	},

	GameStart: function () {
		game.isRun = true;
		this.bird.body.gravity.y = 1000;
		this.bird.body.velocity.y = -350;
		this.bird.body.velocity.x = 200;
	},

	GameOver: function () {
		game.isRun = false;
		this.bird.body.velocity.x = 2000;
		this.bird.body.velocity.y = 2000;

		this.add
			.tween(this.bird)
			.to({ alpha: 0 }, 1000, 'Linear', true)
			.onComplete.add(function () {
				this.bird.kill();
			}, this);
	},

	birdJump: function () {
		if (game.isRun) {
			this.bird.body.velocity.y = -350;
			this.bird.body.velocity.x = 200 * game.direction;
		}
	},

	createNail: function (num) {
		for (var i = 0; i < num; i++) {
			var nailSpace = 120 + 60 * this.RandomNum(0, 15);
			this.NailA = game.add.sprite(
				game.world.width - 15,
				nailSpace,
				game.NailGraphicsA.generateTexture()
			);
			this.NailA.anchor.set(0.5, 0);
			this.leftrigthNailGroup.add(this.NailA);
			this.NailA.body.immovable = true;
		}
	},

	RandomNum: function (Min, Max) {
		return Min + Math.round(Math.random() * (Max - Min));
	},

	update: function () {
		if (!game.isRun) return;

		game.physics.arcade.collide(
			this.upbottomNailGroup,
			this.bird,
			this.GameOver,
			null,
			this
		);
		game.physics.arcade.collide(
			this.leftrigthNailGroup,
			this.bird,
			this.GameOver,
			null,
			this
		);

		if (
			this.bird.x >= game.world.width - this.bird.width / 2 ||
			this.bird.x <= 0 - this.bird.width / 2
		) {
			game.direction = this.bird.scale.x =
				this.bird.x > game.world.width / 2 ? -1 : 1;
			this.hitWall = true;
		}

		if (this.hitWall) {
			this.score++;
			this.scoreText.setText(this.score);

			if (this.score % 10 == 0) {
				this.createNail(1);
			}

			this.leftrigthNailGroup.forEach(function (i) {
				i.body.immovable = true;
				i.x = game.direction == -1 ? 15 : game.world.width - 15;
				i.scale.x = game.direction;
				i.y = 162 + 100 * game.rnd.integerInRange(0, 8);
			});
			this.hitWall = false;
		}
	},
};

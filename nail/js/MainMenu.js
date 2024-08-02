MyGame.MainMenu = function (game) {};

MyGame.MainMenu.prototype = {
	create: function () {
		game.stage.backgroundColor = '#d4d8d3';

		GameUI.Game_element();

		// 调整标题大小和位置
		var titleFontSize = Math.min(game.world.height / 15, 80);
		this.GameTitle = this.add.text(
			game.world.centerX,
			game.world.height * 0.2,
			'别碰钉子',
			{
				font: titleFontSize + 'px Microsoft YaHei',
				fill: '#808080',
				align: 'center',
			}
		);
		this.GameTitle.anchor.set(0.5);

		// 添加屏幕中间的圆，并调整大小
		this.circle = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			game.circleGraphics.generateTexture()
		);
		this.circle.anchor.set(0.5);
		// 调整圆的大小，这里设置为原来的80%
		this.circle.scale.set(0.8);

		// 调整提示文字大小和位置
		var depictFontSize = Math.min(game.world.height / 35, 30);
		this.depictText = this.add.text(
			game.world.centerX,
			game.world.height * 0.8,
			'点击屏幕跳跃',
			{
				font: depictFontSize + 'px Microsoft YaHei',
				fill: '#fc3463',
				align: 'center',
			}
		);
		this.depictText.anchor.set(0.5);

		// 调整版本信息大小和位置
		var versionFontSize = Math.min(game.world.height / 35, 30);
		this.version = this.add.text(
			game.world.width - 20,
			game.world.height - 20,
			'版本：0.0.1',
			{
				font: versionFontSize + 'px Microsoft YaHei',
				fill: '#808080',
				align: 'center',
			}
		);
		this.version.anchor.set(1, 1);

		// 添加上下矩形
		this.rectTop = game.add.sprite(0, 0, game.rectGraphics.generateTexture());
		this.rectBottom = game.add.sprite(
			0,
			game.world.height - 80,
			game.rectGraphics.generateTexture()
		);
		this.rectTop.width = game.world.width;
		this.rectBottom.width = game.world.width;

		// 添加小鸟，并相应调整大小
		this.bird = this.add.sprite(game.world.centerX, game.world.centerY, 'bird');
		this.bird.anchor.set(0.5);
		// 调整小鸟的大小，保持与圆的比例一致
		this.bird.scale.set(0.8);

		// 添加点击事件
		game.input.onDown.addOnce(function () {
			game.state.start('Game');
		}, this);

		// 销毁图形
		game.circleGraphics.destroy();
		game.NailGraphics.destroy();
		game.rectGraphics.destroy();
	},
};

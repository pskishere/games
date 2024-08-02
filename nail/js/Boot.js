var MyGame = {};

MyGame.Boot = function (game) {};

MyGame.Boot.prototype = {
	preload: function () {},
	create: function () {
		this.stage.backgroundColor = '#d4d8d3';
		this.input.maxPointers = 1;

		// 使用 EXACT_FIT 模式
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		// 设置游戏尺寸为屏幕尺寸
		this.scale.setGameSize(window.innerWidth, window.innerHeight);


		// 禁用任何可能的内边距
		this.scale.pageAlignHorizontally = false;
		this.scale.pageAlignVertically = false;

		// 强制游戏填满整个屏幕
		this.scale.forceOrientation(false, true);

		// 监听屏幕大小变化
		window.addEventListener('resize', this.resizeGame.bind(this));

		this.state.start('Preloader');
	},

	resizeGame: function () {
		// 当屏幕尺寸变化时，调整游戏尺寸
		this.scale.setGameSize(window.innerWidth, window.innerHeight);

		// 如果有自定义的UI元素，在这里调整它们的位置
		// 例如：this.adjustUIElements();
	},

	// 如果需要，添加调整UI元素的方法
	// adjustUIElements: function() {
	//     // 调整UI元素位置的代码
	// }
};

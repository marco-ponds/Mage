(function() {
	window.AssetsManager = {};
	var managers = [
		"js/core/audio/soundEngine",
		"js/core/video/videoEngine",
		"js/core/images/imagesEngine",
		"js/core/generalAssets/generalAssetsEngine",

		"js/core/util/HashMap"
	];

	AssetsManager.completed = {
		sound : false,
		video : true,
		images : true,
		general : true
	};

	AssetsManager.load = function(callback) {
		//first we load scripts
		AssetsManager.callback = callback;
		requirejs(managers, function() {
			//over loading scripts
			AudioEngine.load();
			VideoEngine.load();
			ImagesEngine.load();
			GeneralAssetsEngine.load();
			AssetsManager.checkInterval = setInterval(AssetsManager.check, 100);
		});
	};

	AssetsManager.loadingMessage = function(loaded) {
		//this method is up to you, developer!
		console.log(loaded);
	}

	AssetsManager.check = function() {
		if (AssetsManager.completed.sound && AssetsManager.completed.video && AssetsManager.completed.images && AssetsManager.completed.general) {
			//we finished loading all assets, yay!
			AssetsManager.loadingMessage(true);
			clearInterval(AssetsManager.checkInterval);
			AssetsManager.callback();
		} else {
			AssetsManager.loadingMessage(false);
		}
	}

})();
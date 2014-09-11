var BossCommand = function() {
	var $workImage = $("#workImage");

    $workImage.click(function(){$workImage.toggle()});

	return {
		execute: function() {
			$workImage.toggle();
		}
	}

}();
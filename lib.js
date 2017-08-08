var s = {
	tips: ['Tap on the lightbulb for tips', 'Tap on a hint to hide it', 'Tap on the title at the top to rename your sticker chart', 'Tap on a sticker to show or hide it', 'Your progress is saved automatically on your device', 'You can move the train anywhere you like by clicking on the island or sea', 'Try putting this on your smart TV or tablet so your child can see it', 'Get your child excited about what will happen when they get their next sticker'],
	
	currentTip: 0,
	
	tipVisible: true,
	
	nextTip: function() {
		s.currentTip = (s.currentTip + 1) % s.tips.length;
		$('#tips .value').html(s.tips[s.currentTip]);
	},
	
	toggleTips: function() {
		$('#tips .value').animate({width:'toggle', opacity:'toggle'});
		s.tipVisible = !s.tipVisible;
	},
	
	init: function() {
		$('.star').click(function(e) {
			$("#" + e.currentTarget.id).toggleClass('selected');
			if(s.stickers[e.currentTarget.id]) {
				delete s.stickers[e.currentTarget.id];
			} else {
				s.stickers[e.currentTarget.id] = true;
			}
			s.save(true);
			s.updateStickerCount();
		});
		$('body').click(function(e) {
			$('#train').css({top:e.clientY, left: e.clientX});
		});
		$('#name').click(s.rename);
		s.load(true);
		
		var cancelHideTips = setTimeout(s.toggleTips, 5000);		
		
		$('#tips').click(function() {
			s.toggleTips();
			clearTimeout(cancelHideTips);
			return false;
		});
		
		$('#btnTips').click(function() {
			clearTimeout(cancelHideTips);
			if(s.tipVisible) {
				$('#tips .value').animate({width:'toggle', opacity:'toggle'}, {complete: function() {
					s.nextTip();
					s.toggleTips();
				}});
				s.tipVisible = !s.tipVisible;
			} else {
				s.nextTip();
				s.toggleTips();
			}
			
			return false;
		});

		
	},

	rename: function (e) {
	    $('#name').unbind('click');
	    var title = $('#name').text();
	    var html = '<form><input id="title" value="' + title + '"><button type="submit" id="btnOKTitle">OK</button></form>';
	    $('#name').html(html);
	    $('#title').focus().select();
	    $('#btnOKTitle').click(function () {
	        var html = $('#title').val();
	        $('#name').html(html).click(s.rename);
	        localStorage.stickerChartName = html;
	        return false;
	    });
	    s.save(true);
	    return false;
	},
	
	updateStickerCount: function() {
		var stickerCount = $('.selected').length;
		$('#stickerCount .value').html(stickerCount);
	},
	
	stickers: {},
	
	save: function(local) {
	    if (local) {
	        localStorage.stickers = JSON.stringify(s.stickers);
	        localStorage.stickerChartName = localStorage.stickerChartName;
		}
	},
	
	load: function(local) {
		$('.stickers').removeClass('selected');
		if(local) {
			if(localStorage.stickers === undefined) {
				s.reset(true);
			}
			if(localStorage.stickerChartName === undefined | localStorage.stickerChartName == "") {
				localStorage.stickerChartName = "Sticker chart";
			}
			s.stickers = JSON.parse(localStorage.stickers);
		}
		for(var sticker in s.stickers) {
			$('#' + sticker).addClass('selected');
		}
		s.updateStickerCount();
		$('#name').text(localStorage.stickerChartName);
	},
	
	reset: function(local) {
		if(local) {
		    s.stickers = {star01:true};
		    localStorage.stickerChartName = "My sticker chart";
		    s.save(true);
		}
		s.load(true);
	}
	
	
}

$(s.init);
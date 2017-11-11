//返回begin到end之间的一个随机数
function rand(begin, end){
 	return Math.floor(Math.random()*(end-begin))+begin;
}

function game2048(window) {
	// html代码中游戏窗口的class名称
	var window = window
	var board = []
	var blank = 16

	// 运行游戏
	var run = function() {
		init()
		key()
	}

	// 初始化游戏 / 重新开始游戏只需要再次初始化游戏，不需要重新设置键盘监听事件
	var init = function() {

		// 初始化html代码中游戏窗口的html结构
		var inithtml = function() {
			// 加入一个div id为cell，存放16个具体的cell
			$('.'+ window).html("<div id = 'cell'></div>")
			// 加入一个div id为anicell，存放动画用的cell
			$('.'+ window).html($('.'+ window).html() + "<div id = 'anicell'></div>")
			// 16个cell的html代码
			cell = ''
			for (i=0;i<16;i++) {
				cell += "<div class = 'cell'></div>"
			}
			// 加入到html代码中
			$('#cell').html(cell)
			// 给16个cell排列位置
			for (a=0;a<4;a++) {
				for (b=0;b<4;b++) {
					$('.cell').eq(a*4+b).css("left", b*120-5+"px")
					$('.cell').eq(a*4+b).css("top", a*120-5+"px")		
				}
			}
		}

		// 初始化board
		var initboard = function() {
			for (a=0;a<4;a++) {
				board[a] = [0, 0, 0, 0]
			}
		}

		var run = function() {
			inithtml()
			initboard()
			newCell()
			newCell()
			drawcell()
			keyflag = 1
			console.log(blank)
		}

		run()
	}


	// 重绘所有cell (根据board)
	var drawcell = function() {
		for (a=0;a<4;a++) {
			for (b=0;b<4;b++) {
				if (board[a][b] != 0) {
					$(".cell").eq(a*4+b).text(board[a][b])
				}
				else {
					$(".cell").eq(a*4+b).text('')					
				}
			}
		}

	}

	// 创建一个新的cell
	var newCell = function() {
		var a = 0, b = -1
		var val = rand(1, blank)
		var keyflag = 0

		next = function() {
			b ++
			if (b > 3) {
				b = 0
				a ++
			}	
		}
		while (val > 0) {
			next()
			if (board[a][b] == 0){
				val --;
			}
		}
		while (board[a][b] != 0) {
			next()
		}
		board[a][b] = 1;
		blank --
		console.log("blank = " + blank)
	}

	// 处理按键事件
	var key = function() {
		move = movecell()
		document.onkeydown = function(event) {
			if (keyflag == 0) {
				return -1
			}
			if (event.keyCode == 37) {
				var oup = move.left()
			}
			else if (event.keyCode == 38) {
				var oup = move.up()
			}
			else if (event.keyCode == 39) {
				var oup = move.right()
			}
			else if (event.keyCode == 40) {
				var oup = move.down()
			}
			else {
				return -1
			}
			console.log(oup)
			if (oup.change >0) {
				keyflag = 0
				cellani(oup.anilist)
			}
		}
	}

	// 处理动画效果
	var cellani = function(anilist) {
		// 16个cell的html代码
		var anicell = ''
		for (i in anilist) {
			anicell += "<div class = 'anicell'></div>"
		}
		// 加入到html代码中
		$('#anicell').html(anicell)
		for (i in anilist) {
			$('.anicell').eq(i).css("left", anilist[i][1]*120+"px")
			$('.anicell').eq(i).css("top", anilist[i][0]*120+"px")
			$('.anicell').eq(i).text(anilist[i][4])
			$('.cell').eq(anilist[i][0]*4+anilist[i][1]).text('')				
		}
		frameani(25, anilist)
	}

	// 渲染单帧动画
	var frameani = function(n, anilist) {
		var time = 200
		var frame = 25
		if (n>=0) {
			setTimeout(function() {
				//console.log("ani")
				//console.log(anilist[i][1]*120+(anilist[i][3]-anilist[i][1])*120*(frame-n)/frame)
				for (i in anilist) {
					$('.anicell').eq(i).css("left", anilist[i][1]*120+(anilist[i][3]-anilist[i][1])*120*(frame-n)/frame+"px")
					$('.anicell').eq(i).css("top", anilist[i][0]*120+(anilist[i][2]-anilist[i][0])*120*(frame-n)/frame+"px")				
				}
				frameani(n-1, anilist)
			},time/frame)		
		}
		//
		else {
			$('#anicell').html('')
			drawcell()		
			newCell()
			drawcell()
			console.log(board)
			keyflag = 1
		}
	}

	// 移动cell
	var movecell = function() {
		this.up = function() {
			var change = 0
			var anilist = []
			for (b=0;b<4;b++) {
				var i = 0
				var combination = 1
				for (a=0;a<4;a++) {
					if (board[a][b] != 0) {
						if (combination == 1 && i > 0 && board[i-1][b] == board[a][b]) {
							board[i-1][b] = board[i-1][b] * 2 
							anilist.push([a, b, i-1, b, board[a][b]])
							board[a][b] = 0
							combination = 0
							change++
							blank++
						}
						else {
							board[i][b] = board[a][b]
							combination = 1
							if (i != a) {
								anilist.push([a, b, i, b, board[a][b]])
								board[a][b] = 0
								change++
							}
							i++
						}
					}
				}
			}
			console.log(anilist)
			var o = {
				"change": change,
				"anilist": anilist,
			}
			return o
		}

		var down = function() {
			var change = 0
			var anilist = []
			for (b=3;b>=0;b--) {
				var i = 3
				var combination = 1
				for (a=3;a>=0;a--) {
					if (board[a][b] != 0) {
						if (combination == 1 && i < 3 && board[i+1][b] == board[a][b]) {
							board[i+1][b] = board[i+1][b] * 2 
							anilist.push([a, b, i+1, b, board[a][b]])
							board[a][b] = 0
							combination = 0
							change++
							blank++
						}
						else {
							board[i][b] = board[a][b]
							combination = 1
							if (i != a) {
								anilist.push([a, b, i, b, board[a][b]])
								board[a][b] = 0
								change++
							}
							i--
						}
					}
				}
			}
			console.log(anilist)
			var o = {
				"change": change,
				"anilist": anilist,
			}
			return o
		}

		var right = function() {
			var change = 0
			var anilist = []
			for (a=3;a>=0;a--) {
				var i = 3
				var combination = 1
				for (b=3;b>=0;b--) {
					if (board[a][b] != 0) {
						if (combination == 1 && i < 3 && board[a][i+1] == board[a][b]) {
							board[a][i+1] = board[a][i+1] * 2 
							anilist.push([a, b, a, i+1, board[a][b]])
							board[a][b] = 0
							combination = 0
							change++
							blank++
						}
						else {
							board[a][i] = board[a][b]
							combination = 1
							if (i != b) {
								anilist.push([a, b, a, i, board[a][b]])
								board[a][b] = 0
								change++
							}
							i--
						}
					}
				}
			}
			console.log(anilist)
			var o = {
				"change": change,
				"anilist": anilist,
			}
			return o
		}

		var left = function() {
			var change = 0
			var anilist = []
			for (a=0;a<4;a++) {
				var i = 0
				var combination = 1
				for (b=0;b<4;b++) {
					if (board[a][b] != 0) {
						if (combination == 1 && i > 0 && board[a][i-1] == board[a][b]) {
							board[a][i-1] = board[a][i-1] * 2 
							anilist.push([a, b, a, i-1, board[a][b]])
							board[a][b] = 0
							combination = 0
							change++
							blank++
						}
						else {
							board[a][i] = board[a][b]
							combination = 1
							if (i != b) {
								anilist.push([a, b, a, i, board[a][b]])
								board[a][b] = 0
								change++
							}
							i++
						}
					}
				}
			}
			console.log(anilist)
			var o = {
				"change": change,
				"anilist": anilist,
			}
			return o
		}
		var o = {
			"up": up,
			"down": down,
			"left": left,
			"right": right,
		}
		return o
	}

	var o = {
		"run": run,
		"restart": init,
	}
	return o
}

function init() {
	game = new game2048("gamewindow")
	game.run()
}
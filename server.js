var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});
var requests={};

io.on('connection', function(socket){
	console.log('connected: '+socket.id);
	socket.on('post', function(msg){
		//var ramz=Math.floor((Math.random() * 10000) + 1);
		var ramz=1022;
		requests[ramz.toString()]=[socket.id,msg];
		console.log(requests[ramz][0]+" - "+requests[ramz][1]+" - ramz:"+ramz+"\n");
		socket.emit('ramz',ramz.toString());
	});
	socket.on("scaned", function(msg){
		console.log("scaned_ramz: "+msg);
		if(requests[msg]!==null | requests[msg]!==undefined){
			io.sockets.connected[requests[msg][0]].emit("confirm","پرداخت مبلغ"+requests[msg][1]+" به حسن جمشید موافق هستید؟");
		}
	});
	socket.on('confirmed', function(msg){
		if(msg=="yes"){
			io.emit("alert","پرداخت با موفقیت انجام شد.");
		}
		
	});
});

var port = process.env.PORT || 3000;
app.listen(port);

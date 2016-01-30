var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3000);

var Client = require('node-rest-client').Client;
var client = new Client();
 
// set content-type header and data as json in args parameter 
var args = {
	data: { receptor: "09372864107", message:"تست وب سرویس اس ام اس" },
	headers: { "Content-Type": "application/json" }
};
 








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
		client.post("https://api.kavenegar.com/v1/74466A306C6A2F6F3466524F374537794648713450413D3D/sms/send.json", args, function (data, response) {
			socket.emit('ramz',response.toString());
		});
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



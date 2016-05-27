/* Заготовка для рабиения сети на подсети с маской переменной длинны
function networkInformation() {
	this.ip;
	this.mask;
	this.maskBinary = [];

	this.subnetNum;
	this.subnetNumBinary;

	this.subnetNumHosts = [];
	this.subnetNumHostsBinary = [];

	this.netAddress = [];
}

networkInformation.prototype.getIpOnSubnet = function() {
	var ip = $('#ip_subnet').val();
	if(validIP(ip) == false) {
		return;
	}
	this.ip = ip.split('.');
}

networkInformation.prototype.getMaskOnSubnet = function() {
	var mask = $('#mask_subnet').val();

	if(validMask(mask) == false) {
		return false;
	}

	this.mask = Number(mask);

	for(var i = 0; i < 32; i++) {
		if(i < this.mask) this.maskBinary[i] = "1";
		else this.maskBinary[i] = "0";
	}
}

networkInformation.prototype.getSubnetNum = function() {
	var reg = /^\d+$/;
	var subnetCh = $('#amount').val();
	if(reg.test(subnetCh) == false) {
		alert("Введено некореткное значение количества подсетей.");
		throw new SyntaxError("Введено некореткное значение количества подсетей.");
		return false;
	}
	this.subnetNum = Number(subnetCh);
	this.subnetNumBinary = (this.subnetNum).toString(2);
}

networkInformation.prototype.getSubnetNumHosts = function() {
	var reg = /^\d+$/;
	var subNetworks = $('.netw');
	for(var i = 0; i < subNetworks.length; i++) {
		if(reg.test(subNetworks[i].value) == false) {
			alert("В поле Подсеть №" + (i+1) + " введено некоректное значение.");
			throw new SyntaxError("В поле Подсеть №" + i + " введено некоректное значение.");
			return false;			
		}
		this.subnetNumHosts[i] = Number(subNetworks[i].value);
		this.subnetNumHostsBinary[i] = (this.subnetNumHosts[i]).toString(2);
	}
}

networkInformation.prototype.outSubnetForms = function() {
	$('#subnet_box').html('');
	for(var i = 1; i < this.subnetNum + 1; i++) { 
		$('#subnet_box').append('<div class="form-group" id="subnet_forms'+i+'"><label for="net'+i+'"class="col-sm-4 control-label">Подсеть №'+i+'</label>'+'<div class="col-sm-2">'+'<input type="text" class="netw form-control" id="net'+i+'" placeholder="хостов"></div></div>');
	}
}

networkInformation.prototype.outSubneting = function() {
	// Узнаем количество нулей в маске
	var numZero = 32 - this.mask;
	var numHosts = [];				
	var numSubBinary;
	var numSubBinaryDots = [];

	//храним подсети
	var rezSubnet = this.subnetNumHostsBinary;  // Номера кождой следующей подсети в бинарном виде
	var rezNetwork = [];						// Каждая подсеть
	var rezIpBuf;

	numSubBinary = this.subnetNumBinary.split('');

	// Если длинна количества подсетей в двоичном больше чем длинна доступных нулей маски разбиение не возможно
	if(this.subnetNumBinary.length > numZero) {
		alert('Разбиение не возможно');
		return;
	}

	for (var j = 0; j < numZero - numSubBinary.length; j++) {
		numHosts[j] = 0;
	}

	maxAddress = numHosts.splice(0,0,"1"); // Максимальный адресс

	//if(numHosts.length > 8) numHosts.splice(numHosts.length - 8,0,".");
	//if(numHosts.length > 16) numHosts.splice(numHosts.length - 17,0,".");
	//if(numHosts.length > 24) numHosts.splice(numHosts.length - 26,0,".");

	rezIpBuf = this.ip; //!!Нужно сделать правильно если маска меньшу 24!!
	rezIpBuf[3] = "0";
	rezNetwork[0] = rezIpBuf.join('.');

	for (var i = 0; i < rezSubnet.length; i++) {
		// Задаем +1 к количеству нужных хостов в подсети

		var buf = rezSubnet[i];
		buf = buf.split("");

		if(compareArr(buf) == false) {
			for(var j = 0; j < buf.length; j++) {
				buf[j] = 0;
			}
			buf.splice(0,0,"1");
		}

		if(compareArr(buf) == true) {
			for(var j = 0; j < buf.length; j++) {
				buf[j] = 0;
			}
			buf.splice(0,0,"1");
			buf.splice(buf.length,0,"0");
		}
		buf = buf.join('');
		rezIpBuf[3] = Number(rezIpBuf[3]) + parseInt(buf, 2);
		rezNetwork[i + 1] = rezIpBuf.join('.'); 
	}
	this.netAddress = rezNetwork;
}

networkInformation.prototype.outTable = function() {
	var net = this.netAddress;
	$('#table').html('');
	for(var i = 0; i < net.length - 1; i++) { 
		$('#table').append('<tr><td>'+ (i+1) +'</td><td>'+ this.subnetNumHosts[i] +'</td><td></td><td>'+ net[i] +'</td><td>/26</td><td>255.255.255.192</td><td>192.168.1.1 - 192.168.1.62</td></tr>');
	}
}

$(function(){
	var netInf = new networkInformation();
	$('#amount_btn').click(function(){
		netInf.getSubnetNum();
		netInf.outSubnetForms();
	});
	$('#calculate_subneting_btn').click(function(){
		netInf.getSubnetNum();
		netInf.getIpOnSubnet();
		netInf.getMaskOnSubnet();
		netInf.getSubnetNumHosts();
		netInf.outSubneting();
		netInf.outTable();
	});
});*/
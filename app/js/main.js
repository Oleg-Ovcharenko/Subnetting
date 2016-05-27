// Функция для перевода в бинарный вид

var toBinary = function(Arr) {											
	var binaryArr = [];

	for(var i = 0; i < Arr.length; i++) {
		binaryArr[i] = Number(Arr[i]).toString(2);
		if(binaryArr[i].length < 8) {
			var zero = "0";
			for(var j = 1; j < 8 - binaryArr[i].length; j++) {
				zero += "0";
			}
			binaryArr[i] = zero + binaryArr[i];
		}
	}
	return binaryArr;
};

// Функция для перевода в шестнадцатиричный вид

var toHexadecimal = function(Arr) {										
	var hexadecimalArr = [];
	var decemalArr = [];
	var rez;

	for(var i = 0; i < Arr.length; i++) {
		decemalArr[i] = parseInt(Arr[i], 2);
		hexadecimalArr[i] = Number(decemalArr[i]).toString(16);
		if(hexadecimalArr[i].length < 2) {
			hexadecimalArr[i] = "0" + hexadecimalArr[i];
		}
	}

	rez = hexadecimalArr.join('.').toUpperCase();
	return rez;
};

// Проверка на правильность ввода IP

var validIP = function(ip) {								
	var reg = /^(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])){3}$/;

	if(reg.test(ip) == false) {
		alert("Введен не коректный ip-адресс. Пожалуйста проверьте правильность ввода.");
		throw new SyntaxError("Введен не коректный ip-адресс.");
	}	
}

 // Проверка на правильность ввода маски

var validMask = function(mask) {									 
	var reg = /^(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32)$/;

	if(reg.test(mask) == false) {
		alert("Введено некореткное значение маски подсети.");
		throw new SyntaxError("Введен не коректный ip-адресс.");
	}
}; 

// Приведение к нормальному бинарному формату

var outputFormatBinary = function(Arr, Mask) {                              
	var funcArr = Arr.join('').split('');
	var rez;

	funcArr.splice(8,0,".");
	funcArr.splice(17,0,".");
	funcArr.splice(26,0,".");
	if(Mask <= 8) funcArr.splice(Mask,0," | ");
	if(Mask > 8 && Mask <= 16) funcArr.splice(Mask+1,0," | ");
	if(Mask > 16 && Mask <= 24) funcArr.splice(Mask+2,0," | ");
	if(Mask > 24 && Mask <= 31) funcArr.splice(Mask+3,0," | ");

	var findLine = $.inArray(" | ", funcArr); // Поиск элемента в массиве
	if(funcArr[findLine - 1 ] == '.') funcArr.splice(findLine - 1,1);
	if(funcArr[findLine + 1 ] == '.') funcArr.splice(findLine + 1,1);

	rez = funcArr.join('');

	return rez;
};

var binaryToDecemal = function(Arr) {
	var decemalArr = [];
	var rez;

	for(var i = 0; i < Arr.length; i++) {
		decemalArr[i] = parseInt(Arr[i], 2);
	}

	rez = decemalArr.join('.');
	return	rez;
};

var dotFormat = function(Arr) {
	var rez = Arr;

	rez.splice(8,0,".");
	rez.splice(17,0,".");
	rez.splice(26,0,".");

	rez = rez.join('').split('.');

	return rez;
};

var compareArr = function(Arr) {
	var rez;
	for(var i = 0; i < Arr.length; i++) {
		if(Number(Arr[i]) == 1) rez = true;
		if(Number(Arr[i]) == 0) {
			rez = false;
			return rez;
		}
	}
	return true;
};

function IPinformation() {
	this.ipAddress = [];
	this.mask = 0;

	this.ipBinary;
	this.maskBinary;
	this.wildcardBinary;
	this.networkBinary;
	this.hostminBinary;
	this.hostmaxBinary;
	this.broadcastBinary;
}

// Получаю IP

IPinformation.prototype.getIp = function() {
	var ip = $('#ip_analiz').val();
	if(validIP(ip) == false) {
		return;
	}
	this.ipAddress = ip.split('.');
}

// Получаю Маску

IPinformation.prototype.getMask = function() {
	var mask = $('#mask_analiz').val();

	if(validMask(mask) == false) {
		return false;
	}
	this.mask = Number(mask);	
}

// Вывод IP, десятичный шестнадцатиричный двоичный фаорматы

IPinformation.prototype.outIp = function() {
	this.ipBinary = toBinary(this.ipAddress);

	$('#address_decimal').text(binaryToDecemal(this.ipBinary));
	$('#address_hexadecimal').text(toHexadecimal(this.ipBinary));
	$('#address_binary').text(outputFormatBinary(this.ipBinary, this.mask));
}

// Вывод маски, десятичный и двоичный формат

IPinformation.prototype.outMask = function() {
	$('#mask_decimal').text(this.mask);
	var maskArr = [];

	for(var i = 0; i < this.mask; i++) {
		maskArr[i] = 1;
	}
	for(var j = this.mask; j < 32; j++) {
		maskArr[j] = 0;
	}

	this.maskBinary = dotFormat(maskArr);  

	var mask = outputFormatBinary(this.maskBinary, this.mask);
	$('#mask_binary').text(mask);
}

// Вывод netmask

IPinformation.prototype.outNetmask = function() {
	$('#netmask_decemal').text(binaryToDecemal(this.maskBinary));
	$('#netmask_hexadecimal').text(toHexadecimal(this.maskBinary));
	$('#netmask_binary').text(outputFormatBinary(this.maskBinary, this.mask));
}

// Dывод wildcard

IPinformation.prototype.outWildcard = function() {
	var mask = this.maskBinary.join('').split('');

	for(var i = 0; i < mask.length; i++) {
		if(Number(mask[i]) == 1){
			mask[i] = 0;	
		} else {
			mask[i] = 1;
		} 
	}

	this.wildcardBinary = dotFormat(mask);

	$('#wildcard_decemal').text(binaryToDecemal(this.wildcardBinary));
	$('#wildcard_hexadecimal').text(toHexadecimal(this.wildcardBinary));
	$('#wildcard_binary').text(outputFormatBinary(this.wildcardBinary, this.mask));
}

// Dывод outNetwork
 
IPinformation.prototype.outNetwork = function() {
	var ipArr, maskArr, rez = [];

	ip = this.ipBinary.join('').split('');
	mask = this.maskBinary.join('').split('');

	for(var i = 0; i < mask.length; i++) {
		if(Number(mask[i]) == 1){
			rez[i] = ip[i];
		} else {
			rez[i] = 0;
		}
	}
	
	this.networkBinary = dotFormat(rez);

	$('#network_decemal').text(binaryToDecemal(this.networkBinary));
	$('#network_hexadecimal').text(toHexadecimal(this.wildcardBinary));
	$('#network_binary').text(outputFormatBinary(this.networkBinary, this.mask));
}

// Вывод outHostMin

IPinformation.prototype.outHostMin = function() {
	var ipArr = this.networkBinary[3];
	ipArr = parseInt(ipArr, 2);
	ipArr = ipArr + 1;
	ipArr = ipArr.toString(2);

	var zero = "0";
	if(ipArr.length < 8){
		for(var i = 1; i < 8 - ipArr.length; i++) {
			zero += "0";
		}
		ipArr = zero + ipArr;
	}

	this.hostminBinary = this.networkBinary;
	this.hostminBinary[3] = ipArr;

	$('#hostmin_decemal').text(binaryToDecemal(this.hostminBinary));
	$('#hostmin_hexadecimal').text(toHexadecimal(this.hostminBinary));
	$('#hostmin_binary').text(outputFormatBinary(this.hostminBinary, this.mask));
}

// Вывод outHostMax

IPinformation.prototype.outHostMax = function() {
	var ip = this.ipBinary.join('').split('');
	var mask = this.maskBinary.join('').split('');

	for(var i = 0; i < mask.length; i++) {
		if(mask[i] == 1) continue;
		if(mask[i] == 0) ip[i] = "1";
	}

	ip[31] = 0;

	this.hostmaxBinary = dotFormat(ip);

	$('#hostmax_decemal').text(binaryToDecemal(this.hostmaxBinary));
	$('#hostmax_hexademical').text(toHexadecimal(this.hostmaxBinary));
	$('#hostmax_binary').text(outputFormatBinary(this.hostmaxBinary, this.mask));
}

// Вывод broadcast

IPinformation.prototype.outBroadcast = function() {
	var ip = this.ipBinary.join('').split('');
	var mask = this.maskBinary.join('').split('');

	for(var i = 0; i < mask.length; i++) {
		if(mask[i] == 1) continue;
		if(mask[i] == 0) ip[i] = "1";
	}

	this.broadcastBinary = dotFormat(ip);

	$('#broadcast_decemal').text(binaryToDecemal(this.broadcastBinary));
	$('#broadcast_hexademical').text(toHexadecimal(this.broadcastBinary));
	$('#broadcast_binary').text(outputFormatBinary(this.broadcastBinary, this.mask));	
}

// Вывод количества хостов

IPinformation.prototype.outHosts = function() {
	var mask = this.maskBinary.join('').split('');
	var num = 0;
	for(var i = 0; i < mask.length; i++) {
		if(mask[i] == 0) num++;
		if(mask[i] == 1) continue;
	}

	num = Math.pow(2, num) - 2;
	$('#hosts_decemal').text(num);
}

$(function(){
	var ipInformation = new IPinformation();
	$('#ip_analiz_btn').click(function(){
		try{
			ipInformation.getIp();
			ipInformation.getMask();
		} catch(e) {
			console.log(e);
			return;
		}
		ipInformation.outIp();
		ipInformation.outMask();
		ipInformation.outNetmask();
		ipInformation.outWildcard();
		ipInformation.outNetwork();
		ipInformation.outHostMin();
		ipInformation.outHostMax();
		ipInformation.outBroadcast();
		ipInformation.outHosts();
	});
});
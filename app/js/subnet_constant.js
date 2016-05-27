function subnetConstant() {
	this.ip;
	this.ipNwtwork;

	this.mask;
	this.maskBinary = [];

	this.subnetNumber;
	this.subnetNumberBinary = [];

	this.newIpSubnets;
	this.newDecemalMask;
	this.newBinaryMask;
	this.newMaskDecemalFull;
	this.sizeNewSubnet;

	this.rangeMinAddress = [];
	this.rangeMaxAddress = [];
}

subnetConstant.prototype.getIpConstatnt = function() {
	var ip = $('#ip_subnet_constant').val();
	if(validIP(ip) == false) {
		return;
	}
	this.ip = ip.split('.');
}

subnetConstant.prototype.getMaskConstatnt = function() {
	var mask = $('#mask_subnet_constant').val();

	if(validMask(mask) == false) {
		return false;
	}

	this.mask = Number(mask);

	for(var i = 0; i < 32; i++) {
		if(i < this.mask) this.maskBinary[i] = "1";
		else this.maskBinary[i] = "0";
	}
}

subnetConstant.prototype.getSubnetNumber = function() {
	var reg = /^\d+$/;
	var subnetCh = $('#amount_constant').val();
	if(reg.test(subnetCh) == false) {
		alert("Введено некореткное значение количества подсетей.");
		throw new SyntaxError("Введено некореткное значение количества подсетей.");
		return false;
	}
	this.subnetNumber = Number(subnetCh);
	this.subnetNumberBinary = (this.subnetNumber).toString(2);
}

subnetConstant.prototype.subnetConstant = function() {
	var binarySubLength = this.subnetNumberBinary.length;       // длинна количества подсетей в битах
	var maskB = this.maskBinary;						        // маска в двуичном представлении
	var newMask = this.subnetNumberBinary.length + this.mask;   // количество бит в новой маске
	var ipNewSubnet = this.ip;									// ip адресс 
	this.newDecemalMask = newMask;

	if(newMask > 32){
		alert('Разбиение не возможно');
		throw new Error("Разбиение не возможно");
	}

	for(var j = 0; j < binarySubLength; j++) {
		maskB.splice(0,0,"1");
	}	

	maskB.splice(maskB.length - binarySubLength, binarySubLength);
	maskB = dotFormat(maskB);
	this.newBinaryMask = maskB;
	
	if(this.mask > 0 && this.mask <= 8){ 
		ipNewSubnet[1] = 0;
		ipNewSubnet[2] = 0;
		ipNewSubnet[3] = 0;
	}
	if(this.mask >= 9 && this.mask <= 16){
		ipNewSubnet[2] = 0;
		ipNewSubnet[3] = 0;	
	}
	if(this.mask >= 17 && this.mask <= 24){
		ipNewSubnet[3] = 0;
	}

	this.ipNwtwork = ipNewSubnet.join('.');

	var trigger;
	if(newMask > 0 && newMask <= 8){ trigger = 0; }
	if(newMask >= 9 && newMask <= 16){ trigger = 1;	}
	if(newMask >= 17 && newMask <= 24){ trigger = 2; }
	if(newMask >= 25 && newMask <= 32){ trigger = 3; }

	var step = maskB[trigger].split("");
	var num = 0;

	for (var j = 0; j < step.length; j++) {
		if(Number(step[j]) == 1) { 
			num++; 
		}
	}

	if(newMask == 8 || newMask == 16 || newMask == 24) {       // Добавляем бит если совпало с 8, 16 или 24
		step = 128;
		this.sizeNewSubnet = step;
		trigger++;
	}else {
		step.splice(0,num);
		step.splice(0,0,"1");
		step = step.join('');
		step = parseInt(step, 2);
		this.sizeNewSubnet = step;
	}
	if(this.subnetNumber == 2) {                               // Если нужно разбить весь диапазон на 2 подсети
		step = 128;
		this.sizeNewSubnet = step;
	}

	var newIpSubnetsArr = [];
	newIpSubnetsArr[0] = ipNewSubnet.join('.');


	for(var i = 0; i < this.subnetNumber - 1; i++) {

		if(trigger == 3 && step + ipNewSubnet[trigger] < 254) { ipNewSubnet[trigger] = step + Number(ipNewSubnet[trigger]); newIpSubnetsArr[i+1] = ipNewSubnet.join('.'); continue; }
		if(trigger == 3 && step + ipNewSubnet[trigger] >= 254) {
			if(Number(ipNewSubnet[trigger - 1]) + 1 < 254) {  ipNewSubnet[trigger - 1] = Number(ipNewSubnet[trigger - 1]) + 1; ipNewSubnet[trigger] = 0; }
			else {
				if(Number(ipNewSubnet[trigger - 2]) + 1 < 254) { ipNewSubnet[trigger - 2] = Number(ipNewSubnet[trigger - 2]) + 1; ipNewSubnet[trigger - 1] = 0; }
				else {
					if(Number(ipNewSubnet[trigger - 3]) + 1 < 254) { ipNewSubnet[trigger - 3] = Number(ipNewSubnet[trigger - 3]) + 1; ipNewSubnet[trigger - 2] = 0; }
					else {
						throw new Error("Разбиение не возможно");
					}
				}
			}
		}

		if(trigger == 2 && step + Number(ipNewSubnet[trigger]) < 254) { ipNewSubnet[trigger] = step + Number(ipNewSubnet[trigger]); newIpSubnetsArr[i+1] = ipNewSubnet.join('.'); continue; }
		if(trigger == 2 && step + Number(ipNewSubnet[trigger]) >= 254) {
			if(Number(ipNewSubnet[trigger - 1]) + 1 < 254) { ipNewSubnet[trigger - 1] = Number(ipNewSubnet[trigger - 1]) + 1; ipNewSubnet[trigger] = 0; }
			else {
				if(Number(ipNewSubnet[trigger - 2]) + 1 < 254) { ipNewSubnet[trigger - 2] = Number(ipNewSubnet[trigger - 2]) + 1; ipNewSubnet[trigger - 1] = 0; }
				else { 
					throw new Error("Разбиение не возможно"); 
				}
			}
		}
		if(trigger == 1 && step + Number(ipNewSubnet[trigger]) < 254) { ipNewSubnet[trigger] = step + Number(ipNewSubnet[trigger]); newIpSubnetsArr[i+1] = ipNewSubnet.join('.'); continue; }
		if(trigger == 1 && step + Number(ipNewSubnet[trigger]) >= 254) {
			if(Number(ipNewSubnet[trigger - 1]) + 1 < 254) { ipNewSubnet[trigger - 1] = Number(ipNewSubnet[trigger - 1]) + 1; ipNewSubnet[trigger] = 0; }
			else {
				throw new Error("Разбиение не возможно");
			}
		}

		if(trigger == 0 && step + Number(ipNewSubnet[trigger]) < 254) { ipNewSubnet[trigger] = step + Number(ipNewSubnet[trigger]); newIpSubnetsArr[i+1] = ipNewSubnet.join('.'); continue; }
		if(trigger == 0 && step + Number(ipNewSubnet[trigger]) >= 254) {
			if(Number(ipNewSubnet[trigger]) > 254) { throw new Error("Разбиение не возможно"); }
		}
		newIpSubnetsArr[i+1] = ipNewSubnet.join('.'); 	
	}
	this.newIpSubnets = newIpSubnetsArr;


	for(var i = 0; i < this.subnetNumber; i++) {
		var buffRangeMinAddress = this.newIpSubnets[i].split('.');
		var buffRangeMaxAddress = this.newIpSubnets[i].split('.');

		if(trigger == 3){ 
			buffRangeMinAddress[3] = Number(buffRangeMinAddress[3]) + 1;  
			this.rangeMinAddress[i] = buffRangeMinAddress.join('.');

			buffRangeMaxAddress[3] = Number(buffRangeMaxAddress[3]) + step - 2;
			this.rangeMaxAddress[i] = buffRangeMaxAddress.join('.');
		}
		if(trigger == 2){ 
			buffRangeMinAddress[3] = 1;  
			this.rangeMinAddress[i] = buffRangeMinAddress.join('.'); 

			buffRangeMaxAddress[3] = 254;
			buffRangeMaxAddress[2] = Number(buffRangeMaxAddress[2]) + step - 1;
			this.rangeMaxAddress[i] = buffRangeMaxAddress.join('.')
		}
		if(trigger == 1){ 
			buffRangeMinAddress[3] = 1;  
			this.rangeMinAddress[i] = buffRangeMinAddress.join('.'); 

			buffRangeMaxAddress[3] = 255; 
			buffRangeMaxAddress[2] = 254;
			buffRangeMaxAddress[1] = Number(buffRangeMaxAddress[1]) + step - 1; 

			this.rangeMaxAddress[i] = buffRangeMaxAddress.join('.')}
		if(trigger == 0){ buffRangeMinAddress[3] = 1;  this.rangeMinAddress[i] = buffRangeMinAddress.join('.'); buffRangeMaxAddress[3] = 255; buffRangeMaxAddress[2] = 255; buffRangeMaxAddress[1] = 254; this.rangeMaxAddress[i] = buffRangeMaxAddress.join('.')}	
	}
}

subnetConstant.prototype.outTable = function() {
	this.newMaskDecemalFull = binaryToDecemal(this.newBinaryMask);

	var mask = this.newBinaryMask.join('').split('');
	var num = 0;
	for(var i = 0; i < mask.length; i++) {
		if(mask[i] == 0) num++;
		if(mask[i] == 1) continue;
	}

	num = Math.pow(2, num) - 2;
	this.allocatedSize = num;

	for(var i = 0; i < this.newIpSubnets.length; i++){
		$("#table_constatnt").append('<tr><td>'+ (i+1) +'</td><td>'+this.allocatedSize+'</td><td>'+ this.newIpSubnets[i] +'</td><td>/'+this.newDecemalMask+'</td><td>'+ this.newMaskDecemalFull +'</td><td>'+ this.rangeMinAddress[i] +' - '+ this.rangeMaxAddress[i] +'</td></tr>'); 
	}
}

subnetConstant.prototype.wildcard = function(){
	var mask = this.newBinaryMask.join('').split('');
	for(var i = 0; i < mask.length; i++) {
		if(Number(mask[i]) == 1){
			mask[i] = 0;	
		} else {
			mask[i] = 1;
		} 
	}
	mask = dotFormat(mask);
	mask = binaryToDecemal(mask);
	return mask;
}

subnetConstant.prototype.outInformation = function() {
	$('#info_netw').append('Исходная сеть: <b>'+this.ipNwtwork+' / '+this.mask+'</b>');
	$('#info_chosts').append('Количество доступных хостов в каждой подсети: <b>'+ this.allocatedSize +'</b>');
	$('#info_newmask').append('Новая маска: <b>'+ this.newMaskDecemalFull +'</b> или <b>' + this.newDecemalMask +'</b>');
	$('#info_wildcar').append('Обратная маска: <b>' + this.wildcard() +'</b>');
}

$(function(){
	var subConst = new subnetConstant();
	$('#calculate_subneting_consstant_btn').click(function(){
		try{
			subConst.getIpConstatnt();
			subConst.getMaskConstatnt();
			subConst.getSubnetNumber();
			subConst.subnetConstant();
			subConst.outTable();
			subConst.outInformation();
			$('.indicator_subnet_constant').text('Разбиение выполнено успешно').removeClass('text-danger').addClass('text-success').show();
		} catch(e) {
			console.log(e);
			$('.indicator_subnet_constant').text('Разбиение невозможно').removeClass('text-success').addClass('text-danger').show();
			return;
		}
	});
});
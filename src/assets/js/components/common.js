module.exports = {

	/**
	* Generate a random id for the object
	*/
	uniqueId: function() {
		var unum = Math.floor((1 + Math.random()) * 0x10000);
		var unumstr = unum.toString(16);
		//console.log(unumstr);
		return unumstr;
	}

}
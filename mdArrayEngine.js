/************************************************************************************
*	Javascript Class		~ KROMOSOME.MDArrayEngine								*
*	File name				~ mdArrayEngine.js										*
*	File date				~ 20 April 2011											*
*	Version					~ 2.0													*
*	Developers web address	~ http://www.kromosome.net								*
*	Email					~ matgarland at hotmail.com								*
*************************************************************************************
*	PURPOSE: A class to manage the interaction of Javascript multi dimensional		*
*	arrays.																			*
*************************************************************************************
*	You are free to use this class as you see fit. Please contact me with any		*
*	improvements and additions that you would like included so they can be shared	*
*	with the developer community													*
*************************************************************************************
*	Dual licensed under the MIT and GPL licenses, copies of which can be viewed at	*
*	http://www.opensource.org/licenses/mit-license.php								*
*	http://www.gnu.org/licenses/gpl.html											*
*************************************************************************************
*		   ~		You may delete comments from this point on			~			*
*************************************************************************************
*					~		  Release Notes				~							*
*	version 2.0 released 20 April 2011: Rewrote in OO style							*
*	version 1.0 released 28 July 2010: Added column_Arithmetic_Sum_SingleCondition()*
*	version 0.5 released 07 July 2010: First Release								*
************************************************************************************/

/************************************************************************************
*					~		  Class dependencies		 ~							*
************************************************************************************/

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt)
	{
		var len = this.length;
	
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
		if (from < 0) from += len;
	
		for (; from < len; from++)
		{
			if (from in this && this[from] === elt) return from;
		}
		return -1;
	}
}
if (!Array.prototype.find)
{
	Array.prototype.find = function(searchStr)
	{
		var returnArray = false;
		for (i=0; i<this.length; i++)
		{
			if (typeof(searchStr) == 'function')
			{
				if (searchStr.test(this[i]))
				{
					if (!returnArray)
					{ 
						returnArray = [];
					}
					returnArray.push(i);
				}
			}
			else
			{
				if (this[i]===searchStr)
				{
					if (!returnArray)
					{
						returnArray = [];
					}
					returnArray.push(i);
				}
			}
		}
		return returnArray;
	}
}
/************************************************************************************
*					An imlpementation of a namespacing method						*
*					to allow custom namespaces										*
************************************************************************************/
if (typeof KROMOSOME == "undefined" || !KROMOSOME) {
        var KROMOSOME = {};
}
KROMOSOME.namespace = function () {
    var a = arguments,
        o = null,
        i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = ("" + a[i]).split(".");
        o = KROMOSOME;
        for (j = (d[0] == "KROMOSOME") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
}
/************************************************************************************
*					KROMOSOME.MDArrayEngine Class									*
************************************************************************************/
KROMOSOME.namespace("KROMOSOME.MDArrayEngine");
KROMOSOME.MDArrayEngine = function () {
	//"private" variables:
	tMultiArray = [];
	t = [];
	// public functions
	return  {
		/************************************************************************************
		*	@function: 	init()																*
		*	@return: 	(int) array Length													*
		*	@purpose: 	to initialize the array												*
		*************************************************************************************
		*	@usage:																			* 
		*	var a = MDArrayEngine;															*
		*	a.init();																		*
		************************************************************************************/
		init: function(){
			tMultiArray = [];
			tMultiArray.push([]);
			return this.getLength();
		},
		/************************************************************************************
		*	@function: 	getLength()															*
		*	@return: 	(int) array length													*
		*	@purpose: 	to return the length of the array									*
		************************************************************************************/
		getLength: function(){
			return tMultiArray.length-1;
		},
		/************************************************************************************
		*	@function: 	getRowLength()														*
		*	@return: 	(int) length of array row											*
		*	@purpose:	to return the length of the row passed								*
		************************************************************************************/
		getRowLength: function(row){
			return tMultiArray[row].length;
		},
		/************************************************************************************
		*	@function: 	pushValue(v)														*
		*	@args:		(array) OR (string) value to add to array							*
		*	@return:	(int) length of array												*
		*	@purpose: 	push string or array of values onto the end of the array.			* 
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	var b = a.push([1,2,3,'argue',4,5,6,7,8,9,10,11,12]);							*
		*	var b = a.push(['test','try','alerts','Ã…Å¾ok olmuÃ…Å¸','34',34,34,34,34,34,34,34]);*
		*	var c = a.push('test,try,alert(\"hi there\");,test,34,34,34,34,34,34,34,34');	*
		*	var str = "1,2,3,4,5,6";														*
		*	a.pushValue(str);																*
		*************************************************************************************/
		pushValue: function(v){
			t = typeof(v) === 'string' ? v.split(",") : v;
			tMultiArray.push([]);
			var idx = this.getLength();
			for(var i = 0, j = t.length; i < j; ++i)
			{
				tMultiArray[idx].push(t[i]);
			}
			return this.getLength();
		},
		/************************************************************************************
		*	@function: 	rowPush((string or array) searchValue, (array) addValues)			*
		*	@args:		(array) OR (string) value to add to array							*
		*	@return:	(bool) true OR false												*
		*	@purpose: 	Add array items to an existing row where the searchValue matches.	* 
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	a.push(['needle',2,3,'argument',4,5,6,7,8,9,10,11,12]);							*
		*	a.push(['test','try','alerts','Ã…Å¾ok olmuÃ…Å¸','34',34,34,34,34,34,34,34]);	*
		*	a.push(['mat','rat','alert(\"hi there\");','test',34,34,34,34,34,34,34,34]);	*
		*	var pushRow = a.rowPush('needle', ['New Row Data','07/07/2010','12:00:00']);	*
		*	alert('rowpush success : ' + pushRow);											*
		*	var d = a.dump();																*
		*	document.write(d);																*
		*************************************************************************************/
		rowPush: function(searchValue, addValues){
			t = typeof(addValues) == 'string' ? addValues.split(",") : addValues;
			var idx = this.indexOfValue(searchValue);
			if( idx != -1 )
			{
				for(var i = 0, j = t.length; i < j; i++)
				{
					tMultiArray[idx[0][0]].push(t[i]);
				}
				return true;
			}
			else
			{
				return false;
			}
		},
		/************************************************************************************
		*	@function: 	indexOfValue(v)														*
		*	@args:		(array) OR (string) value to search for								*
		*	@return:	(int) -1 if the value is NOT found									*
		*				(array) row / column index of value in array if value IS found		* 
		*	@purpose: 	to return the array position of a searched value					* 
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	index = a.indexOfValue('test');													*
		*	alert(index);																	*
		*	// output example: 2,1															*
		*	returns: -1 for false (not found) or an array with the row / column indexes		*
		*************************************************************************************/
		indexOfValue: function(v){
			t = [];
			rowLen = this.getLength();
			for( var i = 0, j = rowLen; i < j; i++ )
			{
				var index = tMultiArray[i].indexOf(v);
				if( this.index !== -1 )
				{
					t.push([]);
					t[0][0] = i;
					t[0][1] = index;
					return t;
				}
			}
			return index;
		},
		/************************************************************************************
		*	@function: findIndexOfValue(v)													*
		*	@args:		(array) OR (string) OR (regular expression value to search for		*
		*	@return:	(int) -1 if the value is NOT found									*
		*				(array) row / column index of value in array if value IS found		* 
		*	purpose: 	to implement an array search that accepts regular expressions as	*
		*				the search argument (implements the Array.find prototype)	 		*
		************************************************************************************/
		findIndexOfValue: function(v){
			t = [];
			rowLen = this.getLength();
			for( var i = 0; i < rowLen; i++ )
			{
				var index = tMultiArray[i].find(v);
				if( index !== -1 )
				{
					t.push([]);
					t[0][0] = i;
					t[0][1] = index;
					return t;
				}
			}
			return index;
		},
		getValue: function(iRow,iCol){
			return tMultiArray[iRow][iCol];
		},
		setValue: function(iRow,iCol, data){
			tMultiArray[iRow][iCol] = data;
			return true;
		},
		/************************************************************************************
		*	@function: getRow(iRow)															*
		*	@args:		(int) row to return													*
		*	@return:	(array) row data													*
		*************************************************************************************
		*	@purpose: to return a value from the array matching the supplied row number		*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	alert( a.getRow(1) ); 															*
		*************************************************************************************/
		getRow: function(iRow){
			return tMultiArray[iRow];
		},
		/************************************************************************************
		*	@function: getAllValues()														*
		*	@return:	(array) array contents												*
		*************************************************************************************
		*	@purpose: to return the entire contents of the array as an array				*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	var b = a.getAllValues();														*
		*	alert(b[0][1]);																	*
		*************************************************************************************/
		getAllValues: function(){
			return tMultiArray;
		},
		/************************************************************************************
		*	function: upadteItem()															*
		*	@args:		(string) searchVal: item to search for								*
		*				(string) replaceVal: value to replace item							*
		*	@return:	(bool) true for success / false for failure							*
		*	@purpose: to enable a singular search and replace in the array 					*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	result = a.updateItem(2, 200);													*
		*	alert('result = ' + result);													*
		*************************************************************************************/
		updateItem: function(searchVal, replaceVal){
			t = [];
			t = this.indexOfValue(searchVal);
			a = tMultiArray[t[0][0]].splice(t[0][1], 1, replaceVal);
			if( a == searchVal )
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		/************************************************************************************
		*	@function: upadteRow(searchVal, replaceVal)										*
		*	@args:		(string) searchVal: item to search for								*
		*				(string) OR (array) replaceVal: value to replace item				*
		*	@return:	(bool) true for success / false for failure							*
		*	@purpose: to enable a row replace in the array based on the searchVal parameter *
		*	The row with the first resulting match for searchVal will be replaced with the	*
		*	data supplied in replaceVal, much like an SQL update statement.					*
		*	Returns: true for success, false for failure									*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	// add an array element															*
		*	a.push(['needle',2,3,'argument',4,5,6,7,8,9,10,11,12]);							*
		*	result = a.updateRow('needle', ['New Row Data','12/12/2011','14:00:00']);		*
		*	document.write(a.arrayDump());													*
		*************************************************************************************/
		updateRow: function(searchVal, replaceVal){
			t = [];
			t = typeof(replaceVal) == 'string' ? replaceVal.split(",") : replaceVal;
			var index = this.indexOfValue(searchVal);
			var replaced = tMultiArray[index[0][0]].splice(0, tMultiArray[index[0][0]].length, t[0]);
			for(var i = 1, j = t.length; i < j; i++ )
			{
				tMultiArray[index[0][0]].push(t[i]);
			}
			if( (tMultiArray[index[0][0]].length == t.length) && (tMultiArray[index[0][0]].indexOf(searchVal) == -1) )
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		deleteRow : function(row){
			row = parseInt(row);
			var a = tMultiArray[row].splice(0, this.getRowLength(row)+1);
			return a;
		},
		/************************************************************************************
		*	@function: updateRow_DualCondition(condition1, condition2, updateData)			*
		*	@args:		(string) condition1: 1st conditional								*
		*				(string) condition2: 2nd conditional								*
		*	@return:	(bool) true for success / false for failure							*
		*************************************************************************************
		*	@purpose: updates differences in matching row with data from updateData			*
		*	or inserts a new row if no match found on search condition1 & condition2		*
		*	Returns true for success, false for failure										*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	a.push(['needle',2,3,'argument',4,5,6,7,8,9,10,11,12]);							*
		*	var arr = ['cat','sat',1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];				*
		*	var t = a.updateRow_DualCondition('needle', 'argument', arr);					*
		*	document.write(a.arrayDump());													*
		*************************************************************************************/
		updateRow_DualCondition : function(condition1, condition2, updateData){
			if( updateData instanceof Array )
			{
				if( this.getLength() )
				{
					var idx1 = this.indexOfValue(condition1);
					if( idx1 != -1 )
					{
						var row = idx1[0][0];
						var idx2 = this.indexOfValue(condition2, row);
						if( row === idx2[0][0] )
						{
							var len = updateData.length;
							for(var i = 0; i < len; i++)
							{
								if( (this.getValue(row,i) !== updateData[i]) && (this.getValue(row,i) != 'undefined') )
								{
									this.setValue(row,i, updateData[i]);
								}
							}
						}
						else
						{
							this.pushValue(updateData);
						}
					}
					else
					{
						this.pushValue(updateData);
					}
				}
				else
				{
					this.init();
					this.pushValue(updateData);
				}
				return true;
			}
			return false;
		},
		/************************************************************************************
		*	@function: 	column_Arithmetic_Sum_SingleCondition(conditionalColumn, value,		*
		*				 columnToAdd)														*
		*	@args:		(int) conditionalColumn: 1st conditional 							*
		*				(num) value: value of conditionalColumn	to match					*
		*				(int) columnToAdd: the column which we will perform arithmetic on	*
		*	@return:	(bool) true for success / false for failure							*
		*	@purpose: to sum the values of the columnToAdd WHERE conditionalColumn = x		*
		*	AND conditionalColumn value = y. Returns the result of the addition				*			
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	var ret = a.column_Arithmetic_Sum_SingleCondition(0, 22, 3);					*
		*************************************************************************************/
		column_Arithmetic_Sum_SingleCondition : function(conditionalColumn, value, columnToAdd){
			var result = 0;
			var rowLen = this.getLength()+1;
			for (var iRow = 0; iRow < rowLen; iRow++ )
			{
				var colLen = this.getRowLength(iRow);
				for(var iCol = 0; iCol < colLen; iCol++ )
				{
					if( (iCol == conditionalColumn) && (this.getValue(iRow,iCol) == value) )
					{ 
						result += parseInt(this.getValue(iRow,columnToAdd));
					}
				}
			}
			return result;
		},
		/************************************************************************************
		*	@function: 	arrayDump()															*
		*	@return:	(string) html string which contains data and view to display		*
		*	@purpose: 	to display the entire contents of the array as an html table		*
		*************************************************************************************
		*	@usage: 																		*
		*	var a = MDArrayEngine;															*
		*	a.push([1,2,3,'argue',4,5,6,7,8,9,10,11,12]);									*
		*	a.push(['test','try','alerts','Ãƒâ€¡aÃ„Å¸daÃ…Å¸','34',34,34,34,34,34,34,34]);	*
		*	a.push(['mat','rat','alert(\"hi there\");','test',34,34,34,34,34,34,34,34]);	*
		*	var  d = a.arrayDump();															*
		*	document.write(d);																*
		*************************************************************************************/
		arrayDump: function(){
			t = [];
			var rowLen = this.getLength()+1;
			t.push('<div id="visualization"></div>');
			t.push('<form><input type="button" value="Print this page" onClick="window.print()"></form><hr><br /><br />');
			t.push('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
			t.push('<tr><td>Row</td> <td>Column</td> <td>Array Value</td> </tr>');
			t.push('<tr><td>&nbsp;</td> <td>&nbsp;</td> <td>&nbsp;</td> </tr>');
			for (var iRow = 0; iRow < rowLen; iRow++ )
			{
				var colLen = this.getRowLength(iRow);
				for(var iCol = 0; iCol < colLen; iCol++ )
				{
					t.push('<tr><td>' + iRow + '</td> <td>' + iCol + '</td> <td>' + tMultiArray[iRow][iCol] + '</td> </tr>');
				}
			}
			return '<table>' + String.fromCharCode(10) + t.join(String.fromCharCode(10)) + String.fromCharCode(10) + '</table>';
		}
	};
 
}();

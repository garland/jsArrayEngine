/********************************************************
 * jQuery Plugin: {css}designerGrid						*
 * File name: jquery-designerGrid-1.7.5.js				*
 * http://www.kromosome.net/cssdesignergrid				*
 *														*
 * Copyright (c) 2010, Mathew Garland					*
 * e: matgarland@hotmail.com							*
 *														*
 * Please contact me for any suggestions, alternatively *
 * through the jQuery plugins page for registering bugs	*
 * or feature requests.									*
 *														*
 * Dual licensed under the MIT and GPL licenses:		*
 * http://www.opensource.org/licenses/mit-license.php	*
 * http://www.gnu.org/licenses/gpl.html					*
 *														*
 *********You may delete comments past this point!*******
 *														*
 * Release Version 1.7.5: Friday 26th February 2010		*
 * Release Version 1.7.0: Tuesday 16th February 2010	*
 * Release Version 1.6.0: Monday 15th February 2010		*
 * Release Version 1.5.0: Thursday 11th February 2010	*
 * Release Version 1: Monday 8th February 2010			*
 ********************************************************
 * Version 1.7.5 release notes:							*
 ********************************************************
 * Bug Fix: Fixed 'Columns are incorrectly centred' bug.*
 * Calculation was for number of columns x the gutter   *
 * width but is now number of columns by the gutter 	*
 * width -1 (there is always 1 less gutter than number  *
 * of columns)											*
 ********************************************************
 * Version 1.7.0 release notes:							*
 ********************************************************
 * Improvements:										*
 * Added more control panel features allowing user		*
 * run-time customisations. Added canvas click / 		*
 * coordinate feedback when grid z-index is toggled to 	*
 * top.	New override: grid_Z_index						*
 ********************************************************
 * Version 1.6.0 release notes:							*
 ********************************************************
 * Bug fix: Rectified incorrect mathematical 			*
 * calculations											*
 ********************************************************
 * Version 1.5.0 release notes:							*
 ********************************************************
 * Code clean up and modularization;					*
 * Eradicated unnecessary overrideable variables;		*
 * Addded additional overrideable variables				*
 ********************************************************/
;(function($)
{
	$.fn.designerGrid = function(options)
	{
		// designerGrid overrideable defaults
		var defaults =
		{
			docWidth 		: $(document).width(), 		// width of document to emulate
			docHeight 		: $(document).height(), 	// height of the document to emulate
			opacity			: 0.75,						// sets the canvas opacity
			centred 		: true, 					// centre the layout
			colCount 		: 2,						// number of columns for document
			colColor		: '#FF3',					// positioning column HEX color
			colWidth 		: 400,						// width of positioning columns
			col_Z_index		: -9999,					// z-index of positioning columns
			grid_Z_index	: -9999,					// z-index of canvas grid lines
			colHeight 		: $(document).height(),		// height of columns
			gutter 			: 20,						// column gutters
			marginLeft 		: 100,						// left margin
			marginTop 		: 20						// top margin
		};
		var opts = $.extend(defaults, options); 
		
		/******************************************************************/
		return this.each(function()
		{
			configureLayout(opts);
			configureEvents(opts);
			/*****************************************/
			// initialise the designer_grid canvas
			var context = initCanvas('designer_grid');
			setupGrid(context, opts);
			setupRulers(context, opts);
			/*****************************************/
			setStartPos(opts);
			// initialise the column_layout canvas
			context = initCanvas('column_layout');
			drawColumns(context, opts);
			/*****************************************/
			drawIndicators(context, opts);
		});
		
		/******************************************************************
		*	Private: configureLayout(opts)
		*	Purpose: configures the canvas css & defines grid toggle function 
		*	accepts: overrideable options
		*	returns: nil
		/******************************************************************/
		function configureLayout(opts)
		{
			// add in the designer_grid div to the calling document's body element
			$('body').append('<canvas id="designer_grid" width= ' + opts.docWidth + ' height= ' + opts.docHeight + '></canvas>');
			$('#designer_grid').css({'left': '0.5px'}).css({'top': '0.5px'}).css({'position': 'absolute'})
				.css({'overflow': 'hidden'}).css({'z-index': ''+ opts.grid_Z_index +''}).css({'filter': 'alpha(opacity(='+ opts.opacity * 100 +')'})
				.css({'-moz-opacity': ''+ opts.opacity +''}).css({'-khtml-opacity': ''+ opts.opacity +''}).css({'opacity': ''+ opts.opacity +''});
				
			// add in the designer grid's canvas column layout element
			$('body').append('<canvas id="column_layout" width= ' + opts.docWidth + ' height= ' + opts.docHeight + '></canvas>');
			$('#column_layout').css({'left': '0.5px'}).css({'top': '0.5px'}).css({'position': 'absolute'})
				.css({'overflow': 'hidden'}).css({'z-index': ''+ opts.col_Z_index +''}).css({'filter': 'alpha(opacity(='+ opts.opacity * 100 +')'})
				.css({'-moz-opacity': ''+ opts.opacity +''}).css({'-khtml-opacity': ''+ opts.opacity +''}).css({'opacity': ''+ opts.opacity +''});
			
			// add the coordinates canvas!!!
			$('body').append('<canvas id="coords" width= ' + opts.docWidth + ' height= ' + opts.docHeight + '></canvas>');
			$('#coords').css({'left': '0.5px'}).css({'top': '0.5px'}).css({'position': 'absolute'})
				.css({'overflow': 'hidden'}).css({'z-index': '-10000'}).css({'filter': 'alpha(opacity(=100)'})
				.css({'-moz-opacity': '1.0'}).css({'-khtml-opacity': '1.0'}).css({'opacity': '1.0'});
				
			// add a control to toggle the design grid [on]/[off] with some basic document information
			$('body').append('<div id="designer_grid_status" align="center" width="400px" height="80px"><div id="designer_title" width="25px" height="40px">{css}designerGrid v: 1.7.5</div<br />W: '+opts.docWidth+'px | H: '+opts.docHeight+'px<div id="designer_grid_control" width="25px" height="40px">TOGGLE GRID [ON]/[OFF]</div><div id="designer_col_control" width="25px" height="40px">TOGGLE COLUMNS [ON]/[OFF]</div><div id="designer_index_control" width="25px" height="40px">TOGGLE GRID-Z-INDEX [+]/[-]</div></div>');

			// set the position of the {css}designerGrid Control Panel
			$('#designer_grid_status').css({'position': 'absolute'}).css({'background-color': '#A0CFEC'}).css({'padding': '5px'})
				.css({'font': 'bold 10px sans-serif'}).css({'display': 'block'}).css({'left': opts.docWidth-190})
				.css({'top': opts.docHeight -120}).css({'z-index': '99999'}).css({'border': 'outset'}).css({'border-color': '#717D7D'});
			// add the styling for the title
			$('#designer_title').css({'background-color': '#717D7D'}).css({'margin-top': '5px'}).css({'padding-left': '5px'})
				.css({'padding-right': '5px'}).css({'font-size': '1.15em'}).css({'font-weight': 'bold'});
			// add the designer grid toggle
			$('#designer_grid_control').css({'cursor': 'pointer'}).css({'background-color': '#717D7D'}).css({'margin-top': '5px'})
				.css({'padding-left': '5px'}).css({'padding-right': '5px'});
			// add the column toggle control
			$('#designer_col_control').css({'cursor': 'pointer'}).css({'background-color': '#717D7D'}).css({'margin-top': '5px'})
				.css({'padding-left': '5px'}).css({'padding-right': '5px'});
			// add the column z-index toggle control
			$('#designer_index_control').css({'cursor': 'pointer'}).css({'background-color': '#717D7D'}).css({'margin-top': '5px'})
				.css({'padding-left': '5px'}).css({'padding-right': '5px'});
		}
		
		/******************************************************************
		*	Private:	configureEvents(opts)
		*	purpose:	Add event functionality to control panel
		*	accepts:	overrideable options variable
		*	returns:	nil
		/******************************************************************/
		function configureEvents(opts)
		{
			$('#designer_grid_control')
				// add the grid toggle function to #designer_grid_control
				.bind('click', function($e)
				{
					$('#designer_grid').is(':visible') ? $('#designer_grid').fadeOut() : $('#designer_grid').fadeIn();
				});
			$('#designer_col_control')
				// add the grid toggle function to #designer_grid_control
				.bind('click', function($e)
				{
					$('#column_layout').is(':visible') ? $('#column_layout').fadeOut() : $('#column_layout').fadeIn();
				});
			$('#designer_index_control')
				// add the designer grid z-index toggle control behavior
				.bind('click', function($e)
				{
					$('#designer_grid').css('z-index') >=1 ? $('#designer_grid').css({'z-index': '-9999'}) : $('#designer_grid').css({'z-index': '9999'});
				});
			$('#designer_grid')
				.bind('mousedown', function(e)
				{
					var ctx = initCanvas('coords');
					ctx.strokeStyle = "#FF0000";
					ctx.fillStyle = "#FF0000";
					ctx.beginPath();
					ctx.moveTo(e.pageX, 0);
					ctx.lineTo(e.pageX, e.pageY);
					ctx.moveTo(0, e.pageY);
					ctx.lineTo(e.pageX, e.pageY);
					ctx.stroke();
					ctx.font = "10px arial";
					e.pageX <= 100 ? ctx.fillText('('+e.pageX+','+e.pageY+')', e.pageX + 10, e.pageY - 5) : ctx.fillText('('+e.pageX+','+e.pageY+')', e.pageX - 70, e.pageY - 5); 
				});
			$('#designer_grid')
				.bind('click', function(e)
				{
					var ctx = initCanvas('coords');
					ctx.clearRect(0, 0, opts.docWidth, opts.docHeight);
				});
		}
		/******************************************************************
		*	Private:	initCanvas($obj)
		*	purpose:	get a reference to the HTML 5 <canvas> element
		*	accepts:	canvas element to be initialized
		*	returns:	canvas drawing context
		/******************************************************************/
		function initCanvas($obj)
		{
			var canvas = document.getElementById($obj);
			var context = canvas.getContext('2d');
			return context;
		}
		/******************************************************************
		*	Private:	setupGrid($obj)
		*	purpose:	draws the horizontal & vertical grid lines to canvas
		*	accepts:	overrideable options variable
		*	returns:	nil
		/******************************************************************/
		function setupGrid(context, opts)
		{
			//	DRAW THE GRID LINES
			context.beginPath();	
			context.strokeStyle = "#eee";
			// draw the vertical grid lines
			for (var x = 0.5; x < opts.docWidth; x += 20)
			{
				context.moveTo(x - 0.5, 0);
				context.lineTo(x - 0.5, opts.docWidth);
			}
			// draw the horizontal grid lines
			for (var y = 0.5; y < opts.docHeight; y += 20)
			{
				context.moveTo(0, y - 0.5);
				context.lineTo(opts.docWidth, y - 0.5);
			}
			context.stroke();
		}
		/******************************************************************
		*	Private:	setupGrid(context, opts)
		*	purpose:	draws the grid rulers along top and left of document
		*	accepts:	canvas context, overrideable options
		*	returns:	nil
		/******************************************************************/
		function setupRulers(context, opts)
		{
			var output;
			//	DRAW INCREMENTAL MARKERS ALONG TOP OF DOCUMENT
			context.strokeStyle = "#000";
			// set the pen fill color and font
			context.fillStyle = "#000";
			context.font = "10px arial";
			for (var x = 0.5; x < opts.docWidth; x += 10)
			{
				context.beginPath();
				context.moveTo(x - 0.5, 0);
				if((x -0.5) % 100 == 0)
				{
					context.lineTo(x - 0.5, 10);
					context.stroke();
					output = ''+Math.floor(x)+'';
					//	****** IE does not provide native fillText() support,
					//	future use consider: http://code.google.com/p/canvas-text/ for alternative
					context.fillText(output, x -10, 17.5);
				}
				// normal incremental marker
				else
				{
					context.lineTo(x - 0.5, 5);
					context.stroke();
				}
			}
			//	DRAW INCREMENTAL MARKERS ALONG LEFT SIDE OF DOCUMENT
			context.strokeStyle = "#000";
			context.fillStyle = "#000";
			context.font = "10px arial";
			for (var y = 0.5; y < opts.docHeight; y += 10)
			{
				context.beginPath();
				context.moveTo(0, y - 0.5);
				if((y -0.5) % 100 == 0)
				{
					context.lineTo(10, y - 0.5)
					context.stroke();
					if(y > 100)
					{
						output = ''+Math.floor(y)+'';
						context.fillText(output, 12, y+3.5);
					}
				}
				else
				{
					context.lineTo(5, y - 0.5);
					context.stroke();
				}
			}	
		}
		/******************************************************************
		*	Private: setStartPos(opts)
		*	Purpose: sets the starting position for the first column
		*	accepts: overrideable options
		*	returns: startPos
		/******************************************************************/
		function setStartPos(opts)
		{
			var gutterTotal = 0;
			// if the columns are to be centred
			if(opts.centred == true)
			{
				// set the document's opts.gutters and starting position
				opts.colCount >= 2 ? gutterTotal = ((opts.gutter * (opts.colCount - 1))) : gutterTotal = opts.gutter;
				startPos = (((opts.docWidth - ((opts.colWidth * opts.colCount) + gutterTotal)) / 2));
			}
			// not centred
			else
			{
				// use marginLeft value for start point in case where the columns are not centred
				startPos = opts.marginLeft;
			}
		}
		/******************************************************************
		*	Private: drawColumns(context, opts)
		*	Purpose: draw the positioning columns
		*	accepts: drawing context, overrideable options
		*	returns: nil
		/******************************************************************/
		function drawColumns(context, opts)
		{
			context.fillStyle = opts.colColor;
			for(var i = 1; i < opts.colCount + 1; i++)
			{
				switch(i)
				{
					case 1: // column 1
					{
						context.fillRect(startPos, opts.marginTop, opts.colWidth, opts.colHeight);
						break;
					}
					case 2: // column 2
					{
						context.fillRect((startPos + opts.colWidth + opts.gutter), opts.marginTop, opts.colWidth, opts.colHeight);
						break;
					}
					default: //column >= 3
					{
						context.fillRect((startPos + (opts.colWidth * (i-1)) + (opts.gutter * (i -1))), opts.marginTop, opts.colWidth, opts.colHeight);
						break;
					}
				}
			}	
		}
		/******************************************************************
		*	Private: drawIndicators(context, opts)
		*	Purpose: draw the positioning indicators
		*	accepts: drawing context, overrideable options
		*	returns: nil
		/******************************************************************/
		function drawIndicators(context, opts)
		{
			//	Draw horizontal & vertical framing indicators for first left column		
			context.beginPath();
			context.strokeStyle = "#000";
			// draw horizontal line with arrow
			context.moveTo(0, opts.marginTop);
			context.lineTo(opts.docWidth, opts.marginTop);
			context.moveTo(opts.docWidth-5, opts.marginTop - 5);
			context.lineTo(opts.docWidth, opts.marginTop);
			context.lineTo(opts.docWidth-5, opts.marginTop + 5);
			// draw vertical line with arrow
			context.moveTo(startPos, 0);
			context.lineTo(startPos, opts.docHeight);
			context.moveTo(startPos + 5, opts.docHeight-5);
			context.lineTo(startPos, opts.docHeight);
			context.lineTo(startPos - 5, opts.docHeight-5);
			// fill the drawing object
			context.stroke();
		}
	};
})(jQuery);
		


/* Copyright (c) 2014 Alexandru Boboc
 * Droptabs v.1 Jquery Plugin
 * Tested with JQuery 1.10.1
 */

(function($) {

    $.fn.droptabs = function(o) {

		//Default options
		var s = $.extend({
			dropdownSelector		 	: "li.dropdown",
			dropdownMenuSelector		: "ul.dropdown-menu",
			dropdownTabsSelector		: "li",
			visibleTabsSelector			: ">li:not(.dropdown)",
			developmentId				: "dt-devInfo",
			autoArrangeTabs				: true,
			development					: false
        }, o);

        return this.each( function(  ) {
		
			var $container = $(this);
			var dropdown = $(s.dropdownSelector, this);
			var dropdownMenu = $(s.dropdownMenuSelector, dropdown);
			
			var $dropdownTabs = function () {
				return $(s.dropdownTabsSelector, dropdownMenu);			
			}
			
			var $visibleTabs = function () {
				return $(s.visibleTabsSelector, $container);
			}
			
			function getFirstHiddenElementWidth() {			
				var tempElem=$dropdownTabs().first().clone().appendTo($container).css("position","fixed");
				var hiddenElementWidth = $(tempElem).outerWidth();
				$(tempElem).remove();
				return hiddenElementWidth;
			}
			
			var enbleDevelopment =  function () {
			
			
			}
			
			//Start Development info
			if ( s.development ) {		
				$('body').append('<div class="alert alert-success" id="'+ s.developmentId +'"></div>');
				var $developmentDiv = $('#' + s.developmentId);
				$($developmentDiv).css('position','fixed').css('right','20px').css('bottom','20px');				
				function devPrint(label, elem) {
				var labelId = label.replace(/\s+/g, '-').toLowerCase();				
					if ($('#'+labelId).length > 0) {
						$('#'+labelId).text(label + ': ' + elem);
					} else {
						$('#dt-devInfo').append('<div id="' + labelId + '">' + label + ': ' + elem + '</div>');
					}
					return true;
				}
			}		
			//End Development info
			
			
			var visibleTabsWidth = function () {
				var visibleTabsWidth = 0;
				$($visibleTabs()).each(function( index ) {
					visibleTabsWidth += parseInt($(this).outerWidth(), 10);
				});
				visibleTabsWidth = visibleTabsWidth + parseInt($(dropdown).outerWidth(), 10);
			return visibleTabsWidth;
			}
			
			var availableSpace = function () {
				return $container.outerWidth()-visibleTabsWidth();
			}
			
			var arrangeTabs = function () {
				//Start Development info
				if ( s.development ) {		
					devPrint("Container width", $container.outerWidth());
					devPrint("Visible tabs width", visibleTabsWidth());
					devPrint("Available space", availableSpace());
					devPrint("First hidden", getFirstHiddenElementWidth());
				}
				//End Development info	
				
				if (availableSpace()<0) {//cod pentru ascundere taburi
					var x = availableSpace();
					$($visibleTabs().get().reverse()).each(function( index ){
						if (!($(this).hasClass('always-visible'))){	
								$(this).clone().prependTo(dropdownMenu);
								x=x+$(this).outerWidth();
								$(this).remove(); 
						}  
						if (x>0) {return false;}
					});
				}
				
				if (availableSpace()>getFirstHiddenElementWidth()) { // cod pentru aducere taburi afara
					var x = availableSpace();
					$($dropdownTabs()).each(function( index ){
						if (getHiddenElementWidth(this) < x && !($(this).hasClass('always-dropdown'))){				
							var clone = $(this).clone().appendTo($container);
							x = x-clone.outerWidth();
							$(this).remove();
						} else {return false;}
					 });
				}
			}
			
			//init
			if (s.autoArrangeTabs) {
				var tempTabs = [];
				$($visibleTabs().get().reverse()).each(function( index ){
					if ($(this).hasClass('always-visible')) {
						tempTabs.push($(this));
						$(this).remove();
					}
				});
				for (var i = 0; i < tempTabs.length; i++ ) {
					console.log(tempTabs[i]);
					$container.prepend(tempTabs[i]);
				}
			}
			
			arrangeTabs();
			
			$( window ).resize(function() {
				arrangeTabs();
			});
			return this;		
        });
    }
}(jQuery));
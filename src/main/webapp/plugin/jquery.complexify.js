/*
	http://github.com/danpalmer/jquery.complexify.js

	This code is distributed under the WTFPL v2:
*/
(function ($) {

	$.fn.extend({
		complexify: function(options, callback) {

			var MIN_COMPLEXITY = 49; // 12 chars with Upper, Lower and Number
			var MAX_COMPLEXITY = 120; //  25 chars, all charsets
			var CHARSETS = [
				// Commonly Used
				[0x0030, 0x0039], // Numbers
				[0x0041, 0x005A], // Uppercase
				[0x0061, 0x007A], // Lowercase
				[0x0021, 0x002F], // Punctuation
				[0x003A, 0x0040], // Punctuation
				[0x005B, 0x0060], // Punctuation
				[0x007B, 0x007E] // Punctuation
			];

			var defaults = {
				minimumChars: 8,
				miniStrength:8,
				strengthScaleFactor: 1,
        bannedPasswords: window.COMPLEXIFY_BANLIST || [],
				banmode: 'strict', // (strict|loose)
        evaluateOnInit: true
			};

			if($.isFunction(options) && !callback) {
				callback = options;
				options = {};
			}

			options = $.extend(defaults, options);

			function additionalComplexityForCharset(str, charset) {
				for (var i = str.length - 1; i >= 0; i--) {
					if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
						return charset[1] - charset[0] + 1;
					}
				}
        return 0;
			}
			
			function inBanlist(str) {
				if (options.banmode === 'strict') {
					for (var i = 0; i < options.bannedPasswords.length; i++) {
            if (options.bannedPasswords[i].indexOf(str) !== -1) {
              return true;
            }
					}
					return false;
				} else {
					return $.inArray(str, options.bannedPasswords) > -1 ? true : false;
				}
			}

      function evaluateSecurity() {
        var password = $(this).val();
        var complexity = 0, valid = false;
        
        // Reset complexity to 0 when banned password is found
        if (!inBanlist(password)) {
        
          // Add character complexity
          for (var i = CHARSETS.length - 1; i >= 0; i--) {
        	  $("#msg").html("CHARSETS"+CHARSETS.length);
            complexity += additionalComplexityForCharset(password, CHARSETS[i]);
          }
          
        } else {
          complexity = 1;
        }
        
        // Use natural log to produce linear scale
        valid = (complexity > MIN_COMPLEXITY && password.length >= options.minimumChars);
        if(valid && password.length>=options.miniStrength){
            
        }else{
        	complexity = Math.log(Math.pow(complexity, password.length)) * (1/options.strengthScaleFactor);
            complexity = (complexity / MAX_COMPLEXITY) * 100;
        }
        // Scale to percentage, so it can be used for a progress bar
        
        complexity = (complexity > 100) ? 100 : complexity;
        
        callback.call(this, valid, complexity);
      }

      if( options.evaluateOnInit ) {
        this.each(function () {
          evaluateSecurity.apply(this);
        });
      }

			return this.each(function () {
        $(this).bind('keyup focus', evaluateSecurity);
			});
			
		}
	});

})(jQuery);
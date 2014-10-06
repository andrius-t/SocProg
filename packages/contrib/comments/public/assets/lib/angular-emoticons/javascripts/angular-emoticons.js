(function() {
  var emoticonize, filters;

  emoticonize = function($sce) {
    var emoticon, escapeCharacters, exclude, excludeArray, preMatch, specialEmoticons, specialRegex;
    escapeCharacters = [")", "(", "*", "[", "]", "{", "}", "|", "^", "<", ">", "\\", "?", "+", "=", "."];
    specialEmoticons = {
      ":-)": {
        cssClass: "smile"
      },
      ":)": {
        cssClass: "smile"
      },
      ":smile:": {
        cssClass: "smile"
      },
      ":D": {
        cssClass: "biggrin"
      },
      ":-D": {
        cssClass: "biggrin"
      },
      ":grin:": {
        cssClass: "biggrin"
      },
      ":(": {
        cssClass: "sad"
      },
      ":-(": {
        cssClass: "sad"
      },
      ":sad:": {
        cssClass: "sad"
      },
      "8O": {
        cssClass: "shock"
      },
      "8-O": {
        cssClass: "shock"
      },
      ":shock:": {
        cssClass: "shock"
      },
      ":?": {
        cssClass: "confused"
      },
      ":-?": {
        cssClass: "confused"
      },
      ":???:": {
        cssClass: "confused"
      },
      ":confused:": {
        cssClass: "confused"
      },
      "8)": {
        cssClass: "cool"
      },
      "8-)": {
        cssClass: "cool"
      },
      ":cool:": {
        cssClass: "cool"
      },
      ":x": {
        cssClass: "mad"
      },
      ":-x": {
        cssClass: "mad"
      },
      ":mad:": {
        cssClass: "mad"
      },
      ":P": {
        cssClass: "razz"
      },
      ":-P": {
        cssClass: "razz"
      },
      ":razz:": {
        cssClass: "razz"
      },
      ":|": {
        cssClass: "neutral"
      },
      ":-|": {
        cssClass: "neutral"
      },
      ":neutral:": {
        cssClass: "neutral"
      },
      ";)": {
        cssClass: "wink"
      },
      ";-)": {
        cssClass: "wink"
      },
      ":wink:": {
        cssClass: "wink"
      },
      ">:(": {
        cssClass: "evil"
      },
      ">;(": {
        cssClass: "evil"
      },
      ">:-(": {
        cssClass: "evil"
      },
       ":evil:": {
        cssClass: "evil"
      },
      ">:-D": {
        cssClass: "twisted"
      },
       ":twisted:": {
        cssClass: "twisted"
      },
      ":lol:": {
        cssClass: "lol"
      },
      ":oops:": {
        cssClass: "oops"
      },
      ":cry:": {
        cssClass: "cry"
      },
      ":roll:": {
        cssClass: "roll"
      },
      ":eek:": {
        cssClass: "eek"
      },
      ":o": {
        cssClass: "eek"
      },
      ":-o": {
        cssClass: "eek"
      },
      ":!:": {
        cssClass: "exclaim"
      },
       ":?:": {
        cssClass: "question"
      },
      ":idea:": {
        cssClass: "idea"
      },
      ":arrow:": {
        cssClass: "arrow"
      },
      ":mrgreen:": {
        cssClass: "mrgreen"
      }

    };
    specialRegex = new RegExp('(\\' + escapeCharacters.join('|\\') + ')', 'g');
    preMatch = '(^|[\\s\\0])';
    var specialEmoticonsObject =  {};
   for(emoticon in specialEmoticons)
   {  
      emoticon_new = emoticon.replace(specialRegex, '\\$1'); 
      specialEmoticonsObject[emoticon] = new RegExp(preMatch + '(' + emoticon_new + ')', 'g');
    }
   
    exclude = 'span.css-emoticon';
    exclude += ",pre,code,.no-emoticons";
    excludeArray = exclude.split(',');
    return function(text) {
      var cssClass, specialCssClass, _l, _len3, _len4, _len5, _m, _n;

      text=text.valueOf();
      cssClass = 'css-emoticon';
            
      for (emoticon in specialEmoticonsObject) {
        specialCssClass = cssClass + " " + specialEmoticons[emoticon].cssClass;
        text = text.replace(specialEmoticonsObject[emoticon], "$1<span class='" + specialCssClass + "'>$2</span>");
      }
     
      return $sce.trustAsHtml(text);
    };
  };

  filters = angular.module('emoticonizeFilter', []);

  filters.filter('emoticonize', emoticonize);

}).call(this);

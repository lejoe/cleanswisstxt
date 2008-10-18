var $j = jQuery.noConflict();
var $ = {};

$j(document).ready(function(){
    
    var errorMessage = "Oooops!<br />Can't find the page.";
    
    var currentPage = 100;
    var currentSubPage = 0;
    var nextPage = new Array();
    
    $j().bind( "keydown",function(e){ 
        
        var key = e.keyCode;
        // console.log(key);
        // numbers (numpad and not)
        if((key >= 48 && key <= 57) || (key >= 96 && key <= 105)){
            
            nextPage.push(getNumber(key));
            
            
            updateNextPage(nextPage);
            
            if(nextPage.length == 3) {
                $j.history.load(getPage(nextPage));
                nextPage = new Array();
            }
        }
        
        // + right_arrow
        if((key == 107) || (key == 39)){
            updateNextPage(currentPage + 1);
            $j.history.load(currentPage + 1);
        }
        
        // - left_arrow
        if((key == 109) || (key == 37)){
            updateNextPage(currentPage - 1);
            $j.history.load(currentPage - 1);
        }
        
        // + down_arrow
        if(key == 40){
            loadPage(currentPage, currentSubPage + 1);
        }
        
        // + up_arrow
        if(key == 38){
            loadPage(currentPage, currentSubPage - 1);
        }
        
        // delete
        if(key == 8){
            if (nextPage.length >= 1) {
                nextPage.pop();
                updateNextPage(getPage(nextPage));
            }
        }
    });
    
    function loadaPage(hash){
        hash = parseInt(hash);
        if(isNaN(hash)){
            loadPage(100, 00);
            updateNextPage(100);
        }else{
            loadPage(hash, 00);
            updateNextPage(hash);
        }
    }
    
    function loadPage(pageCode, subPage){
        currentPage = pageCode;
        currentSubPage = subPage;
        
        removeError();
        
        $j("div#image > img").fadeOut("fast", function() {
            // $j('#loader').addClass('loading');
            addLoading();
            var img = new Image();
            $j(this).replaceWith(img);
            $j(img).hide();
            $j(img).attr('src', 'http://www.teletext.ch/pics/TSR1/'+currentPage+'-0'+currentSubPage+'.gif').load(function () {
                removeLoading();
                $j(this).fadeIn("fast");
            }).error(function () {
                if(currentSubPage <= 2) {
                    loadPage(pageCode, currentSubPage + 1);
                }else {
                    removeLoading();
                    addError();
                }
            });
        });
    }
    
    function updateNextPage(nextPage) {
        
        switch(nextPage.length)
        {  
        case 1:
          nextPage = nextPage[0]+ '..';
          break;
        case 2:
          nextPage = nextPage[0] + '' + nextPage[1] + '.';
          break;
        case 3:
          nextPage = nextPage[0] + '' + nextPage[1] + nextPage[2];
          break;
        }
        
        $j("div#number > h1").contents().replaceWith(nextPage+"");
    }
    
    function getPage(numbers) {
        var page = numbers[0] * 100;
        
        page += numbers[1] == undefined ? '' : numbers[1] * 10;
        page += numbers[2] == undefined ? '' : numbers[2];
        
        return page;
    }
    
    function getNumber(keyCode){
        switch(keyCode) {
            case 48:
                return 0;
            case 49:
                return 1;
            case 50:
                return 2;
            case 51:
                return 3;
            case 52:
                return 4;
            case 53:
                return 5;
            case 54:
                return 6;
            case 55:
                return 7;
            case 56:
                return 8;
            case 57:
                return 9;
        }
    }
    
    function addError(){
        $j('div#loader').addClass('error').append(errorMessage);
    }
    
    function removeError(){
        if ($j('div#loader').hasClass('error')){
            $j('div#loader').removeClass('error').contents().remove();
        }
    }
    
    function addLoading(){
        $j('div#loader').addClass('loading').contents().remove();
    }
    
    function removeLoading(){
        $j('div#loader').removeClass('loading');
    }
    
    $j.history.init(loadaPage);
});
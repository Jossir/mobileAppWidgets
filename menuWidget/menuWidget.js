$(document).ready(function () {

    if ((typeof parameters == 'undefined')) {
        parameters = {

            "groupOfItem": "Breakfast",
            "timeTillImageTransition": 10,
            "ImagePaginationSpeed": 3,
            "showCaption": "true",
            "captionColour": "#f1f1f1",
            "newsTransitionSpeed": 12,
            "backgroundColour": "#d1d1d1",
            "div1BackgroundColour": "#676767",
            "div2BackgroundColour": "#676767",
            "div3BackgroundColour": "#676767",
            "footerBackgroundColour": "#676767",
            "textColour": "#f1f1f1",
            "textColourHeading": "#f1f1f1",
            "textColourNews": "#f1f1f1",
            "textColourCaption": "#f1f1f1",
            "location_data_fields": "field_1,field_2,field_3,field_4,",
            "field_1": "Good Morning i have now updated this from my phone",
            "field_2": "Welcome to The Claregalway Hotel",
            "field_3": "Welcome all BMW representatives",
            "field_4": "Windhoek Lager buy one get one free during happy hour",
            "fontFamily": "'Source Sans Pro', 'Helvetica Neue', 'Helvetica,Arial', 'sans-serif'",
            "showLogo": "true",
            "numberOfItems": 15,
            "fontSize": 32.4,
            "tenantID": "2328",
            "transitionTime": 3,
            get: function (attr) {
                return this[attr];
            }
        }
    }
    ;


    //document.writeln(JSON.stringify(window.innerHeight));


    timeTillTransition = parseInt(parameters.get("timeTillImageTransition")) * 1000;
    paginationSpeedImg = parseInt(parameters.get("ImagePaginationSpeed")) * 1000;
    paginationSpeedNews = parseInt(parameters.get("newsTransitionSpeed")) * 1000;
    newsText = parameters.get("location_data_fields");


    $.ajax({
        url: 'http://test.tallorder.mobi/tallorder/ws3/wsGetMenuSimplified.php?akey=&tid=' + parameters.get("tenantID") + '&s=m',
        type: 'GET',
        //  crossDomain: true,
        dataType: 'jsonp',
        success: function (data, status) {


            populateArray(data);
            populateImg(data);
            populateNews(parameters.get("newsText"));

            currencySymbol = data.data.tenantInfo.Symbol;
            currencySymbolPos = data.data.tenantInfo.SymbolPos;

            print();
            createLayout();

        },
        error: function (a, b, c) {
            alert('Failed!');
        },
    });
});
function createLayout() {
    document.getElementById("div1").style.background = parameters.get("div1BackgroundColour");
    document.getElementById("div2").style.background = parameters.get("div2BackgroundColour");
    document.getElementById("div3").style.background = parameters.get("div3BackgroundColour");
    document.getElementById("divNews").style.background = parameters.get("footerBackgroundColour");
    document.body.style.backgroundColor = parameters.get("backgroundColour");
//text colour
    document.getElementById("div2").style.color = parameters.get("textColour");
    document.getElementById("div1").style.color = parameters.get("textColour");
    document.getElementById("div3").style.color = parameters.get("textColourCaption");
    document.getElementById("divNews").style.color = parameters.get("textColourNews");
    $('h1').css({
        'color': parameters.get("textColourHeading")
    });

    $('body').css({
        'font-family': parseInt(parameters.get("fontFamily")),
        'font-size': parseFloat(parameters.get("fontSize")) + "px",
    });


}
function populateArray(data) {

    var rMax = 40;
    var cMax = 1;
    f = new Array();
//create two dimensional array
    for (i = 0; i < rMax; i++) {

        f[i] = new Array();

        for (j = 0; j < cMax; j++) {

            f[i][j] = 0;
        }
    }


    //populate groups
    var counter = 0;
    for (x = 0; x < data.data.menuItems.length; x++) {
        if (data.data.menuItems[x].PID == 0) {
            f[counter][0] = data.data.menuItems[x];
            counter++;
            data.data.menuItems.splice(x, 1);
        }

    }


//populate items
    for (x = 0; x < data.data.menuItems.length; x++) {

        for (y = 0; y < data.data.menuItems.length; y++) {
            try {
                if (f[y][0].IID == data.data.menuItems[x].PID && data.data.menuItems[x].PRI != "0.00") {
                    f[y].push(data.data.menuItems[x]);
                    break;
                }
            }
            catch (ex) {

            }
        }
    }


}
function populateNews(data) {
    try {


        var temp = parameters.get("location_data_fields");
        var newsData = temp.split(',');
        newsData.pop();
        //alert(newsData);
        for (x = 0; x < newsData.length; x++) {
            newsData[x] = parameters.get(newsData[x]);
        }


        for (x = 0; x < newsData.length; x++) {
            $('.footer').append('<div class="item"><h1>' + newsData[x] + '</h1></div>');
        }

        $("#divNews").owlCarousel({
            items: 1,
            autoPlay: timeTillTransition,
            slideSpeed: 2000,
            paginationSpeed: paginationSpeedNews,
            rewindSpeed: 1000,
            itemsMobile: false,
            itemsTablet: false,
            itemsDesktopSmall: false,
            itemsDesktop: false,
            singleItem: true,
            pagination: false

        });
    }
    catch (e) {

    }


}
function populateImg(data) {

    $("#divImg").owlCarousel({
        items: 1,
        autoPlay: timeTillTransition,
        slideSpeed: 2000,
        paginationSpeed: paginationSpeedImg,
        rewindSpeed: 1000,
        itemsMobile: false,
        itemsTablet: false,
        itemsDesktopSmall: false,
        itemsDesktop: false,
        singleItem: true

    });
    img = new Array();
    caption = new Array();
    for (x = 0; x < 20; x++) {

        if (f[x][0].SNM == parameters.get("groupOfItem")) {


            for (y = 0; y < f[x].length - 1; y++) {

                if (!(f[x][y + 1].image == null)) {
                    img.push(f[x][y + 1].image);
                    caption.push(f[x][y + 1].SNM)
                }


            }
        }
    }


    logo = data.data.tenantInfo.Logo;

    imgData = [img.length + 1];


    for (x = 0; x < img.length; x++) {
        imgData[x] = document.createElement("IMG");
        imgData[x].setAttribute("src", img[x]);
        imgData[x].setAttribute("class", "img");
        add(imgData[x])
    }

    if ((parameters.get("showCaption") == "true")) {
        $('.owl-item').each(function (index) {
            $(this).prepend('<div class="caption">' + caption[index] + '</div>');

            //console.log(JSON.stringify($(this)));
            $(this).css('color', parameters.get("captionColour"));


        })

    }
    else {
        document.getElementById("div3").style.paddingTop = "7%";
    }
}

function print() {

    pos = 1;
    var el = document.getElementById('div1');
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    fontSize = parseFloat(style);
    for (x = 0; x < 20; x++) {

        if (f[x][0].SNM == parameters.get("groupOfItem")) {
            $('#div1').append('<h1 style="text-align: center">' + f[x][0].SNM + '</h1>');
            //$('#div1').append("Width: " +window.innerWidth);
            //$('#div1').append(" Height: " +window.innerHeight);


            if (parameters.get("showLogo") == "true") {
                $('#header').prepend('<img src=' + logo + ' style="max-height: 10%; max-width: 15%;float: right;position:absolute;top:1%;right:2%;z-index:2;border:2px solid black;">');
            }


            for (y = 0; y < parseInt(parameters.get("numberOfItems")); y++) {

                $('#div1').append('<p>' + f[x][y + 1].SNM + '</p>');

                if (currencySymbolPos == "R") {
                    $('#div2').append('<p>' + f[x][y + 1].PRI + currencySymbol + '</p>');
                }
                else {
                    $('#div2').append('<p>' + currencySymbol + f[x][y + 1].PRI + '</p>');
                }
                pos++;

            }
            break;
        }

    }
    if (window.innerWidth <= "1280") {
        $("p").css({
            "font-size": "67%",
            "line-height": "130%",
        });
        $("h1").css({
            "font-size": "81%",
        });
        document.getElementById("div3").style.fontSize = "58%";


        document.getElementById("div2").style.height = "630px";
        document.getElementById("col1").style.height = "630px";
        document.getElementById("col2").style.height = "630px";
        $("img").css({
            "height": "520px",
        });
        $('.caption').css({
            'font-size': "20px",
        });


    }


    if (f.length > parseInt(parameters.get("numberOfItems"))) {

        setTimeout(update, parseInt(parameters.get("transitionTime")) * 1000);

    }


}
function update() {

    clear("div1");
    clear("div2");


    for (x = 0; x < 20; x++) {

        if (f[x][0].SNM == parameters.get("groupOfItem")) {

            /*if (pos +1 < f[x].length -parseInt(parameters.get("numberOfItems")) ) {
             pos = pos+ parseInt(parameters.get("numberOfItems"));
             }
             else if(pos== f[x].length-parseInt(parameters.get("numberOfItems")))
             {
             pos=1;
             }
             else {
             pos = f[x].length -parseInt(parameters.get("numberOfItems"));
             }*/

            var temp = pos;


            if (window.innerWidth <= "1280") {
                $('#div1').append('<h1 style="color:#fefdff;text-align: center; font-size: 81%">' + f[x][0].SNM + '</h1>');
                var written = false;
                for (y = pos; y < temp + parseInt(parameters.get("numberOfItems")); y++) {

                    if (pos == f[x].length && !written) {
                        y = 1;
                        temp = 1;
                        pos = 1;
                    }
                    else if (pos >= f[x].length && written) {
                        pos = 1;
                        break;
                    }


                    $('#div1').append('<p style="font-size: 67%;line-height: 130%">' + f[x][y].SNM + '</p>');

                    if (currencySymbolPos == "R") {
                        $('#div2').append('<p style="font-size: 67%;line-height: 130%">' + f[x][y].PRI + currencySymbol + '</p>');
                    }
                    else {
                        $('#div2').append('<p style="font-size: 67%;line-height: 130%">' + currencySymbol + f[x][y].PRI + '</p>');
                    }
                    written = true;
                    pos++;
                }
                break;
            }
            else {
                $('#div1').append('<h1 style="color:#fefdff;text-align: center">' + f[x][0].SNM + '</h1>');

                var written = false;

                for (y = pos; y < temp + parseInt(parameters.get("numberOfItems")); y++) {
                    if (pos == f[x].length && !written) {
                        y = 1;
                        temp = 1;
                        pos = 1;
                    }
                    else if (pos >= f[x].length && written) {
                        pos = 1;
                        break;
                    }

                    $('#div1').append('<p>' + f[x][y].SNM + '</p>');

                    if (currencySymbolPos == "R") {
                        $('#div2').append('<p>' + f[x][y].PRI + currencySymbol + '</p>');
                    }
                    else {
                        $('#div2').append('<p>' + currencySymbol + f[x][y].PRI + '</p>');
                    }
                    written = true;
                    pos++;
                }
                break;
            }
        }

    }


    /*    if (pos + parseInt(parameters.get("numberOfItems"))< f.length) {
     $('#div1').append('<h1 align="center"> <i>' + "..." + '</h1>');
     }
     else
     {
     $('#div1').prepend('<h1 align="center"> <i>' + "..." + '</h1>');
     }*/

    setTimeout(update, parseInt(parameters.get("transitionTime")) * 1000);
}

function add(item) {
    var owl = $("#divImg"), textholder, booleanValue = false;
    owl.owlCarousel();
    owl.data('owlCarousel').addItem(item);

}
function clear(divID) {
    var div = document.getElementById(divID);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
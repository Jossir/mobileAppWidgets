$(document).ready(function () {

    if ((typeof parameters == 'undefined')) {
        parameters = {

            "numOfItemsToBeDisplayed": 3,
            "numOfImgToGet": 30,
            "timeTillTransition": 6,
            "instagramAccountName": "natgeo",
            "backgroundColour": "#4b5363",
            "paginationSpeed": 3,
            "refreshInterval": 20,
            "showCaption": "false",
            "captionColour": "white",
            "captionTextSize": 2,
            "captionlengthPercentage": 80,
            get: function (attr) {
                return this[attr];
            }
        }
    }
    ;
    timeTillTransition = parseInt(parameters.get("timeTillTransition")) * 1000;
    paginationSpeed = parseInt(parameters.get("paginationSpeed")) * 1000;
    refreshInterval = parseInt(parameters.get("refreshInterval")) * 60000;
    numOfImgToGet = parseInt(parameters.get("numOfImgToGet"));
    numOfItemsToBeDisplayed = parseInt(parameters.get("numOfItemsToBeDisplayed"));

    //document.writeln(JSON.stringify(parameters));

    imgData = [numOfImgToGet + 1];
    caption = [numOfImgToGet + 1];
    $.ajax({
        url: 'https://api.instagram.com/v1/users/search?q=' + parameters.get("instagramAccountName") + '&client_id=8bb6349f7a2e4a919175d4c16ee9dca7',
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function (data, status) {
            //alert('Got the user ID!');
            var userID = data.data[0]["id"];
            $.ajax({
                url: 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?client_id=8bb6349f7a2e4a919175d4c16ee9dca7&count=' + numOfImgToGet,
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp',
                success: function (data, status) {
                    //alert(data);
                    var imgLink = [numOfImgToGet];
                    for (x = 0; x < numOfImgToGet; x++) {

                        imgLink[x] = data.data[x].images.standard_resolution.url;

                        $("#img" + x).attr("src", imgLink[x]);

                        imgData[x] = document.createElement("IMG");
                        imgData[x].setAttribute("src", imgLink[x]);
                        imgData[x].setAttribute("class", "img");
                        imgData[x].setAttribute("id", data.data[x].id);
                        try {
                            //imgData[x].setAttribute("title", data.data[x].caption.text);
                            caption[x] = data.data[x].caption.text;
                        }
                        catch (exception) {
                            caption[x] = "no caption"
                        }
                    }
                    populateCarousel(imgData);
                },
                error: function () {
                    alert('Failed!');
                },
            });
        },
        error: function () {
            alert('Failed!');
        },
    });
});


function populateCarousel(imgData) {


    $("#divImg").owlCarousel({
        autoPlay: timeTillTransition,
        items: numOfItemsToBeDisplayed,
        slideSpeed: 200,
        paginationSpeed: paginationSpeed,
        rewindSpeed: 1000,
        itemsMobile: false,
        itemsTablet: false,
        itemsDesktopSmall: false,
        itemsDesktop: false,
        pagination: false,


    });
    //var percentage = 50;

    for (x = 0; x < numOfImgToGet; x++) {

        add(imgData[x]);

        if (numOfItemsToBeDisplayed == 1) {
            document.getElementsByClassName("img").item(x).style.width = "55%";
            document.getElementsByClassName("img").item(x).style.height = "auto";
        }
    }
    if (numOfItemsToBeDisplayed == 1) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "1.2%";
        //percentage = 20;
    }
    else if (numOfItemsToBeDisplayed == 2) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "6%";
       // percentage = 10;
    }
    else if (numOfItemsToBeDisplayed == 3) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "20%";
       // percentage = 18;
    }
    else if (numOfItemsToBeDisplayed == 4) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "27%";
        //percentage = 18;
    }
    else if (numOfItemsToBeDisplayed == 5) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "32%";
        //percentage = 22;
    }
    else if (numOfItemsToBeDisplayed >= 6) {
        document.getElementsByClassName("owl-wrapper").item(0).style.top = "34%";
       // percentage = 23;
    }


    document.getElementById("divImg").style.background = parameters.get("backgroundColour");
    document.body.style.background = parameters.get("backgroundColour");


    if (numOfItemsToBeDisplayed >= 3) {
        $(".owl-carousel .owl-item img").css("height", function (index) {
            return "auto";
        });
    }

    if ((parameters.get("showCaption") == "true") && numOfItemsToBeDisplayed != 1 && numOfItemsToBeDisplayed <= 6) {

        $('.owl-item').each(function (index) {
            $(this).append('<span class="caption">' + caption[index] + '</span>');


            $('.owl-item span').css({
                'font-size': parseInt(parameters.get("captionTextSize")) + "vmax",

            });



        //if (numOfItemsToBeDisplayed >= 6) {
        //    $('.owl-item span').css({
        //        'font-size': '1vw',
        //    });
        //}
        //else if (numOfItemsToBeDisplayed == 5) {
        //    $('.owl-item span').css({
        //        'font-size': '1vw',
        //    });
        //}
        //else {
        //    $('.owl-item span').css({
        //        'font-size': '1.5vw',
        //    });
        //}
        $(this).css('color', parameters.get("captionColour"));

    }
);


jQuery(function () {

    // calculate pixel height based on your percentage
    var dot_height = jQuery('.owl-item').height() * (parameters.get("captionLength") / 100);

    jQuery('.caption').dotdotdot({
        ellipsis: "...",
        height: dot_height,
        wrap: "word",
        after: "a.readmore",
        watch: "window"
    });

});
}
Refresh();
}


function Refresh() {
    if (refreshInterval >= 900000) {
        setTimeout(function () {
            RefreshImages();
        }, refreshInterval);

    }
    else {
        setTimeout(function () {
            RefreshImages();
        }, 900000);
    }

}

function add(item) {
    var owl = $("#divImg"), textholder, booleanValue = false;
    owl.owlCarousel();
    owl.data('owlCarousel').addItem(item);

}
//function remove() {
//
//    $("#divImg").data('owlCarousel').removeItem();
//}AS

function RefreshImages() {
    location.reload()
    //var imgData2 = [parameters.get("numOfImgToGet")];
    //
    //$.ajax({
    //    url: 'https://api.instagram.com/v1/users/search?q=' + parameters.get("instagramAccountName") + '&client_id=8bb6349f7a2e4a919175d4c16ee9dca7',
    //    type: 'GET',
    //    crossDomain: true,
    //    dataType: 'jsonp',
    //    success: function (data, status) {
    //        //alert('Got the user ID!');
    //        var userID = data.data[0]["id"];
    //        $.ajax({
    //
    //            url: 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?client_id=8bb6349f7a2e4a919175d4c16ee9dca7&count=' + parameters.get("numOfImgToGet"),
    //            type: 'GET',
    //            crossDomain: true,
    //            dataType: 'jsonp',
    //            success: function (data, status) {
    //                //alert(data);
    //                var imgLink = [parameters.get("numOfImgToGet")];
    //                for (x = 0; x < parameters.get("numOfImgToGet"); x++) {
    //
    //                    imgLink[x] = data.data[x].images.standard_resolution.url;
    //
    //                    $("#img" + x).attr("src", imgLink[x]);
    //                    caption.length = 0;
    //                    imgData2[x] = document.createElement("IMG");
    //                    imgData2[x].setAttribute("src", imgLink[x]);
    //                    imgData2[x].setAttribute("class", "img");
    //                    imgData2[x].setAttribute("id", data.data[x].id);
    //                    imgData2[x].setAttribute("title", data.data[x].caption.text);
    //                    caption[x] = data.data[x].caption.text;
    //
    //
    //                }
    //                for (x = 0; x < parameters.get("numOfImgToGet"); x++) {
    //                    if (imgData2[x].id == imgData[0].id) {
    //                        for (y = 0; y < x; y++) {
    //                            imgData.push(imgData2[y])//rectify primary array
    //                            //imgData.shift();
    //                        }
    //                        break;
    //                    }
    //
    //                }
    //                $("#divImg").data('owlCarousel').destroy();
    //                populateCarousel(imgData);
    //
    //            },
    //            error: function () {
    //                alert('Failed!');
    //            },
    //
    //        });
    //    },
    //    error: function () {
    //        alert('Failed!');
    //    },
    //});
}

//filter by tag, implement later
/*
 //filter by tag, implement later


 var clientid = 'your Client ID',
 hashtag='wordcamprussia2015', // hashtag without # symbol
 num_photos = 4;

 $.ajax({
 url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent',
 dataType: 'jsonp',
 type: 'GET',
 data: {client_id: clientid, count: num_photos},
 success: function(data){
 console.log(data);
 for(x in data.data){
 $('ul').append('<li><img src="'+data.data[x].images.standard_resolution.url+'"></li>');
 }
 },
 error: function(data){
 console.log(data);
 }
 });
 */
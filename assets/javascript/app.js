
// Creating Functions & Methods
var cookieCount;  //Define the number of keyword count save into cookie
var activeTab;  // Define the active tab

//Save the keywords into cookie
// cname - the parameter name
// cvalue - vlaue of the parameter
// exdays - expiry date of the parameter i.e. 30 days
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//Get the value from the cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//Delete the cookie by passing the parameter name
function delCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
}
//Clear all cookie 
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}


// Function that displays all buttons
function displayButtons() {
    cookieCount= getCookie("keycount");
    console.log("count: " + cookieCount);
  
    // For the first time, if cookieCount is null
    if (cookieCount =="" || cookieCount == null) {
        cookieCount = 0;
    } else {
    //Load the cookie and display the button
        for (var i=1; i < cookieCount +1; i++){
            var action = getCookie("keyword"+i);
            var button = "<button class='action btn btn-primary btnkeyword' data-name='" + action + "' data-index='" + i + "'>" + action + "</button>"; 
            if   (action !== "" && action !== null) {
                console.log("Array load i:" + i);
                $("#ButtonsView").prepend(button);
                console.log("print button : " + action);

            } 
        } 
    }
}


// Function to add a new action button
function addhpNewButton(){
    // when click on Home page search button
    $("#searchKeyword").on("click", function(){
        event.preventDefault();
        var action = $("#hp-action-input").val().trim();
        if (action == ""){
          return false; // added so user cannot add a blank button
        }
        console.log(action + " empty button"); 
        $("#hp-action-input").val(""); //clear the input text
        $("#ButtonsView").empty(); //clear the buttons
        cookieCount= getCookie("keycount");
        cookieCount++;
        setCookie("keycount", cookieCount, 30); //save cookie
        setCookie("keyword"+cookieCount, action, 30);
        console.log("count: " +cookieCount + " word: " + action); 
        displayButtons();
        displayResult();
        return false;
        });
    }

function addrpNewButton(){
    
    //When click on Result page add button
    $("#addKeyword").on("click", function(){
    event.preventDefault();
    var action = $("#rp-action-input").val().trim();
    if (action == ""){
      return false; // added so user cannot add a blank button
    }
    console.log(action + " empty button");
    $("#rp-action-input").val(""); //clear the input text 
    $("#ButtonsView").empty(); //clear the buttons
    cookieCount= getCookie("keycount");
    cookieCount++;
    setCookie("keycount", cookieCount, 30); // save cookie
    setCookie("keyword"+cookieCount, action, 30);
    console.log("count: " +cookieCount + " word: " + action); 
    displayButtons();

 
    return false;
    });
}
// Function to remove all button
function removeAllButton(){
    $("#clearKeyword").on("click", function(){
    event.preventDefault();
    deleteAllCookies();
    $("#ButtonsView").empty(); //clear the buttons
    return false;
    });
}
// Function that displays all of the gifs
function displayGifs(keyword){
    //var action = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC&limit=10";
    console.log(queryURL); // displays the constructed url
    console.log(keyword);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#giphy-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.data; //shows results of gifs
        if (results == ""){  //if no data return disply error message
            $("#giphy-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#giphy-content").append("<BR> There isn't a gif for this selected button");
        }
        for (var i=0; i<results.length; i++){

            var gifDiv = $("<div>"); //div for the gifs to go inside
            gifDiv.addClass("gifDiv");
            // pulling rating of gif
            var gifRating = $("<p>").text("Rating: " + results[i].rating);
            gifDiv.append(gifRating);
            // pulling gif
            var gifImage = $("<img>");
            gifImage.attr("src", results[i].images.fixed_height_small_still.url); // still image stored into src of image
            gifImage.attr("data-still",results[i].images.fixed_height_small_still.url); // still image
            gifImage.attr("data-animate",results[i].images.fixed_height_small.url); // animated image
            gifImage.attr("data-state", "still"); // set the image state
            gifImage.addClass("image");
            gifDiv.append(gifImage);
            // pulling still image of gif
            // adding div of gifs to gifsView div
            $("#giphy-content").prepend(gifDiv);
        }
    });
}


// Function that displays all of the google
function displayGoogle(keyword){
    var queryURL = "https://www.googleapis.com/customsearch/v1?key=AIzaSyD5v1aWzlGtP2XlvaQ7P-xRMZBm1Xe24Mo&cx=008598012955604883368:zfyuaoppqfo&q=" + keyword ;
    console.log(queryURL); // displays the constructed url
    console.log(keyword);
    $.ajax({
        url: queryURL,
        method: 'GET',
        error: function(xhr, status, error) {  //if Error return disply error message
            $("#google-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#google-content").append("<BR> Daily Limit Excessed.  Please try again later!");
         }
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#google-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.items; //shows results of google
    
        if (results == ""){
            $("#google-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#google-content").append("<BR> There isn't a record for this selected button!");
        }
        for (var i=0; i<results.length; i++){

            $("#google-content").append("<BR>" + results[i].htmlTitle);
            $("#google-content").append("<BR><a class='smallFont' target='_blank' href= '" + results[i].link +"'>" + results[i].link + "</a>");
            $("#google-content").append("<BR>" );
        }
    });
}


// Function that displays all of the image files
function displayImages(keyword){
    var queryURL = "https://www.googleapis.com/customsearch/v1?key=AIzaSyD5v1aWzlGtP2XlvaQ7P-xRMZBm1Xe24Mo&cx=008598012955604883368:b3vybo0uyt4&searchType=image&q=" + keyword ;
    console.log(queryURL); // displays the constructed url
    console.log(keyword);
    $.ajax({
        url: queryURL,
        method: 'GET',
        error: function(xhr, status, error) { //if Error return disply error message
            $("#image-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#image-content").append("<BR> Daily Limit Excessed.  Please try again later!");
         }
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#image-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.items; //shows results of gifs
        if (results == ""){
            $("#image-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#image-content").append("<BR> There isn't a record for this selected button!");
        }
        for (var i=0; i<results.length; i++){
            var imageDiv = $("<div>"); //div for the images to go inside
            imageDiv.addClass("imageDiv");
            var imageCount = i + 1;
            var imageNum = $("<p>").text("Number: " + imageCount);
            imageDiv.append(imageNum);
            var image = $("<img>");
            image.attr("src", results[i].link); // image stored into src of image
            image.addClass("image");
            imageDiv.append(image);
            $("#image-content").prepend(imageDiv);
        }
    });
}


// Function that displays all of the reords from New York Times
function displayNews(keyword){
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=c133bd2c740147f58ccc6b561a9d3b63&page=0&q=" + keyword;
    console.log(queryURL); // displays the constructed url
    console.log(keyword);
    $.ajax({
        url: queryURL,
        method: 'GET',
        error: function(xhr, status, error) {  //if Error return disply error message
            $("#news-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#news-content").append("<BR> Issues encounter.  Please try again later!");
         }
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#news-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.response.docs; //shows results of google
     
        if (results == ""){
            $("#news-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            $("#news-content").append("<BR> There isn't a record for this selected button!");
        }
        for (var i=0; i<results.length; i++){

            $("#news-content").append("<BR>" + results[i].snippet);
            $("#news-content").append("<BR><a class='smallFont' target='_blank' href= '" + results[i].web_url +"'>" + results[i].web_url + "</a>");
            $("#news-content").append("<BR>" );
        }
    });
}



//Load the Home page
function loadMain(){
$("#rpheader").hide();
$("#ButtonsView").hide();
$("#myTab").hide();
$("#myTabContent").hide();
}

// Load the result page
function displayResult(){
    $("#mainHeader").hide();
    $("#rpheader").show();
    $("#ButtonsView").show();
    $("#myTab").show();
    $("#myTabContent").show();
    addrpNewButton();
    removeAllButton();
}



// Calling Functions & Methods
loadMain(); // Load the main page
displayButtons(); // initial setup for the display button
addhpNewButton(); // initial setup for the home page search button

//update the selected tab (use data-toggle=tab)
$('.nav-tabs').on('click', function(e) {
    activeTab = e.target.text;
    console.log(e.target.text); // newly activated tab
  });

// if keyword button is selected, it will trigger the API to retrive the data
$(document).on("click", ".action",function() {
    var action = $(this).attr("data-name");
    //if (activeTab == "GOOGLE") {
        displayGoogle(action);
    //} else if (activeTab == "GIPHY") {
        displayGifs(action);
    //} else if (activeTab == "IMAGES") {
        displayImages(action);
    //} else if (activeTab == "NEWS") {
        displayNews(action);
    //}
    console.log("active tab: "+ activeTab);
});

//if double the keyword button, it will remove the selected button and cookie
$( document).on("dblclick",".action",function() {
    var index = $(this).attr("data-index");
    delCookie("keyword"+index);
    $(this).remove();
  });

// Document Event Listeners for the GIPHY image
$(document).on("click", ".image", function(){
    var state = $(this).attr('data-state');
    if ( state == 'still'){
        $(this).attr('src', $(this).data('animate'));
        $(this).attr('data-state', 'animate');
    }else{
        $(this).attr('src', $(this).data('still'));
        $(this).attr('data-state', 'still');
    }
});

// Return to Home page if the result page logo on click
$(".rplogo").on("click", function(){
    $("#mainHeader").show();    
    loadMain();

});



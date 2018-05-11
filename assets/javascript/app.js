//$( document ).ready(function() {
// An array of actions, new actions will be pushed into this array;
//var actions = ["Dancing", "Jogging", "Falling", "Reading", "Pushing", "Swimming", "Eating", "Skipping", "Crying", "Winking","Beyoncing", "Strolling", "Hopping"];
// Creating Functions & Methods
var maxCookie = 10;
var actions = [];
var cookieCount;

//Save the keyword in local cookie
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

function delCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}



function loadCookie() {
    cookieCount= getCookie("keycount");
    console.log("count: " + cookiecount);
    //actions[cookieCount] =getCookie("keyword"+cookieCount);
    // For the first time, if cookieCount is null
    if (cookieCount =="" || cookieCount == null) {
        cookieCount = 0;
    } else {
    //Load the Array from the cookie 
        for (var i=0; i <= cookieCount; i++){
            if   (actions[i] != "" && actions[i] != null) {
                // do {     
                actions[i] =getCookie("keyword"+i);
                console.log("load i:" + i);
                //    i++;
                //} while (i <= cookieCount);
            } 
        } 
    }
}



// Function that displays all gif buttons
function displayGifButtons(){
    $("#gifButtonsView").empty(); // erasing anything in this div id so that it doesnt duplicate the results
    //load the cookie into action array   
    console.log("display button")  
    loadCookie();
    for (var i = 0; i < actions.length; i++){
        var gifButton = $("<button>");
        gifButton.addClass("action");
        gifButton.addClass("btn btn-primary")
        gifButton.attr("data-name", actions[i]);
        gifButton.text(actions[i]);
        $("#gifButtonsView").prepend(gifButton);
    }
}
// Function to add a new action button
function addNewButton(){
    // when click on Home page search button
    $("#searchGif").on("click", function(){
        var action = $("#action-input").val().trim();
        
        if (action == ""){
          return false; // added so user cannot add a blank button
        }
        console.log(action); 
        actions.push(action);
        cookieCount= getCookie("keycount");
        cookieCount++;
        setCookie("keycount", cookieCount, 30); //save cookie
        setCookie("keyword"+cookieCount, action, 30);
        alert("count: " +cookieCount + " word: " + action); 
        displayGifButtons();
        displayResult();
       
        return false;
        });
    
    //When click on Result page add button
    $("#addGif").on("click", function(){
    var action = $("#rp-action-input").val().trim();
    if (action == ""){
      return false; // added so user cannot add a blank button
    }
    console.log(action);
    actions.push(action);
    cookieCount= getCookie("keycount");
    cookieCount++;
    setCookie("keycount", cookieCount, 30); // save cookie
    setCookie("keyword"+cookieCount, action, 30);
    alert("count: " +cookieCount + " word: " + action); 
    displayGifButtons();
 
    return false;
    });
}
// Function to remove last action button
    // Doesnt work properly yet removes all of the added buttons
    // rather than just the last
function removeLastButton(){
    $("#removeGif").on("click", function(){
    //actions.pop(action);
    //list.remove(action);
    deleteAllCookies();
    displayGifButtons();
    return false;
    });
}
// Function that displays all of the gifs
function displayGifs(keyword){
    //var action = $(this).attr("data-name");
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC&limit=10";
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
        if (results == ""){
          alert("There isn't a gif for this selected button");
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
        method: 'GET'
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#google-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.items; //shows results of google
        if (results == ""){
          alert("There isn't a gif for this selected button");
        }
        for (var i=0; i<results.length; i++){

            $("#google-content").append("<BR>" + results[i].htmlTitle);
            $("#google-content").append("<BR><a href= '" + results[i].link +"'>" + results[i].link + "</a>");
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
        method: 'GET'
    })
    .done(function(response) {
        console.log(response); // console test to make sure something returns
        $("#image-content").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
        var results = response.items; //shows results of gifs
        if (results == ""){
          alert("There isn't a gif for this selected button");
        }
        for (var i=0; i<results.length; i++){

            var imageDiv = $("<div>"); //div for the gifs to go inside
            imageDiv.addClass("imageDiv");
            var Image = $("<img>");
            Image.attr("src", results[i].link); // still image stored into src of image
            Image.addClass("image");
            imageDiv.append(Image);
            $("#image-content").prepend(imageDiv);
        }
    });
}

function loadMain(){

$(".rpheader").hide();
$(".btnView").hide();
$("#myTab").hide();
$("#myTabContent").hide();

}

function displayResult(){
    $(".mainHeader").hide();
    $(".rpheader").show();
    $(".btnView").show();
    $("#myTab").show();
    $("#myTabContent").show();
    
    }



// Calling Functions & Methods
loadMain();
displayGifButtons(); // displays list of actions already created
addNewButton();
removeLastButton();
// Document Event Listeners
$(document).on("click", ".action",function() {
    var action = $(this).attr("data-name");
    displayGoogle(action);
    displayGifs(action);
    displayImages(action);
});



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
    $(".mainHeader").show();    
    loadMain();

});



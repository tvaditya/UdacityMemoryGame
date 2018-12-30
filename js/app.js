//Javascript functions
// Create consntants and variables, including list that holds all cards

const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let started = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let solvedCount = 0;
let timerPtr;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// get class value from card DOM
function getClassFromCard(card){
    return card[0].firstChild.className;
}

// show when user toggles 2 cards 
// this will also be useful fro matcing cards
function showOpenCards(){
    if (getClassFromCard(openCards[0]) === getClassFromCard(openCards[1])){
        solvedCount++;
        openCards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
    if (solvedCount === 8){
        endGame();
    }
}

//Create a timer each time you start a game
function timerRefresh(){
    timeCount += 1;
    $("#timer").html(timeCount);
    timerPtr = setTimeout(timerRefresh, 1000);
}

//Increment move 
function incrementMove(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 15 || moves === 21){
        lessStar();
    } 
}

//Listener for card click
function clickMe(event){
    
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        
        return;
    }
    //Start game
    if (!started) {
        started = true;
        timeCount = 0;
        timerPtr = setTimeout(timerRefresh, 1000);
    }
    //Flip cards
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    //Do the cards match?
    if (openCards.length === 2){
        showOpenCards();
    }
}

//Create a card
function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

//Populate the cards in list
function populateCards(){
    shuffle(cardList.concat(cardList)).forEach(createCard);
}

//Restart the game
function restartGame(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    started = false;
    openCards = [];
    timeCount = 0;
    solvedCount = 0;
    clearTimeout(timerPtr);
    $("#timer").html(0);
    //Initialize the game
    initGame();
}

//Show the stars
function initStars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

//Evaluate star rate
function lessStar(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

//End games message and restart
function endGame(){
    // stop timer
    clearTimeout(timerPtr);
    let stars = $(".fa-star").length;

    if (stars < 3) {
    msg = `Yeah you made it in ${timeCount} seconds and ${stars} stars.Try 3 stars!`;
    } else {
    msg = `Great ${stars} stars in ${timeCount}!! Can you do it in less time?`
    }
    vex.dialog.confirm({
        message: msg,
        callback: function(value){
            if (value){
                restartGame();
            }
        }
    });
}


//Initialize the game function
function initGame(){
    populateCards();
    initStars(); //Stars initiate
    $(".card").click(clickMe);
}

//When DOM is loaded
$(document).ready(function(){
    initGame();
    $("#restart").click(restartGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});

//Load animate CSS
//From  https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr){
  var l = arr.length;

  while(l){
    var pick = Math.floor(Math.random() * l--);
    var last = arr[l];
    arr[l] = arr[pick];
    arr[pick] = last;
  }

  return arr;
}

var Game = function(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  //
}
  Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
  };
  //
  Game.prototype.isLower= function(){
    return this.playersGuess < this.winningNumber;
  };
  //


  Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
      return "You Win!";
    }
    else if(this.pastGuesses.includes(this.playersGuess)){
      return "You have already guessed that number.";
    }
    else {
      this.pastGuesses.push(this.playersGuess);
      //stage 2
      if (this.pastGuesses.length === 5){
        return "You Lose.";
      };
      // stage 3
      var curdif = this.difference();
      if (curdif < 10){
        return "You're burning up!";
      }
      else if (curdif < 25){
        return "You're lukewarm.";
      }
      else if (curdif < 50){
        return "You're a bit chilly.";
      }
      else {
        return "You're ice cold!";
      };
    };
    return "didn't work";
  };
  //


  Game.prototype.playersGuessSubmission = function(guess){
    if(typeof guess !== 'number' || guess < 1 || guess > 100 ){
      throw "That is an invalid guess.";
      return "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
  };
  //



Game.prototype.provideHint = function(){
  var x = generateWinningNumber();
  var y = generateWinningNumber();
  var garr = this.pastGuesses;
  while (garr.includes(x) || garr.includes(y)){
    x = generateWinningNumber();
    y = generateWinningNumber();
  }
  var hintArray = [this.winningNumber, x, y];
  return shuffle(hintArray);
};



var newGame = function(){
  return new Game();
};

newGame.prototype = Object.create(Game.prototype);
newGame.prototype.constructor = newGame;

var submission = function(game){
  var guess = +$('#player-input').val();
  $('#player-input').val("");
  var result = game.playersGuessSubmission(guess);
  $('h1').text(result);
  var garr  = game.pastGuesses;
  for (i = 1; i <= garr.length; i ++){
    $('#guess-list').children('#g'+i).text(garr[i-1]);
  }
  if (result === "You Win!" || result === "You Lose."){
    $('.center p').text("Hit the reset button to try again.")
    $('#submit').prop('disabled', true);
    $('#hint').prop('disabled', true);
  }
  else {
    if(game.isLower()){
      $('.center p').text("Try Higher");
    }
    else{
      $('.center p').text("Try Lower");
    }
  }
}

$(document).ready(function() {
  var game = newGame();

  $('#submit').click(function(e) {
      submission(game);
  })

  $('#player-input').keypress(function(e){
    if (e.which == 13){
      submission(game);
    }
  })

  $('#hint').click(function(e){
      $('h1').text("Hint: "+game.provideHint());
  })

  $('#reset').click(function(e){
    game = newGame();
    $('h1').text("the guessing game");
    $('.center p').text("guess a number between 1 and 100")
    $('#submit').prop('disabled',false);
    $('#hint').prop('disabled',false);
    $('.guess').text("-");
  });
});

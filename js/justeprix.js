// an array containing the remaining questions
var remainingQuestions;

//the current question
var currentQuestion = null;

var numberOfGoodAnswers = 0;

var arrowHeight = 346;

$(function() {

    if(questionNumbers.length < gameData.length) {
        alert("Il manque des numéros de question");
    }

    $("#jPlayerDiv").jPlayer({
        ready: function() {
            $("#jPlayerDiv").jPlayer("setFile", "mp3/boo.mp3");
            $("#jPlayerDiv").jPlayer("load");
        }
    });

    // wire the buttons' actions
    $(".buttonTrue").bind("click", function() {
        if (currentQuestion) {
            currentQuestion.answer ? rightAnswer() : wrongAnswer();
        }
    });
    $(".buttonFalse").bind("click", function() {
        if (currentQuestion) {
            currentQuestion.answer ? wrongAnswer() : rightAnswer();
        }
    });

    // image over for the buttons
    $(".buttonTrue").bind("mouseover", function () {
        $(this).addClass("buttonTrueOver");
    });
    $(".buttonTrue").bind("mouseout", function () {
        $(this).removeClass("buttonTrueOver");
    });
    $(".buttonFalse").bind("mouseover", function () {
        $(this).addClass("buttonFalseOver");
    });
    $(".buttonFalse").bind("mouseout", function () {
        $(this).removeClass("buttonFalseOver");
    });

    remainingQuestions = new Array(gameData.length);
    for (var i = 0; i < gameData.length; i++) {
        remainingQuestions[i] = gameData[i];
    }
    displayNextQuestion();
});

/**
 * A right answer has been given: enjoy !
 */
function rightAnswer() {
    var q = currentQuestion;
    currentQuestion = null;

    f = function() {
        $("#jPlayerDiv").jPlayer("setFile", "mp3/applause.mp3").jPlayer("play");
        rightAnswerAnimationOn(3);

        if (Math.random() > 0.3) {
            $("#applause").animate({top: "360px", height: "240px"}, 800, function() {
                $("#applause").delay(800).animate({top: "600px", height: "0px"}, 800);
            });
        }
    };

    q.answer ? animationRightAmount(q, f) : animationWrongAmount(q, f);
}
function rightAnswerAnimationOn(times) {
    $("#pinup > img").attr('src', 'images/pinup_win.png');
    $("#lampsWin").fadeIn(250);
    setTimeout("rightAnswerAnimationOff(" + times + ")", 200);
}
function rightAnswerAnimationOff(times) {
    $("#pinup > img").attr('src', 'images/pinup_standard.png');
    $("#lampsWin").fadeOut(250);
    if (times > 0) {
        setTimeout("rightAnswerAnimationOn(" + (times - 1) + ")", 200);
    } else {
        numberOfGoodAnswers++;
        $("#arrow").animate({height: (arrowHeight * (1 - (numberOfGoodAnswers / gameData.length)))}, 800, function() {
            displayNextQuestion();
        });
        if (numberOfGoodAnswers == 10) {
            $("#confettis").fadeIn(function() {
                $("#confettis").delay(100).fadeOut(function() {
                    $("#confettis").delay(100).fadeIn(function() {
                        $("#confettis").delay(100).fadeOut();
                    });
                });
            });
        }
    }
}

/**
 * A wrong answer has been given: boooh!
 */
function wrongAnswer() {
    var q = currentQuestion;
    currentQuestion = null;
    f = function() {
        $("#jPlayerDiv").jPlayer("setFile", "mp3/boo.mp3").jPlayer("play");
        wrongAnswerAnimationOn(3);
    };
    q.answer ? animationRightAmount(q, f) : animationWrongAmount(q, f);
}
function wrongAnswerAnimationOn(times) {
    $("#pinup > img").attr('src', 'images/pinup_lose.png');
    setTimeout("wrongAnswerAnimationOff(" + times + ")", 200);
}
function wrongAnswerAnimationOff(times) {
    $("#pinup > img").attr('src', 'images/pinup_standard.png');
    if (times > 0) {
        setTimeout("wrongAnswerAnimationOn(" + (times - 1) + ")", 200);
    } else {
        displayNextQuestion();
    }
}
/**
 * Animation when the amount is right.
 * @param question the question.
 * @param callbackFunction to be called when the animation is over
 */
function animationRightAmount(question, callbackFunction) {
    var animFunction = function(question, i) {
        $("#questionAmount").fadeOut(400, function() {
            $("#questionAmount").fadeIn(400, function() {
                if (i != 0) {
                    animFunction(question, i - 1);
                } else {
                    callbackFunction();
                }
            });
        });
    };
    animFunction(question, 2);
}

/**
 * Animation when the answer is wrong.
 * @param question the question.
 * @param callbackFunction to be called when the animation is over
 */
function animationWrongAmount(question, callbackFunction) {
    $("#strike").fadeTo(10, 1, function() {
        $("#strike").animate({width: '+=200px'}, function() {
            var end = false;
            $("#strike, #questionAmount").fadeTo(500, 0.2, function() {
                if (!end) {
                    end = true;
                } else {
                    $("#realAmount").html(formatNumber(question.realAmount.toString()) + " €");
                    $("#realAmount").slideDown(function() {
                        callbackFunction();
                    });
                }
            });
        });
    });
}

function displayNextQuestion() {
    if (nextQuestionIndex != 0) {
        var nextQuestionIndex = Math.floor(Math.random() * remainingQuestions.length);
        currentQuestion = remainingQuestions[nextQuestionIndex];
        remainingQuestions.splice(nextQuestionIndex, 1);

        if (remainingQuestions.length == (gameData.length - 1)) {
            $("#questionAmount").html(formatNumber(currentQuestion.amount.toString()) + " €");
            $("#questionName").html("Question " + questionNumbers[10 - (remainingQuestions.length + 1)]);
            $("#questionContent").html(currentQuestion.text);
            $("#questionName, #questionAmount, #questionContent").clearQueue().fadeTo(400, 1);
        } else {
            $("#strike, #realAmount").fadeOut();
            $("#questionAmount").fadeOut(function() {
                $("#questionAmount").html(formatNumber(currentQuestion.amount.toString()) + " €").fadeTo(400, 1)
            });
            $("#questionName").fadeOut(function() {
                $("#questionName").html("Question " + questionNumbers[10 - (remainingQuestions.length + 1)]).fadeTo(400, 1)
            });
            $("#questionContent").fadeOut(function() {
                $("#questionContent").html(currentQuestion.text).fadeTo(400, 1);
            });
        }
    }
}

/**
 * Format a number.
 * @param nStr the number as a String.
 */
function formatNumber(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}
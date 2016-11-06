window.onload = function () {
    var correctAnswer = false;
    

    function initializeFractions() {
        var submitBtn = document.getElementById('submit_btn');
        
        var fractions = document.getElementsByClassName('quarter');
        var totalFractions = fractions.length;
        for(var i = 0; i < totalFractions; i++) {
            fractions[i].addEventListener('click', clickedFractionalPiece);
        }

        submitBtn.addEventListener('click', checkAnswer);

        function clickedFractionalPiece(evt) {
            if(evt.target.className == 'quarter') {
                evt.target.className += ' colored';
            } else {
                evt.target.className = 'quarter';
            }
        }

        function checkAnswer(evt) {
            var fraction0 = document.getElementById('fraction0');
            var fraction1 = document.getElementById('fraction1'); 

            correctAnswer = document.getElementById('choice1').checked && 
                fraction0.getElementsByClassName('colored').length === 7 &&
                fraction1.getElementsByClassName('colored').length === 6;
        }
    }

    function watchMouseMovement() {
        var tolerance = 50;
        var msTotalMouseMovement = 0;
        var lastMouseMove = 0;
        var mouseMoved = false;

        document.onmousemove = function(evt){
            if(lastMouseMove === 0) {
                lastMouseMove = new Date().getTime();
                mouseMoved = true;
                return ;
            } else {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - lastMouseMove;
                if(deltaTime < tolerance){
                    msTotalMouseMovement += deltaTime;    
                }
                lastMouseMove = currentTime;
            }
        };
    }

    YoutubeAnalytics.initializeYouTubePlayer();
    YoutubeAnalytics.videoEndCallback = function() {
        document.getElementById('followup_question').style.display = 'block';
    };
    initializeFractions();
    watchMouseMovement();
};
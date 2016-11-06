window.onload = function () {
    var correctAnswer = false;
    

    function initializeCoins() {
        var submitBtn = document.getElementById('submit_btn');
        var purse = document.getElementById('purse');
        var countertop = document.getElementById('countertop');
        
        var coins = document.getElementsByClassName('coin');
        var totalCoins = coins.length;
        for(var i = 0; i < totalCoins; i++) {
            coins[i].addEventListener('dragstart', startDraggingCoin);
        }

        purse.addEventListener('dragover', allowCoinDrop);
        purse.addEventListener('drop', dropCoin);

        countertop.addEventListener('dragover', allowCoinDrop);
        countertop.addEventListener('drop', dropCoin);

        submitBtn.addEventListener('click', checkAnswer);

        function startDraggingCoin(evt) {
            evt.dataTransfer.setData('coin', evt.target.parentNode.id);
        }

        function allowCoinDrop(evt) {
            evt.preventDefault();
        }

        function dropCoin(evt) {
            evt.preventDefault();
            
            var data = evt.dataTransfer.getData('coin');
            evt.target.appendChild(document.getElementById(data));
        }

        function checkAnswer(evt) {
            var selectedCoins = countertop.getElementsByClassName('coin');
            var totalCoins = selectedCoins.length;
            var totalCents = 0;
            for(var i = 0; i < totalCoins; i++) {
                var coinType = selectedCoins[i].childNodes[1].className;
                switch(coinType) {
                    case 'penny':
                        totalCents += 1;
                        break;
                    case 'nickel':
                        totalCents += 5;
                        break;
                    case 'dime':
                        totalCents += 10;
                        break;
                    case 'quarter':
                        totalCents += 25;
                        break;
                }
            }
            correctAnswer = (totalCents === 13);
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
    initializeCoins();
    watchMouseMovement();
};
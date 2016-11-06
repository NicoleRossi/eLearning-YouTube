window.onload = function () {
    var product = 1;
    var productStr = '';
    var correctAnswer = false;
    

    function initializeFractions() {
        var submitBtn = document.getElementById('submit_btn');
        var numberPool = document.getElementById('number_pool');
        var factorArea = document.getElementById('factor_area');
        var factoredEquation = document.getElementById('factored_eqn');
        
        var numbers = document.getElementsByClassName('number');
        var totalNumbers = numbers.length;
        for(var i = 0; i < totalNumbers; i++) {
            numbers[i].addEventListener('dragstart', startDraggingNumber);
        }

        numberPool.addEventListener('dragover', allowNumberDrop);
        numberPool.addEventListener('drop', dropNumberOverNumberPool);

        factorArea.addEventListener('dragover', allowNumberDrop);
        factorArea.addEventListener('drop', dropNumberOverFactorArea);

        submitBtn.addEventListener('click', checkAnswer);

        function dropNumberOverNumberPool (evt) {
            var data = evt.dataTransfer.getData('number');
            if(data.indexOf('_copy') !== -1) {
                var droppedNumber = document.getElementById(data);
                factorArea.removeChild(droppedNumber);
                evaluateFactors();
            }
        }

        function startDraggingNumber(evt) {
            evt.dataTransfer.setData('number', evt.target.parentNode.id);
        }

        function allowNumberDrop(evt) {
            evt.preventDefault();
        }

        function dropNumberOverFactorArea(evt) {
            var data = evt.dataTransfer.getData('number');
            if(data.indexOf('_copy') !== -1) return ;

            evt.preventDefault();
            
            var copiedNumber = document.getElementById(data).cloneNode(true);
            copiedNumber.id = "" + data + '_copy';
            copiedNumber.addEventListener('dragstart', startDraggingNumber);

            evt.target.appendChild(copiedNumber);

            evaluateFactors();
        }

        function evaluateFactors() {
            var droppedNumbers = factorArea.getElementsByClassName('number');
            var totalDroppedNumbers = droppedNumbers.length;
            product = 1;
            productStr = '';
            for(var i = 0; i < totalDroppedNumbers; i++) {
                var imageNode = droppedNumbers[i].childNodes[1];
                switch(imageNode.className) {
                    case 'two':
                        updateProduct(2, i);
                        break;
                    case 'three':
                        updateProduct(3, i);
                        break;
                    case 'five':
                        updateProduct(5, i);
                        break;
                    case 'seven':
                        updateProduct(7, i);
                        break;
                }
            }
            productStr += product;
            
            if(product !== 1) {
                factoredEquation.innerText = productStr;
            } else {
                factoredEquation.innerText = '';
            }
            
            function updateProduct(factor, i) {
                product *= factor;
                if(i === totalDroppedNumbers - 1) {
                    productStr += factor + " = "
                } else {
                    productStr += factor + " x "
                }
            }
        }

        function checkAnswer(evt) {
            return product === 144;
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
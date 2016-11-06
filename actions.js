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
            console.log("data = " + data);
            evt.target.appendChild(document.getElementById(data));
        }

        function checkAnswer(evt) {
            var selectedCoins = countertop.getElementsByClassName('coin');
            var totalCoins = selectedCoins.length;
            var totalCents = 0;
            for(var i = 0; i < totalCoins; i++) {
                var coinType = selectedCoins[i].childNodes[1].className;
                console.log('coinType = ')
                console.log(coinType);
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

    var youtubeAnalytics = {
        replay: false,
        replayCount: 0,
        previousVolume: 50, // "slash" initial volume
        increasedVolume: false,
        decreasedVolume: false,
        mutedObjs: [],
        msTotalTimeMuted: 0,
        mutedVideo: false,
        pausedVideo: false,
        pauseObjs: [],
        msTotalTimePaused: 0
    };
    youtubeAnalytics.initializeYouTubePlayer = function () {
        var context = this;

        var ytPlayer;
        var msRefreshRate = 40;
        var analyticsTimeout;

        var mutedimestamp = 0;
        var pausedTimestamp = 0;
        
        var firstPlayBegun = false;

        window.onYouTubeIframeAPIReady = function () {
            console.log('onYouTubeIframeAPIReady');
            ytPlayer = new YT.Player('youtubePlayer', {
                height: '390',
                width: '640',
                videoId: 'iZZ580bieKo',
                events: {
                    'onReady': onPlayerReady.bind(context),
                    'onStateChange': onPlayerStateChange.bind(context),
                    'onApiChange': onApiChange.bind(context)
                }
            });
        }

        // Polite load; I'm a creature of habit.
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';

        console.log('tag = ' + tag);

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        function onPlayerReady(evt) {
            console.log('onPlayerReady');
            ytPlayer.setVolume(this.previousVolume);
            ytPlayer.playVideo();
            analyticsTimeout = setTimeout(checkPlayerStatus.bind(context), msRefreshRate);
        }

        function onApiChange(evt) {
            console.log('onApiChange');
        }

        function onPlayerStateChange(evt) {
            console.log('onPlayerStateChange');
            
            switch(evt.data) {
                case YT.PlayerState.BUFFERING:
                    console.log('YT.PlayerState.BUFFERING = ' + YT.PlayerState.BUFFERING);
                    break;
                case YT.PlayerState.ENDED:
                    console.log('YT.PlayerState.ENDED = ' + YT.PlayerState.ENDED);
                    this.replay = true;
                    clearTimeout(analyticsTimeout);
                    break;
                case YT.PlayerState.PLAYING:
                    console.log('YT.PlayerState.PLAYING = ' + YT.PlayerState.PLAYING);
                    if(!firstPlayBegun) {
                        firstPlayBegun = true;
                        this.mutedVideo = ytPlayer.isMuted();
                    } else if(this.pausedVideo) {
                        this.pausedVideo = false;
                        var lastPauseObj = this.pauseObjs[this.pauseObjs.length - 1];
                        lastPauseObj.totalTime = new Date().getTime() - pausedTimestamp;
                        this.msTotalTimePaused += lastPauseObj.totalTime;
                    } else if (this.replay) {
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        this.replayCount++;
                        analyticsTimeout = setTimeout(checkPlayerStatus.bind(this), msRefreshRate);
                    }
                    break;
                case YT.PlayerState.PAUSED:
                    console.log('YT.PlayerState.PAUSED = ' + YT.PlayerState.PAUSED);
                    this.pausedVideo = true;
                    pausedTimestamp = new Date().getTime();
                    var newPause = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    this.pauseObjs.push(newPause);
                    break;
                case YT.PlayerState.CUED:
                    console.log('YT.PlayerState.CUED = ' + YT.PlayerState.CUED);
                    break;
            }
        }

        function checkPlayerStatus() {
             //if this is the first time we pick up a mute
            if(ytPlayer.isMuted()) {
                console.log("this.mutedVideo");
                console.log(this.mutedVideo);

                if(!this.mutedVideo) {
                    this.mutedVideo = true;
                    mutedTimestamp = new Date().getTime();
                    
                    var newMute = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    this.mutedObjs.push(newMute);
                    this.previousVolume = 0;
                } else {
                    // do nothing but wait
                }
            } else {
                var currentVolume = ytPlayer.getVolume();
                
                if(currentVolume > this.previousVolume) {
                    this.increasedVolume = true;
                } else if(currentVolume < this.previousVolume) {
                    this.decreasedVolume  = true;
                }

                //if this is the first time we pick up a mute
                if(currentVolume === 0 && !this.mutedVideo) {
                    this.mutedVideo = true;
                    mutedTimestamp = new Date().getTime();
                    //console.log('mutedTimestamp = ' + mutedTimestamp);
                    var newMute = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    this.mutedObjs.push(newMute);
                //if this is the first time since muting the video context the volume goes up
                } else if (this.previousVolume === 0 && currentVolume > 0) {
                    this.mutedVideo = false;
                    var lastMuteObj = this.mutedObjs[this.mutedObjs.length - 1];
                    this.mutedObjs.totalTime = new Date().getTime() - mutedTimestamp;
                    this.msTotalTimeMuted += this.mutedObjs.totalTime;
                }

                this.previousVolume = currentVolume;
            }
            analyticsTimeout = setTimeout(checkPlayerStatus.bind(context), msRefreshRate);
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

    youtubeAnalytics.initializeYouTubePlayer();
    initializeCoins();
    watchMouseMovement();
};

window.onload = function () {
    initializeYouTubePlayer ();
    watchMouseMovement();

    function initializeYouTubePlayer() {
        var ytPlayer;
        var msRefreshRate = 40;
        var analyticsTimeout;

        var replay = false;
        var replayCount = 0;


        var previousVolume = 50; // "slash" initial volume
        var increasedVolume = false;
        var decreasedVolume = false;
        var mutedimestamp = 0;
        var mutedObjs = [];
        var msTotalTimeMuted = 0;
        var mutedVideo = false;

        var firstPlayBegun = false;

        var pausedVideo = false;
        var pausedTimestamp = 0;
        var pauseObjs = [];
        var msTotalTimePaused = 0;

        window.onYouTubeIframeAPIReady = function () {
            console.log('onYouTubeIframeAPIReady');
            ytPlayer = new YT.Player('youtubePlayer', {
                height: '390',
                width: '640',
                videoId: 'iZZ580bieKo',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onApiChange': onApiChange
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
            ytPlayer.setVolume(previousVolume);
            ytPlayer.playVideo();
            analyticsTimeout = setTimeout(checkPlayerStatus, msRefreshRate);
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
                    replay = true;
                    clearTimeout(analyticsTimeout);
                    break;
                case YT.PlayerState.PLAYING:
                    console.log('YT.PlayerState.PLAYING = ' + YT.PlayerState.PLAYING);
                    if(!firstPlayBegun) {
                        firstPlayBegun = true;
                        mutedVideo = ytPlayer.isMuted();
                    } else if(pausedVideo) {
                        pausedVideo = false;
                        var lastPauseObj = pauseObjs[pauseObjs.length - 1];
                        lastPauseObj.totalTime = new Date().getTime() - pausedTimestamp;
                        msTotalTimePaused += lastPauseObj.totalTime;
                    } else if (replay) {
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        console.log("REPLAY!");
                        replayCount++;
                        analyticsTimeout = setTimeout(checkPlayerStatus, msRefreshRate);
                    }
                    break;
                case YT.PlayerState.PAUSED:
                    console.log('YT.PlayerState.PAUSED = ' + YT.PlayerState.PAUSED);
                    pausedVideo = true;
                    pausedTimestamp = new Date().getTime();
                    var newPause = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    pauseObjs.push(newPause);
                    break;
                case YT.PlayerState.CUED:
                    console.log('YT.PlayerState.CUED = ' + YT.PlayerState.CUED);
                    break;
            }
        }

        function checkPlayerStatus() {
             //if this is the first time we pick up a mute
            if(ytPlayer.isMuted()) {
                if(!mutedVideo) {
                    mutedVideo = true;
                    mutedTimestamp = new Date().getTime();
                    console.log('mutedTimestamp = ' + mutedTimestamp);
                    var newMute = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    mutedObjs.push(newMute);
                    previousVolume = 0;
                } else {
                    // do nothing but wait
                }
            } else {
                var currentVolume = ytPlayer.getVolume();
                console.log("currentVolume = " + currentVolume);
               
                if(currentVolume > previousVolume) {
                    increasedVolume = true;
                } else if(currentVolume < previousVolume) {
                    decreasedVolume  = true;
                }

                //if this is the first time we pick up a mute
                if(currentVolume === 0 && !mutedVideo) {
                    mutedVideo = true;
                    mutedTimestamp = new Date().getTime();
                    //console.log('mutedTimestamp = ' + mutedTimestamp);
                    var newMute = { 
                        startTime: ytPlayer.getCurrentTime(),
                        totalTime: 0
                    };
                    mutedObjs.push(newMute);
                //if this is the first time since muting the video that the volume goes up
                } else if (previousVolume === 0 && currentVolume > 0) {
                    mutedVideo = false;
                    var lastMuteObj = mutedObjs[mutedObjs.length - 1];
                    mutedObjs.totalTime = new Date().getTime() - mutedTimestamp;
                    msTotalTimeMuted += mutedObjs.totalTime;

                    console.log('msTotalTimeMuted = ' + msTotalTimeMuted)
                }

                previousVolume = currentVolume;
            }
            analyticsTimeout = setTimeout(checkPlayerStatus, msRefreshRate);
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
};

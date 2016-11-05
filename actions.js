window.onload = function () {
    initializeYouTubePlayer ();
    watchMouseMovement();

    function initializeYouTubePlayer() {
        var ytPlayer;
        var msRefreshRate = 40;

        var previousVolume = 50; // "slash" initial volume
        var increasedVolume = false;
        var decreasedVolume = false;
        var mutedVideo = false;

        var pausedVideo = false;
        var pauseObjs = [];
        var totalTimePaused = 0;

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
            setTimeout(checkPlayerStatus, msRefreshRate);
        }

        function onApiChange(evt) {
            console.log('onApiChange');
            var captions = ytPlayer.getOptions('captions', 'fontSize' );
            console.log(captions);
            for(var prop in captions)
                console.log('captions[' + prop + '] = ' + captions[prop]);
        }

        function onPlayerStateChange(evt) {
            console.log('onPlayerStateChange');
            
            switch(evt.data) {
                case YT.PlayerState.BUFFERING:
                    console.log('YT.PlayerState.BUFFERING = ' + YT.PlayerState.BUFFERING);
                    break;
                case YT.PlayerState.ENDED:
                    console.log('YT.PlayerState.ENDED = ' + YT.PlayerState.ENDED);
                    break;
                case YT.PlayerState.PLAYING:
                    console.log('YT.PlayerState.PLAYING = ' + YT.PlayerState.PLAYING);
                    break;
                case YT.PlayerState.PAUSED:
                    console.log('YT.PlayerState.PAUSED = ' + YT.PlayerState.PAUSED);
                    break;
                case YT.PlayerState.CUED:
                    console.log('YT.PlayerState.CUED = ' + YT.PlayerState.CUED);
                    break;
            }
        }

        function checkPlayerStatus() {
            var currentVolume = ytPlayer.getVolume();
           
            if(currentVolume > previousVolume) {
                increasedVolume = true;
            } else if(currentVolume < previousVolume) {
                decreasedVolume  = true;
            }

            if(currentVolume === 0) {
                mutedVideo = true;
            }

            previousVolume = currentVolume;
            setTimeout(checkPlayerStatus, msRefreshRate);
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
var YoutubeAnalytics = (function (YoutubeAnalytics) {
    YoutubeAnalytics.replay = false;
    YoutubeAnalytics.replayCount = 0;
    YoutubeAnalytics.previousVolume = 50; // "slash" initial volume
    YoutubeAnalytics.increasedVolume = false;
    YoutubeAnalytics.decreasedVolume = false;
    YoutubeAnalytics.mutedObjs = [];
    YoutubeAnalytics.msTotalTimeMuted = 0;
    YoutubeAnalytics.mutedVideo = false;
    YoutubeAnalytics.pausedVideo = false;
    YoutubeAnalytics.pauseObjs = [];
    YoutubeAnalytics.msTotalTimePaused = 0;
    

    YoutubeAnalytics.initializeYouTubePlayer = function () {
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
                    console.log('videoEndCallback');
                    console.log(this.videoEndCallback);
                    if(this.videoEndCallback) {
                        this.videoEndCallback();
                    }
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
    return YoutubeAnalytics;
})(window.YoutubeAnalytics || {});
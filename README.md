# eLearning-YouTube
Analytics for YouTube-based eLearning

# User Experiences
1. Comparing Mixed Fractions (fractions.html)
  * color in each fraction
  * select with radio button the largest
2. Paying for Items with US Currency (money.html)
  * drag and drop the appropriate coins to the "sales counter"
  * simple multiplication; possible decimal use
3. Simple Factoring (simple_factoring.html)
  * drag and drop numbers to the "calculation box" to see the multiplication result below
  * draws on multiplication table knowledge

* Please pretend the provided video has something to do with the mathematical topics at hand; if you're not a fan of dogs or Subaru, you can provide a Youtube video ID to `YoutubeAnalytics.initializeYouTubePlayer();` in associated .js file.
* For each user experience, click "Done" when complete.  If you are correct, the JSON analytics (see below) display in an alert; otherwise the alert displays "Try again!"
  
# How to Read JSON labels
* **decreasedVolume**
  * Did the user lower the volume? (true/false)
* **increasedVolume**
  * Did the user raise the volume?  (true/false)
* **finalVolume**
  * What volume did the user finally decide upon?  Or rather, what was the volume when the video ended? (0 through 100)
* **mutedObjs**
  * Array of muting incidents
  * Each element contains
    * **startTime**
      * When in the video did the user mute?
    * **msMuteDuration**
      * How long (in milliseconds) did the mute last?
* **msTotalTimeMuted**
  * In total, how long was the video muted (in milliseconds)?
* **pauseObjs**
  * Array of pausing incidents
  * Each element contains
    * **startTime**
      * When in the video did the user pause?
    * **msPauseDuration**
      * How long (in milliseconds) did the pause last?
* **msTotalTimePaused**
  * In total, how long was the video paused (in milliseconds)?
* **playObjs**
  * Array of resuming incidents
  * Each element contains
    * **resumeTime**
      * When in the video did the user resume playback?
* **quartiles**
  * Properties vary with video length; each property represents the video position for 25%, 50%, 75%, and 100% playback (true/false)
* **replayCount**
  * How many times did the user replay the video? (0+)
  
# Notes
* Originally, I wanted to track closed caption use, but Google's [HTML5 Youtube API](https://developers.google.com/youtube/iframe_api_reference) doesn't offer any methods or functions to determine the closed caption status.
* Similarly, I wanted to track seeking behavior, but Google's HTML Youtube API behaves strangly in this case.  First, it pauses the video and sets the current time to 0.00039... so I cannot retreive the exact time at which the pause occured; thus I save the current time during the volume polling function (`checkPlayerStatus()`).  The truly odd behavior is that the API "detects" the new playback position (e.g. from dragging the slider) and sets the current position to it *before* firing the Youtube play event, which breaks the aforementioned polling (e.g. watching for a change from roughly 0 to some value greater than 0 in response to the play event doesn't work).  In order to properly monitor seeking, I would have to keep a history of the playback positions and analyze it for the pattern of forward progress, followed by approximately 0, followed by some completely different playback position.  Given the complexity of the solution, tracking seeking behavior is beyond the scope of one weekend.

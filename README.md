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
 
* For each user experience, click "Done" when complete.  If you are correct, the JSON analytics (see belore) display in an alert; otherwise the alert displays "Try again!"
  
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
* **replayCount **
  * How many times did the user replay the video? (0+)

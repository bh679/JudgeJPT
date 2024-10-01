// backgroundMusic.js

class AudioManager {

    constructor(messageUI) {
        // Create an instance of BackgroundMusicManager
        this.musicManager = new BackgroundMusicManager();
        this.voiceManager = messageUI;

        this.audioOn = false;
        this.musicOn = true;
        this.voiceOn = true;

        this.masterVolume = 1;
        this.musicVolume = 0.25;
        this.voiceVolume = 1;

        this.setMasterVolume(this.masterVolume);

    }

    toggleMusic(isMusicOn) {
        if(!this.audioOn)
            return;

        this.musicOn = isMusicOn;
        this.musicManager.toggleMusic(this.musicOn);
    }

    // Function to handle the audio toggle
    toggleVoice(isVoiceOn) {

        if(!this.audioOn)
            return;

        this.voiceOn = isVoiceOn;
        this.voiceManager.ToggleVoices(this.voiceOn);
    }

    toggleAudio(isAudioOn)
    {
        this.audioOn = isAudioOn;

        this.toggleMusic(this.musicOn);
        this.toggleVoice(this.voiceOn);

    }

    setMasterVolume(masterVolume)
    {
        this.masterVolume = masterVolume;

        this.musicManager.setVolume(this.musicVolume * this.masterVolume);
    }

    


}

class BackgroundMusicManager {
    constructor() {
        // Array of music tracks
        this.tracks = [
            './music/JGPT_1.mp3', // Path to the first track
            './music/JGPT_2.mp3', // Path to the second track
            './music/JGPT_3.mp3', // Path to the third track
            './music/JGPT_4.mp3'  // Path to the fourth track
        ];

        this.currentTrackIndex = null;
        this.audioElement = new Audio();
        this.audioElement.loop = false; // Disable built-in loop, we'll handle it manually
        this.audioEnabled = false; // Audio is initially off

        // Add an event listener to play the next track when the current one ends
        this.audioElement.addEventListener('ended', () => this.playRandomTrack());
    }

    // Function to randomly select a track
    getRandomTrackIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.tracks.length);
        } while (newIndex === this.currentTrackIndex);
        return newIndex;
    }

    // Function to play a random track
    playRandomTrack() {
        if (this.audioEnabled) {
            this.currentTrackIndex = this.getRandomTrackIndex();
            this.audioElement.src = this.tracks[this.currentTrackIndex];
            this.audioElement.play();
        }
    }

    // Enable or disable audio
    toggleMusic(enable) {
        this.audioEnabled = enable;
        if (this.audioEnabled) {
            this.playRandomTrack();
        } else {
            this.audioElement.pause();
        }
    }

    // Function to set music volume (between 0.0 and 1.0)
    setVolume(volume) {
        // Ensure volume is within the valid range
        if (volume >= 0 && volume <= 1) {
            this.audioElement.volume = volume;
        } else {
            console.error("Volume must be between 0.0 and 1.0");
        }
    }
}
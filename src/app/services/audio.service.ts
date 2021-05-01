import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  

  audio = new Audio();

  analyser
  tailleMemoireTampon
  tableauDonnees

  constructor() { }

  //window.AudioContext = window.AudioContext;

  playStream() {

    const context = new AudioContext();

    this.audio.crossOrigin = 'anonymous';

    this.analyser = context.createAnalyser();

    const sourceAudio = context.createMediaElementSource(this.audio);
    sourceAudio.connect(this.analyser);
    sourceAudio.connect(context.destination);

    const playHandler = () => {
      this.audio.play();
      this.audio.removeEventListener('canplaythrough', playHandler);
    };
    const errorHandler = e => {
      console.error('Error', e);
      this.audio.removeEventListener('error', errorHandler);
    };

    this.audio.addEventListener('canplaythrough', playHandler, false);
    this.audio.addEventListener('error', errorHandler);

    this.audio.src = 'https://res.cloudinary.com/cbpicstore/video/upload/v1619797197/Music/Firecrackers-Inside-Mastered_m8ro3m.mp3';

    this.analyser.fftSize = 32;    
    this.tailleMemoireTampon = this.analyser.frequencyBinCount;
    this.tableauDonnees = new Uint8Array(this.tailleMemoireTampon);
    this.analyser.getByteFrequencyData(this.tableauDonnees);

    console.log(this.tableauDonnees)
    }  

  resumeStream() {
    this.audio.play();
    
  }

  pauseStream() {
    this.audio.pause();
  }
}

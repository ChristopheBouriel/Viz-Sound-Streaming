import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AudioService {  

  private audioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
  private audio = new Audio();  // Création d'un objet HTMLAudioElement
  private datasSetSize: number;
  
  frequenciesDatas;
  analyser;

  error$ = new BehaviorSubject<string>(''); // Création d'un observable BehaviorSubject qui émettra un event pour ses subscribers
                                            // et leur passera la valeur : comme il la garde en tant que BehaviorSubject, elle restera
                                            // accessible même lors d'une subscription ultérieure à l'émission du dernier event ( il faut
                                            // donc lui fournir une valeur inititale, ici une string vide)

  userMessage$ = new BehaviorSubject('');

  constructor() { }

  playStream(source) {
    const context = new AudioContext({
      latencyHint: 'interactive',
      sampleRate: 44100,
    }); // Création d'un objet AudioContext
    
    this.audio.crossOrigin = 'anonymous'; // Règle le problème de CORS policy... si le header est présent dans la réponse du serveur
    this.analyser = context.createAnalyser(); // Création d'un objet AnalyserNode permettant de
                                              // récolter des données sur le flux audio, comme
                                              // des données sur les fréquences par exemple
    const sourceAudio = context.createMediaElementSource(this.audio); // Création d'un objet MediaElementAudioSourceNode
                                                                      // d’après le HTMLAudioElement créé plus haut
    sourceAudio.connect(this.analyser); // On connecte l'analyseur au flot de données
    sourceAudio.connect(context.destination); // On connecte le flot à la destination, par défaut les HP de mon PC par exemple
    const playHandler = () => {
      this.audio.play(); // Appel de la méthode play() de l'objet HTMLAudioElement qui renvoie une Promise
      this.audio.removeEventListener('canplaythrough', playHandler); // Si la Promise a été résolue, un event 'canplaythrough'
                                                                     // est lancé et on supprime le EventListener pour ce type de event :
                                                                     // il n'appelera donc plus la fonction playHandler() attachée, par 
                                                                     // exemple à chaque fois que l'on appelera la méthode Play() après
                                                                     // avoir appelé Pause()
    };
    const errorHandler = e => {
      console.error('Error', e); // Si la promesse a été rejetée, un event error a été lancé, la fonction errorHandler attachée à celui-ci a été appelée
                                 // et le message d'erreur sera affiché dans la console
      this.error$.next('Sorry, the access to this stream has been blocked by the browser, please refresh the page and try an other URL'); // On passe la string à l'observable BehaviorSubject qui lui
                                                                                                                           // même émettra un event pour son subscriber et lui passera le texte à afficher
      this.audio.removeEventListener('error', errorHandler); // On supprime le EventListener pour ce type de event
    };
    this.audio.addEventListener('canplaythrough', playHandler, false); // On ajoute un EventListener pour les events de type canplaythrough
                                                                       // afin de savoir quand la lecture devient possible, la fonction attachée
                                                                       // playHandler() est appelée (elle ne le sera plus car on supprime cet EventListener
                                                                       // au sein de celle-ci, ce qui par ailleurs pourrait poser des problèmes avec certains navigateurs)
    this.audio.addEventListener('error', errorHandler); // On ajoute un EventListener pour les events de type canplaythrough
                                                        // afin de savoir quand la lecture devient possible, la fonction attachée errorHandler() est appelée
    
    const endOfStreamHandler = () => {
      setTimeout(
        () => {
          this.userMessage$.next('End of stream, please refresh the page to start a new one');
        },2000
      )      
    }

    this.audio.addEventListener('ended', endOfStreamHandler)
    
    this.audio.src = source; // On indique à l'objet HTMLAudioElement la string correspondant à l'URL, que l'on a passé en argument lors de l'appel de
                             // la fonction playStream() depuis le composant viz-track

    this.analyser.fftSize = 32; // On indique la valeur de la propriété fft* de l'objet Analyser. *C'est la taille de la Fast Fourrier Transformation
                                // à utiliser pour déterminer le domaine fréquentiel

    this.datasSetSize = this.analyser.frequencyBinCount; // On récupère la taille du set de valeurs, la moitié de la valeur de fftSize (ici 16)
    this.frequenciesDatas = new Uint8Array(this.datasSetSize); // On créé un array d'un type spécial pour les besoins de la méthode getByteFrequencyData()
                                                               // de l'objet Analyser.
                                                               // On appelera cette méthode depuis le service incoming-datas-simulator, puisque c'est celui-ci
                                                               // qui manipule les données et qu'il a été séparé volontairement
                                                               // Cette méthode prend en paramètre le tableau des données de fréquences et modifie les valeurs
                                                               // directement dans celui-ci ; il suffit de le parcourir après avoir appelé la méthode pour accéder
                                                               // au valeurs enregistrées au moment de cet appel
    }  

  resumeStream() {
    this.audio.play(); // Appel de la méthode play() de l'objet HTMLAudioElement après avoir mis en pause
  }

  pauseStream() {
    this.audio.pause(); // Appel de la méthode pause() de l'objet HTMLAudioElement après avoir mis en pause
  }
}

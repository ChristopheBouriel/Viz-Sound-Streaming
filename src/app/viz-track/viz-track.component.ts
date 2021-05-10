import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { IncomingDatasSimulatorService } from '../services/incoming-datas-simulator.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-viz-track',
  templateUrl: './viz-track.component.html',
  styleUrls: ['./viz-track.component.scss']
})
export class VizTrackComponent implements OnInit, OnDestroy {

  started: boolean;
  ended: boolean = false;
  paused: boolean;
  datas : Array<number>
  errorMsg: string;
  userMessage: string;
  goDown: boolean;
  sourceForm: FormGroup;
  tendancyDatas: string[] = [];
  tendancyColors: string[] = [];
  tendancyColorsBottom: string[] = [];
  timer: Date;

  componentDestroyed$: Subject<boolean> = new Subject() // Creation d'un observable qui permettra d'annuler toutes les souscriptions en même temps
                                                        // lors de la destruction du composant – voir ngOnDestroy() – grâce à l'utilisation d'un pipe
                                                        // et de l'opérateur takeUntil – voir toutes les souscriptions

  constructor(private audioService: AudioService,
              private ids: IncomingDatasSimulatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let datasInit = new Array(16).fill(5); // Déclaration puis initialisation d'un array correspondant à l'affichage initial des barres
    this.datas = datasInit; // Copie de l'array d'initialisation dans celui qui sera utilisé pour le binding avec le template

    this.ids.datas$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable datas$ pour capter les données de fréquence chaque fois qu'il en émettra
      (datas:number[]) => {
        this.datas = datas; // Quand des données sont présentées, on les passe à l'array datas pour utilisation par le template
      }
    );
    
    this.sourceForm = this.formBuilder.group({
      source: new FormControl(null, [Validators.required, Validators.pattern('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?')])
    });

    this.infosSubscriptions();
  }

  infosSubscriptions() {
    this.audioService.error$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable error$ pour capter la string indiquant l'erreur survenue chaque fois qu'il en émettra une
      (error: string) => {
        if (error) {
          this.errorMsg = error;
        }
      }
    );

    this.audioService.userMessage$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable userMessage$ pour capter la string correspondant au message chaque fois qu'il en émettra une
      (message: string) => {
        if (message) {
          this.userMessage = message;
          this.started = false;
          this.ended = true;
        }
      }
    );

    this.ids.clock$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable clock$ pour capter la valeur correspondant au temps de lecture écoulé en millisecondes
      timer => {
        this.timer = new Date(0,0,0);
        this.timer.setSeconds(timer/1000) // Transformation des millisecondes en format date pour utilisation par le pipe Angular – voir commentaire dans le template du composant
      }
    )
  }

  playIt() {
    const source = this.sourceForm.get('source').value; // Récupération de l'URL dans le formulaire
    setTimeout( // Déclanchement d'un setTimeout afin d'attendre la fin de l'animation afin que les barres de visualisation soient
                // en place avant de commencer à leur transmettre des directives + une marge de 200ms
      () => {
        this.audioService.playStream(source); // Appel de la fonction playStream du service audio.service en lui passant l'argument
        this.ids.checkFrequencies(); // Appel initial de la fonction checkFrequencies() du service incoming-datas-simulator
                                     // Grâce à l'observable il ne sera pas nécessaire de l'appeler à nouveau en cas de reprise de la lecture
                                     // après interruption puisque ses instructions s'exécuteront dès que ce dernier aura émis une valeur
        this.goDown = false;
        this.getTendancySubscriptions();
        
      },1200);
    this.started = true;
    this.goDown = true; // Déclanchement de l'animation de début de lecture avec une directive par attribut  
  }

  pauseIt() {
    this.audioService.pauseStream(); // Appel de la fonction pauseStream() du service audio.service pour interrompre la lecture
    this.paused = true;
    
  }

  resumeIt(initialUserAction) {
    this.audioService.resumeStream(initialUserAction); // Appel de la fonction resumeStream() du service audio.service pour relancer la lecture
    this.paused = false;
    
    this.ids.clock$.next(this.timer.getSeconds()*1000); // On passe le temps de lecture en millisecondes à l'observable pour qu'il émette cette valeur afin de relancer la capture
                                                        // de données de fréquences
                                                        // Si l'on considère que le modèle doit être la "seule source de vérité", il vaudrait mieux lui passer la valeur de la
                                                        // variable count du service incoming-datas-simulator transformée en millisecondes : this.ids.clock$.next(this.ids.count*100);

    //this.ids.checkFrequencies() // Pour le cas où l'on n'utilise pas d'observable dans cette fonction : voir commentaires dans
                                  // le service incoming-datas-simulator
                                  // La ligne de code précédente pourra être passée en commentaire
  }

  getTendancySubscriptions() { // Souscription à tous les observables émettant la nouvelle tendance pour une donnée de fréquence
    for (let i=0; i<16; i++) {
          this.ids['t' + (i + 1) + '$'].pipe(takeUntil(this.componentDestroyed$)).subscribe(
            (tend: number) => {this.tendancyDatas[i] = this.checkTend(tend, i)})
        }
  }

  getHeights(bar) { // Chaque barre appelle la fonction, en lui passant son index en paramètre, grâce à une directive [ngStyle]
    return (this.datas[bar]*3/4) + 5 + 'px';    
  }

  checkTend(tend, i) { // On aurait pu éviter cette fonction en envoyant directement la string depuis le service, mais j'ai préfèré
                    // séparer la logique de l'affichage, d'autant que les données numériques peuvent être utilisées pour autre
                    // chose, calcul et/ou type d'affichage différent 
    if (tend === -1) {
          this.tendancyColors[i] = '#00ab00';
          this.tendancyColorsBottom[i] = '#31c5ff';
          return '\\'
        } else if (tend === 1) {
          this.tendancyColors[i] = '#004d00';
          this.tendancyColorsBottom[i] = '#1d7ea4';
          return '/'
        } else {
          this.tendancyColors[i] = 'green';
          this.tendancyColorsBottom[i] = '#27a0d0';
          return '–'
        }  
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true); // Emission de la valeur true pour l'opérateur takeUntil du pipe afin d'annuler toutes les souscriptions
    this.componentDestroyed$.complete(); // Appel de la méthode complete() qui aura pour effet d'annuler la souscription de cet observable lui-même
  }
}

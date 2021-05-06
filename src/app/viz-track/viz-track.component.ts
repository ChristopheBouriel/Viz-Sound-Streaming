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
  paused: boolean;
  datas : Array<number>
  errorMsg: string;
  goDown: boolean;
  sourceForm: FormGroup;
  tendancyDatas: string[] = [];
  timer: Date;

  componentDestroyed$: Subject<boolean> = new Subject() // Creation d'un observable qui permettra d'annuler toutes les souscriptions en même temps
                                                        // lors de la destruction du composant – voir ngOnDestroy() – grâce à l'utilisation d'un pipe
                                                        // et de l'opérateur takeUntil – voir toutes les souscriptions

  constructor(private audioService: AudioService,
              private ids: IncomingDatasSimulatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let datasInit = []; // Déclaration puis initialisation d'un array correspondant à l'affichage initial des barres
    for(let i=0; i<16; ++i) {
      datasInit[i] = 5;
    };
    this.datas = datasInit; // Copie de l'array d'initialisation dans celui qui sera utilisé pour le binding avec le template

    this.ids.datas$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable datas$ pour capter les données de fréquence chaque fois qu'il en émettra
      (datas:number[]) => {
        this.datas = datas; // Quand des données sont présentées, on les passe à l'array datas pour utilisation par le template
      }
    );
    
    this.sourceForm = this.formBuilder.group({
      source: new FormControl(null, [Validators.required, Validators.pattern('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?')])
    });

    this.audioService.error$.pipe(takeUntil(this.componentDestroyed$)).subscribe( // Souscription à l'observable error$ pour capter la string indiquant l'erreur survenue chaque fois qu'il en émettra une
      (error: string) => {
        if (error) {
          this.errorMsg = error;
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
                                     // après interruption puisque ses instructions s'exécuteront dès que ce dernier aura émis la valeur true
        this.goDown = false;
        this.getSubscription();
      },1000);
    this.started = true;
    this.goDown = true; // Déclanchement de l'animation de début de lecture avec une directive par attribut  
  }

  pauseIt() {
    this.audioService.pauseStream(); // Appel de la fonction pauseStream du service audio.service pour interrompre la lecture
    this.paused = true;
    this.ids.streaming = false;
  }

  resumeIt() {
    this.audioService.resumeStream(); // Appel de la fonction resumeStream du service audio.service pour relancer la lecture
    this.paused = false;
    this.ids.streaming = true;
    this.ids.clock$.next(this.timer.getSeconds()*1000); // On passe true à l'observable pour qu'il émette cette valeur afin de relancer la capture
                                                        // de données de fréquences
                        
    //this.ids.checkFrequencies() // Pour le cas où l'on n'utilise pas d'observable dans cette fonction : voir commentaires dans
                                  // le service incoming-datas-simulator
                                  // La ligne de code précédente pourra être passée en commentaire
  }

  getSubscription() { // Subscription à tous les observables émettant la nouvelle tendance pour une donnée de fréquence
    for (let i=0; i<16; i++) {
          this.ids['t' + (i + 1) + '$'].pipe(takeUntil(this.componentDestroyed$)).subscribe(
            (tend: number) => {this.tendancyDatas[i] = this.checkTend(tend)})
        }
  }

  getHeights(bar) { // Chaque barre appele la fonction en lui passant son index en paramètre grâce à une directive [ngStyle]
    return (this.datas[bar]*3/4) + 5 + 'px';    
  }

  checkTend(tend) { // On aurait pu éviter cette fonction en envoyant directement la string depuis le service mais j'ai préfèré
                    // séparer la logique de l'affichage, d'autant que les données numériques pourrait être utilisées pour autre
                    // chose, calcul et/ou autre type d'affichage
    if (tend === -1) {
          return '\\'
        } else if (tend === 1) {
          return '/'
        } else {
          return '–'
        }  
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

}

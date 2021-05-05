import { Component, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { IncomingDatasSimulatorService } from '../services/incoming-datas-simulator.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-viz-track',
  templateUrl: './viz-track.component.html',
  styleUrls: ['./viz-track.component.scss']
})
export class VizTrackComponent implements OnInit {

  started: boolean;
  paused: boolean;
  datas : Array<number>
  errorMsg: string;
  goDown: boolean;

  sourceForm: FormGroup;

  tendancyDatas: string[] = []
  /*tendancyDatasObs = [this.ids.t1$,
                      this.ids.t2$,
                      this.ids.t3$,
                      this.ids.t4$,
                      this.ids.t5$,
                      this.ids.t6$,
                      this.ids.t7$,
                      this.ids.t8$,
                      this.ids.t9$,
                      this.ids.t10$,
                      this.ids.t11$,
                      this.ids.t12$,
                      this.ids.t13$,
                      this.ids.t14$,
                      this.ids.t15$,
                      this.ids.t16$]*/

  constructor(private audioService: AudioService,
              private ids: IncomingDatasSimulatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let datasInit = [];
    for(let i=0; i<16; ++i) {
      datasInit[i] = 5;
    };
    this.datas = datasInit;
    this.ids.datas$.subscribe( // Subscription à l'observable datas$ pour capter les données de fréquence chaque fois qu'il en émettra
      (datas:number[]) => {
        this.datas = datas; // Quand des données sont présentées, on les passe à l'array datas pour utilisation par le template
      }
    );
    
    this.sourceForm = this.formBuilder.group({
      source: new FormControl(null, [Validators.required, Validators.pattern('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?')])
    });

    this.audioService.error$.subscribe(
      (error: boolean) => {
        if (error) {
          this.errorMsg = 'Sorry, the access to this stream has been blocked, please refresh the page and try an other URL';
        }
      }
    );
  }

  /*ngDoCheck() { 
    if (this.audioService.error === true) {
      this.errorMsg = 'Unable to access this stream, please refresh the page and try an other URL';
    }
    console.log('hook')
  }*/

  /*createTs() {
    for (let i = 0; i < 16; i++) {
      //this.tendancyDatas[i] = '–';
      this.tendancyDatasObs[i].subscribe(
        (tend: number) => {
           this.tendancyDatas[i + 1] = this.checkTend(tend)
        }
      )
    }
  }*/

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
        //this.createTs();
        this.getSubscription()

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
    this.ids.state$.next(true); // On passe true à l'observable pour qu'il émette cette valeur afin de relancer la capture
                                // de données de fréquences

    /*this.ids.state=true;                           
    this.ids.checkFrequencies()*/ // Pour le cas où l'on n'utilise pas d'observable dans cette fonction : voir commentaires dans
                                  // le service incoming-datas-simulator 
  }

  getSubscription() {
    for (let i=0; i<16; i++) {
          this.ids['t' + (i + 1) + '$'].subscribe(
            (tend: number) => {this.tendancyDatas[i] = this.checkTend(tend)})
        }
  }

  getHeights(bar) {
    return (this.datas[bar]*3/4) + 5 + 'px';    
  }

  checkTend(tend) {
    if (tend === -1) {
          return '\\'
        } else if (tend === 1) {
          return '/'
        } else {
          return '–'
        }  
  }

  /*getSubscriptions() {

    this.ids.t1$.subscribe(
      (tend: number) => {
        this.t1 = this.checkTend(tend);      
      }
    )

    this.ids.t2$.subscribe(
      (tend: number) => {
        this.t2 = this.checkTend(tend);
      }
    )

    this.ids.t3$.subscribe(
      (tend: number) => {
        this.t3 = this.checkTend(tend);
      }
    )

    this.ids.t4$.subscribe(
      (tend: number) => {
        this.t4 = this.checkTend(tend); 
      }
    )

    this.ids.t5$.subscribe(
      (tend: number) => {
        this.t5 = this.checkTend(tend);    
      }
    )

    this.ids.t6$.subscribe(
      (tend: number) => {
        this.t6 = this.checkTend(tend);  
      }
    )  

    this.ids.t7$.subscribe(
      (tend: number) => {
        this.t7 = this.checkTend(tend);  
      }
    )

    this.ids.t8$.subscribe(
      (tend: number) => {
        this.t8 = this.checkTend(tend);    
      }
    )

    this.ids.t9$.subscribe(
      (tend: number) => {
        this.t9 = this.checkTend(tend);
      }
    )

    this.ids.t10$.subscribe(
      (tend: number) => {
        this.t10 = this.checkTend(tend);
      }
    )

    this.ids.t11$.subscribe(
      (tend: number) => {
        this.t11 = this.checkTend(tend); 
      }
    )

    this.ids.t12$.subscribe(
      (tend: number) => {
        this.t12 = this.checkTend(tend);  
      }
    )

    this.ids.t13$.subscribe(
      (tend: number) => {
        this.t13 = this.checkTend(tend);
      }
    )

    this.ids.t14$.subscribe(
      (tend: number) => {
        this.t14 = this.checkTend(tend);  
      }
    )

    this.ids.t15$.subscribe(
      (tend: number) => {
        this.t15 = this.checkTend(tend); 
      }
    )

    this.ids.t16$.subscribe(
      (tend: number) => {
        this.t16 = this.checkTend(tend);   
      }
    )
 
  }*/
}

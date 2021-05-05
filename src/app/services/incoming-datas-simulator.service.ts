import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AudioService } from './audio.service'

@Injectable({
  providedIn: 'root'
})
export class IncomingDatasSimulatorService {

  state$ = new BehaviorSubject<boolean>(true); // Création d'un observable BehaviorSubject qui émettra un event pour ses subscribers
                                               // et leur passera la valeur (et comme il la garde en tant que BehaviorSubject, elle restera
                                               // accessible même lors d'une subscription ultérieure à l'event)
  datas$ = new Subject<number[]>(); // Création d'un observable Subject qui émettra un event pour ses subscribers
                                    // et leur passera l'array de données de fréquences
  t1$= new Subject<number>(); // Création d'un observable Subject qui émettra un event pour ses subscribers et leur passera
                              // la première valeur de l'array des tendances d'évolution pour chacune des données de fréquences 
  t2$= new Subject<number>();
  t3$= new Subject<number>();
  t4$= new Subject<number>();
  t5$= new Subject<number>();
  t6$= new Subject<number>();
  t7$= new Subject<number>();
  t8$= new Subject<number>();
  t9$= new Subject<number>();
  t10$= new Subject<number>();
  t11$= new Subject<number>();
  t12$= new Subject<number>();
  t13$= new Subject<number>();
  t14$= new Subject<number>();
  t15$= new Subject<number>();
  t16$= new Subject<number>();

  streaming: boolean=true;

  private datas: number[];
  private count: number = 0;
  private cacheLastThree = [];
  private datasForCache = [];
  private lastTendancy = []; // Mise en mémoire de la dernière tendance de chaque donnée de fréquence


  constructor( private audioService: AudioService ) { }

  checkFrequencies() {  // Il n'était pas nécessaire ici d'utiliser un observable – voir la version récursive passée
                        // en commentaire* ci-dessous – mais l'un des objectifs de ce mini-projet de démo était de montrer
                        // leur utilisation
                        // * Cela nécessite aussi une modification dans le controleur : voir les deux lignes de code passées en commentaire
                        //   dans la fonction resumeIt() du composant viz-track.component
      this.state$.subscribe( // On souscrit au BehaviorSubject, et ce faisant il émet la dernière information,
                             // qu'il a gardé en cache, nous donneant accès à celle-ci même si l'on souscrit après
                             // l'émission initiale
        (state:boolean) => {
          if (state === true && this.streaming === true && !this.audioService.error$.value) {
            // this.state$.next(false); // On pourrait ici passer l'état à false mais c'est inutile, car ce qui nous intéresse
                                        // c'est que la valeur soit true lors d'une émission pour satisfaire la condition du if
                                        // et ainsi déclencher un nouveau setTimeout
            setTimeout(
            () => {
              this.audioService.analyser.getByteFrequencyData(this.audioService.frequenciesDatas);
              this.datas = this.audioService.frequenciesDatas;
              this.datasForCache = [...this.datas];  // Clonage des données de fréquences actuelles car l'affectation de l'array à une autre
                                                     // variable ne copierait que la référence : l'arrivée de nouvelles données modifierait aussi
                                                     // celles que l'on voulait conserver 
              this.datas$.next(this.datas); // Emission des données de fréquence capturée pour utilisation par le template via le contrôleur
              this.cacheLastThree.push(this.datasForCache); // Alimentation du cache avec l'array cloné
              this.count = this.count + 1;
              if (this.count > 3) {   // Pour attendre que le cache soit rempli avant de l'utiliser             
                this.cacheLastThree.splice(0,1); // Suppression de la première valeur du cache dès que celui-ci en contient quatre
                this.checkTendancy();
              };
              this.state$.next(true); // On passe true à l'observable afin qu'il émette cette valeur, même si c'est la même qu'auparavant
              },100
            )
          }
        }
      )   
  }

  /*state = true
  checkFrequencies() {   
        if (this.state === true && this.streaming === true && !this.audioService.error$.value) {
          this.state = false;
          setTimeout(
          () => {
            this.audioService.analyser.getByteFrequencyData(this.audioService.tableauDonnees);
            this.datas = this.audioService.tableauDonnees;
            this.datasForCache = [...this.datas];
            this.datas$.next(this.datas);
            this.cacheLastThree.push(this.datasForCache);
            this.count = this.count + 1;
            if (this.count > 3) {                
              this.cacheLastThree.splice(0,1);
              this.checkTendancy();
            };            
            this.state = true;
            this.checkFrequencies()
            },100
          )
        }   
  }*/

  checkTendancy() { // A chaque cycle on appelle cette fonction pour analyser les valeurs pour les trois dernières
                    // données de chaque fréquence
    let tendancy = [] // Array des tendances pour chaque donnée de fréquence
    for (let i=0; i<16; i++) {
      if (this.cacheLastThree[0][i] > this.cacheLastThree[1][i] && this.cacheLastThree[1][i] > this.cacheLastThree[2][i]) {
        tendancy[i] = -1;  // Pour chaque donnée des fréquences, si chacune des trois dernières valeurs est inférieure
                           // à la précédente, la tendance est à la baisse
      } else if (this.cacheLastThree[0][i] < this.cacheLastThree[1][i] &&  this.cacheLastThree[1][i] < this.cacheLastThree[2][i]) {
        tendancy[i] = 1; // Pour chaque donnée des fréquences, si chacune des trois dernières valeurs est inférieure
        // à la précédente, la tendance est à la hausse
      } else {
        tendancy[i] = 0; // Pour chaque donnée des fréquences, si au moins des trois dernières valeurs diffèredes deux autres,
        // la tendance est considérée comme stable
      }      
    }

    for (let i=0; i<16; i++) {  
      if (tendancy[i] !== this.lastTendancy[i]) { // si pour la tendance d'évolution d'une donnée de fréquence il n'y a pas de changement,
                                                  // il n'y a pas de raison d'émettre de valeur puisqu'elle est inchangée et que l'affichage le sera aussi
       // let currentSubject = 'this.t' + (i + 1) + '$'; // Emission de la nouvelle tendance pour chaque donnée de fréquence concernée
        this['t' + (i + 1) + '$'].next(tendancy[i]);
        //console.log(i + ' changed')
      }
    }

    /*this.emitTendancy();*/

    this.lastTendancy = [...tendancy]; // Clonage des tendances de ce cycle pour comparaison avec celles du prochain
    }
  

  /* emitTendancy() {
     if (tendancy[0] !== this.lastTendancy[0]) {
        this.t1$.next(tendancy[0]);
      }
      if (tendancy[1] !== this.lastTendancy[1]) {
        this.t1$.next(tendancy[0]);
      }
      if (tendancy[2] !== this.lastTendancy[2]) {
        this.t1$.next(tendancy[2]);
      }
      if (tendancy[3] !== this.lastTendancy[3]) {
        this.t1$.next(tendancy[3]);
      }
      if (tendancy[4] !== this.lastTendancy[4]) {
        this.t1$.next(tendancy[4]);
      }
      if (tendancy[5] !== this.lastTendancy[5]) {
        this.t1$.next(tendancy[5]);
      }
      if (tendancy[6] !== this.lastTendancy[6]) {
        this.t1$.next(tendancy[6]);
      }
      if (tendancy[7] !== this.lastTendancy[7]) {
        this.t1$.next(tendancy[7]);
      }
      if (tendancy[8] !== this.lastTendancy[8]) {
        this.t1$.next(tendancy[8]);
      }
      if (tendancy[9] !== this.lastTendancy[9]) {
        this.t1$.next(tendancy[9]);
      }
      if (tendancy[10] !== this.lastTendancy[10]) {
        this.t1$.next(tendancy[10]);
      }
      if (tendancy[11] !== this.lastTendancy[11]) {
        this.t1$.next(tendancy[11]);
      }
      if (tendancy[12] !== this.lastTendancy[12]) {
        this.t1$.next(tendancy[12]);
      }
      if (tendancy[13] !== this.lastTendancy[13]) {
        this.t1$.next(tendancy[13]);
      }
      if (tendancy[14] !== this.lastTendancy[14]) {
        this.t1$.next(tendancy[14]);
      }
      if (tendancy[15] !== this.lastTendancy[15]) {
        this.t1$.next(tendancy[15]);
      }
  }*/
}

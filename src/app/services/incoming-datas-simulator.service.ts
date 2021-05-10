import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AudioService } from './audio.service'

@Injectable({
  providedIn: 'root'
})
export class IncomingDatasSimulatorService {

  clock$ = new BehaviorSubject<number>(0); // Création d'un observable BehaviorSubject qui émettra un event pour ses subscribers
                                           // et leur passera la valeur qu'il a reçu (et comme il la garde en tant que BehaviorSubject, elle restera
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

  private datas: number[];
  private count: number = 0;
  private cacheLastThree = [];
  private datasForCache = [];
  private lastTendancy = []; // Mise en mémoire de la dernière tendance de chaque donnée de fréquence


  constructor( private audioService: AudioService ) { }

  checkFrequencies() {  // Il n'était pas nécessaire ici d'utiliser un observable – voir la version récursive passée
                        // en commentaire* ci-dessous – mais l'un des objectifs de ce mini-projet de démo était de montrer
                        // leur utilisation. Par ailleurs il aura une double utilité :
                        //  - Lorsqu'il émet, il relance un cycle de capture de données de fréquences
                        //  - La valeur qu'il émet est captée dans le controlleur et permet de mettre à jour le temps de lecture
                        // écoulé dans le template – ici aussi c'est volontairement que les propriétés de l'objet HTMLAudioElement
                        // comme currentTime ne sont pas utilisées                    
                        //
                        // * Cela nécessite aussi une modification dans le controleur : voir les deux lignes de code passées en commentaire
                        //   dans la fonction resumeIt() du composant viz-track.component

      this.clock$.subscribe( // On souscrit au BehaviorSubject clock$ – chaque fois qu'il émettra, on débutera un cycle du timer à la fin duquel
                             // une valeur sera émise, relançant le même enchainement... et ainsi de suite jusqu'à ce que l'une des conditions
                             // du if ne soit plus satisfaite – streaming lorsque l'on met en pause en fonctionnement normal                             
        () => {
            if (this.audioService.capturing && !this.audioService.error$.value && !this.audioService.userMessage$.value) {
            setTimeout(
            () => {
              this.audioService.analyser.getByteFrequencyData(this.audioService.frequenciesDatas); // On effectue une capture de données de fréquances
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
              this.clock$.next(this.count*80); // On émet une valeur : le event déclenche un nouveau cycle du timer et la valeur émise permet de
                                                // mettre à jour le temps de lecture écoulé
              },80
            )
          }
        }
      )   
  }

  /*checkFrequencies() {   
        if ( this.streaming === true && !this.audioService.error$.value) {
          setTimeout(
          () => {
            this.audioService.analyser.getByteFrequencyData(this.audioService.frequenciesDatas);
            this.datas = this.audioService.frequenciesDatas;
            this.datasForCache = [...this.datas];
            this.datas$.next(this.datas);
            this.cacheLastThree.push(this.datasForCache);
            this.count = this.count + 1;
            if (this.count > 3) {                
              this.cacheLastThree.splice(0,1);
              this.checkTendancy();
            };            
            this.checkFrequencies();
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
        tendancy[i] = 0; // Pour chaque donnée des fréquences, si au moins l'une des trois dernières valeurs diffère des deux autres,
                         // la tendance est considérée comme stable
      }      
    }

    for (let i=0; i<16; i++) {  
      if (tendancy[i] !== this.lastTendancy[i]) { // Si pour la tendance d'évolution d'une donnée de fréquence il n'y a pas de changement,
                                                  // il n'y a pas de raison d'émettre de valeur puisqu'elle est inchangée et que l'affichage le sera aussi
        this['t' + (i + 1) + '$'].next(tendancy[i]); // Emission de la nouvelle tendance pour chaque donnée de fréquence concernée
      }
    }

    this.lastTendancy = [...tendancy]; // Clonage des tendances de ce cycle pour comparaison avec celles du prochain
    }
}

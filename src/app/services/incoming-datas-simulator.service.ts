import { splitClasses } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AudioService } from './audio.service'

@Injectable({
  providedIn: 'root'
})
export class IncomingDatasSimulatorService {

  state$ = new BehaviorSubject<boolean>(true);
  datas$ = new Subject<number[]>();

  count = 0;
  cacheLastThree = [];
  datasForCache = [];
  lastTendancy = [];

  t1$= new Subject<number>();
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

  //currentSubject: string;

  streaming: boolean=true;

  private datas: number[];

  constructor( private audioService: AudioService ) { }

  emitDatasSubject() {
    this.datas$.next(this.datas);
  }

  checkFrequencies() {    
      this.state$.subscribe(
        (state:boolean) => {
          if (state === true && this.streaming === true && !this.audioService.error$.value) {
            this.state$.next(false);
            setTimeout(
            () => {
              this.audioService.analyser.getByteFrequencyData(this.audioService.tableauDonnees);
              //console.log(this.audioService.tableauDonnees);
              this.datas = this.audioService.tableauDonnees;
              this.datasForCache = [...this.datas];
              this.emitDatasSubject();
              this.cacheLastThree.push(this.datasForCache);
              this.count = this.count + 1;
              if (this.count > 3) {                
                this.cacheLastThree.splice(0,1);
                this.checkTendancy();
              };
              this.state$.next(true);
              },100
            )
          }
        }
      )   
  }

  checkTendancy() {

    let tendancy = []
    for (let i=0; i<16; i++) {
      if (this.cacheLastThree[0][i] > this.cacheLastThree[1][i] && this.cacheLastThree[1][i] > this.cacheLastThree[2][i]) {
        tendancy[i] = -1;
      } else if (this.cacheLastThree[0][i] < this.cacheLastThree[1][i] &&  this.cacheLastThree[1][i] < this.cacheLastThree[2][i]) {
        tendancy[i] = 1;
      } else {
        tendancy[i] = 0;
      }      
    }

      for (let i=0; i<16; i++) {
        if (tendancy[i] !== this.lastTendancy[i]) {
          let currentSubject = 'this.t' + (i + 1) + '$.next(tendancy[i])';
          eval(currentSubject);
          console.log(i + ' changed')
        }
      }

     /* if (tendancy[0] !== this.lastTendancy[0]) {
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
      }*/

    this.lastTendancy = [...tendancy];
  }
}

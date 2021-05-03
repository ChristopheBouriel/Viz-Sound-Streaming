import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AudioService } from './audio.service'

@Injectable({
  providedIn: 'root'
})
export class IncomingDatasSimulatorService {

  state$ = new BehaviorSubject<boolean>(true);
  datas$ = new Subject<number[]>()
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
              console.log(this.audioService.tableauDonnees);
              this.datas = this.audioService.tableauDonnees;
              this.emitDatasSubject();
              this.state$.next(true);
              },60
            )
          }
        }
      )   
  }
}

import { Component, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { IncomingDatasSimulatorService } from '../services/incoming-datas-simulator.service';

@Component({
  selector: 'app-viz-track',
  templateUrl: './viz-track.component.html',
  styleUrls: ['./viz-track.component.scss']
})
export class VizTrackComponent implements OnInit {

  started: boolean;
  paused: boolean;
  datas: number[];

  constructor(private audioService: AudioService,
              private ids: IncomingDatasSimulatorService) { }



  ngOnInit(): void {
    let datasInit = [];
    for(let i=0; i<16; ++i) {
      datasInit[i] = 10;
    };
    this.datas = datasInit;
    console.log(this.datas)
    
    this.ids.datas$.subscribe(
      (datas:number[]) => {
        this.datas = datas;
      }
    )
    
  
}

  playIt() {
    this.audioService.playStream();
    this.started = true;
    this.ids.checkFrequencies();
  }

  stopIt() {
    this.audioService.pauseStream();
    this.paused = true;
    this.ids.streaming = false;
    //this.ids.state$.next(false);
  }

  resumeIt() {
    this.audioService.resumeStream();
    this.paused = false;
    this.ids.streaming = true;
    this.ids.state$.next(true);
  }

  
  getHeights(bar) {
    return this.datas[bar] + 'px';    
  }

}

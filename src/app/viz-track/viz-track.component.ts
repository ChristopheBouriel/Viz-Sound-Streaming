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
  datas: number[];

  goDown: boolean;

  sourceForm: FormGroup;

  constructor(private audioService: AudioService,
              private ids: IncomingDatasSimulatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let datasInit = [];
    for(let i=0; i<16; ++i) {
      datasInit[i] = 5;
    };
    this.datas = datasInit;
    this.ids.datas$.subscribe(
      (datas:number[]) => {
        this.datas = datas;
      }
    )
    
    this.sourceForm = this.formBuilder.group({
      source: new FormControl(null, [Validators.required, Validators.pattern('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?')])
    })
}

  playIt() {
    const source = this.sourceForm.get('source').value;
    setTimeout(
      () => {
        this.audioService.playStream(source);
        this.ids.checkFrequencies();
        this.goDown = false;
      },1200);
    this.started = true;
    this.goDown = true
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
    return this.datas[bar] + 5 + 'px';    
  }

}

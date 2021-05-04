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

  t1: string;
  t2: string;
  t3: string;
  t4: string;
  t5: string;
  t6: string;
  t7: string;
  t8: string;
  t9: string;
  t10: string;
  t11: string;
  t12: string;
  t13: string;
  t14: string;
  t15: string;
  t16: string;

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

    this.getSubscriptions();

    /*for (let i=0; i<16; i++) {
        let currentSubject = 'this.ids.t' + (i + 1) + '$.subscribe((tend: number) => {this.t' + (i + 1) + ' = tend};)';
        eval(currentSubject)
      }*/

  }

  /*ngDoCheck() {
    if (this.audioService.error === true) {
      this.errorMsg = 'Unable to access this stream, please refresh the page and try an other URL';
    }
    console.log('hook')
  }*/

  playIt() {
    const source = this.sourceForm.get('source').value;
    setTimeout(
      () => {
        this.audioService.playStream(source);
        this.ids.checkFrequencies();
        this.goDown = false;
      },1200);
    this.started = true;
    this.goDown = true;
    
  }

  pauseIt() {
    this.audioService.pauseStream();
    this.paused = true;
    this.ids.streaming = false;
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

  checkTend(tend) {
    if (tend === -1) {
          return '\\'
        } else if (tend === 1) {
          return '/'
        } else {
          return '–'
        }  
  }

  getSubscriptions() {

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
 
  }
}

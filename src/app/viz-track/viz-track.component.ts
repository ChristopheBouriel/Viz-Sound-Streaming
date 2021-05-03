import { Component, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { IncomingDatasSimulatorService } from '../services/incoming-datas-simulator.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { newArray } from '@angular/compiler/src/util';


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

  getSubscriptions() {
    this.ids.t1$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t1 = '\\'
        } else if (tend === 1) {
          this.t1 = '/'
        } else {
          this.t1 = '–'
        }        
      }
    )

    this.ids.t2$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t2 = '\\'
        } else if (tend === 1) {
          this.t2 = '/'
        } else {
          this.t2 = '–'
        }        
      }
    )

    this.ids.t3$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t3 = '\\'
        } else if (tend === 1) {
          this.t3 = '/'
        } else {
          this.t3 = '–'
        }        
      }
    )

    this.ids.t4$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t4 = '\\'
        } else if (tend === 1) {
          this.t4 = '/'
        } else {
          this.t4 = '–'
        }        
      }
    )

    this.ids.t5$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t5 = '\\'
        } else if (tend === 1) {
          this.t5 = '/'
        } else {
          this.t5 = '–'
        }        
      }
    )

    this.ids.t6$.subscribe(
      (tend: number) => {
        if (tend === -1) {
          this.t6 = '\\'
        } else if (tend === 1) {
          this.t6 = '/'
        } else {
          this.t6 = '–'
        }        
      }
    )
  

  this.ids.t7$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t7 = '\\'
      } else if (tend === 1) {
        this.t7 = '/'
      } else {
        this.t7 = '–'
      }        
    }
  )


  this.ids.t8$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t8 = '\\'
      } else if (tend === 1) {
        this.t8 = '/'
      } else {
        this.t8 = '–'
      }        
    }
  )

  this.ids.t9$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t9 = '\\'
      } else if (tend === 1) {
        this.t9 = '/'
      } else {
        this.t9 = '–'
      }        
    }
  )

  this.ids.t10$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t10 = '\\'
      } else if (tend === 1) {
        this.t10 = '/'
      } else {
        this.t10 = '–'
      }        
    }
  )

  this.ids.t11$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t11 = '\\'
      } else if (tend === 1) {
        this.t11 = '/'
      } else {
        this.t11 = '–'
      }        
    }
  )

  this.ids.t12$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t12 = '\\'
      } else if (tend === 1) {
        this.t12 = '/'
      } else {
        this.t12 = '–'
      }        
    }
  )

  this.ids.t13$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t13 = '\\'
      } else if (tend === 1) {
        this.t13 = '/'
      } else {
        this.t13 = '–'
      }        
    }
  )

  this.ids.t14$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t14 = '\\'
      } else if (tend === 1) {
        this.t14 = '/'
      } else {
        this.t14 = '–'
      }        
    }
  )

  this.ids.t15$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t15 = '\\'
      } else if (tend === 1) {
        this.t15 = '/'
      } else {
        this.t15 = '–'
      }        
    }
  )

  this.ids.t16$.subscribe(
    (tend: number) => {
      if (tend === -1) {
        this.t16 = '\\'
      } else if (tend === 1) {
        this.t16 = '/'
      } else {
        this.t16 = '–'
      }        
    }
  )

 
  }
}

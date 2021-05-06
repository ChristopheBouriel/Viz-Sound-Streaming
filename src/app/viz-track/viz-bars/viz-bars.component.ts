import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-viz-bars',
  templateUrl: './viz-bars.component.html',
  styleUrls: ['./viz-bars.component.scss']
})
export class VizBarsComponent implements OnInit {

  @Input() index: number;
  @Input() value: number;
  @Input() color: string;
  
  constructor() { }

  ngOnInit(): void {
  }

  getHeight() {
    return (this.value*3/4) + 5 + 'px';    
  }

}

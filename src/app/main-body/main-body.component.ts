import { Component, OnInit } from '@angular/core';
import {ButtonChangeService} from '../button-change.service';
import { ButtonAutomergeService } from '../button-automerge.service';
import { YjsServerService } from '../yjs-server.service';
@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss']
})
export class MainBodyComponent implements OnInit {

  constructor(public buttonChangeService: ButtonChangeService,
              public buttonAutoMerge: ButtonAutomergeService,
              public yjsService: YjsServerService) { }

  ngOnInit() {
  }


}

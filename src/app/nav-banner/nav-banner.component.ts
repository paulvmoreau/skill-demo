import { Component, OnInit } from '@angular/core';
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faCodeBranch} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-nav-banner',
  templateUrl: './nav-banner.component.html',
  styleUrls: ['./nav-banner.component.scss']
})
export class NavBannerComponent implements OnInit {
  faGitHub = faGithub;
  faLi = faLinkedin;
  faCB = faCodeBranch;

  constructor() {
  }

  ngOnInit(): void {
  }
}

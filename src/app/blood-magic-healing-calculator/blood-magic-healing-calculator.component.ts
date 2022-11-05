import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
//
// interface HealingForm {
//   lockenDamage: FormControl<number>,
// }

@Component({
  selector: 'app-blood-magic-healing-calculator',
  templateUrl: './blood-magic-healing-calculator.component.html',
  styleUrls: ['./blood-magic-healing-calculator.component.scss']
})
export class BloodMagicHealingCalculatorComponent implements OnInit {
  healingFG: FormGroup = new FormGroup({
    lockenDamage: new FormControl('lockenDamage'),
    partyDamage: new FormControl('partyDamage'),
    cureWoundsLevel: new FormControl('cureWoundsLevel')
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  calculate() {
    //do things!
  }
}

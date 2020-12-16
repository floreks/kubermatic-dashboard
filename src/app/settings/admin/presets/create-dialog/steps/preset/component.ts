// Copyright 2020 The Kubermatic Kubernetes Platform contributors.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component, forwardRef, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from '@angular/forms';
import {BaseFormValidator} from '@shared/validators/base-form.validator';

enum Controls {
  Name = 'name',
  Domain = 'domain',
  Disable = 'disable',
}

@Component({
  selector: 'km-preset-step',
  templateUrl: './template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PresetStepComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PresetStepComponent),
      multi: true,
    },
  ],
})
export class PresetStepComponent extends BaseFormValidator implements OnInit, ControlValueAccessor, Validator {
  form: FormGroup;

  readonly controls = Controls;

  constructor(private readonly _builder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.Name]: new FormControl('', [Validators.required]),
      [Controls.Domain]: new FormControl(''),
      [Controls.Disable]: new FormControl(''),
    });
  }
}

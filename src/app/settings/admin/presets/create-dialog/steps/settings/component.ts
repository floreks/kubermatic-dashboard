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
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import {PresetDialogService} from '@app/settings/admin/presets/create-dialog/steps/service';
import {NodeProvider} from '@shared/model/NodeProviderConstants';
import {BaseFormValidator} from '@shared/validators/base-form.validator';
import {takeUntil} from 'rxjs/operators';

enum Controls {
  Settings = 'Settings',
}

@Component({
  selector: 'km-preset-settings-step',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PresetSettingsStepComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PresetSettingsStepComponent),
      multi: true,
    },
  ],
})
export class PresetSettingsStepComponent extends BaseFormValidator implements OnInit, ControlValueAccessor, Validator {
  form: FormGroup;
  provider: NodeProvider;

  readonly Providers = NodeProvider;
  readonly Controls = Controls;

  constructor(private readonly _builder: FormBuilder, private readonly _presetDialogService: PresetDialogService) {
    super();
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.Settings]: this._builder.control(''),
    });

    this._presetDialogService.providerChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(provider => (this.provider = provider));
  }
}

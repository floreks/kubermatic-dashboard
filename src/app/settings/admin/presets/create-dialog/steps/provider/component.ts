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
import {PresetDialogService} from '@app/settings/admin/presets/create-dialog/steps/service';
import {DatacenterService} from '@core/services/datacenter/service';
import {NodeProvider, NodeProviderConstants} from '@shared/model/NodeProviderConstants';
import {BaseFormValidator} from '@shared/validators/base-form.validator';
import {map, takeUntil} from 'rxjs/operators';

enum Controls {
  Provider = 'provider',
}

@Component({
  selector: 'km-preset-provider-step',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PresetProviderStepComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PresetProviderStepComponent),
      multi: true,
    },
  ],
})
export class PresetProviderStepComponent extends BaseFormValidator implements OnInit, ControlValueAccessor, Validator {
  providers: NodeProvider[] = [];
  form: FormGroup;

  readonly controls = Controls;

  constructor(
    private readonly _builder: FormBuilder,
    private readonly _datacenterService: DatacenterService,
    private readonly _presetDialogService: PresetDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.Provider]: new FormControl('', [Validators.required]),
    });

    this._datacenterService.datacenters
      .pipe(map(datacenters => datacenters.map(dc => NodeProviderConstants.newNodeProvider(dc.spec.provider))))
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(providers => {
        const seen = {[NodeProvider.BRINGYOUROWN]: true};
        this.providers = providers.filter(provider =>
          Object.prototype.hasOwnProperty.call(seen, provider) ? false : (seen[provider] = true)
        );
      });

    this.form
      .get(Controls.Provider)
      .valueChanges.pipe(takeUntil(this._unsubscribe))
      .subscribe(provider => (this._presetDialogService.provider = provider));
  }
}

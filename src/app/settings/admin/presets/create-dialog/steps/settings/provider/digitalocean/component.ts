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

import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {PresetDialogService} from '@app/settings/admin/presets/create-dialog/steps/service';
import {DigitaloceanPresetSpec} from '@shared/entity/preset';
import {NodeProvider} from '@shared/model/NodeProviderConstants';
import {BaseFormValidator} from '@shared/validators/base-form.validator';
import {distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';

export enum Controls {
  Token = 'token',
}

@Component({
  selector: 'km-digitalocean-settings',
  templateUrl: './template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DigitaloceanSettingsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DigitaloceanSettingsComponent),
      multi: true,
    },
  ],
})
export class DigitaloceanSettingsComponent extends BaseFormValidator implements OnInit, OnDestroy {
  readonly Controls = Controls;

  constructor(private readonly _builder: FormBuilder, private readonly _presetDialogService: PresetDialogService) {
    super();
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.Token]: this._builder.control('', Validators.required),
    });

    this._presetDialogService.providerChanges
      .pipe(filter(provider => provider === NodeProvider.DIGITALOCEAN))
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(_ => this.reset());

    this.form
      .get(Controls.Token)
      .valueChanges.pipe(distinctUntilChanged())
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(_ => this._update());
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _update(): void {
    this._presetDialogService.preset.spec.digitalocean = {
      token: this.form.get(Controls.Token).value,
    } as DigitaloceanPresetSpec;
  }
}

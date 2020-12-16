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

import {EventEmitter, Injectable} from '@angular/core';
import {NodeProvider} from '@shared/model/NodeProviderConstants';

@Injectable({providedIn: 'root'})
export class PresetDialogService {
  providerChanges = new EventEmitter<NodeProvider>();

  private _provider: NodeProvider;

  get provider(): NodeProvider {
    return this._provider;
  }

  set provider(provider: NodeProvider) {
    this._provider = provider;
    this.providerChanges.emit(this._provider);
  }
}

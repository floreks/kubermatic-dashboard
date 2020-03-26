import {Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';

import {PresetsService} from '../../../core/services';
import {PacketSize} from '../../../shared/entity/packet/PacketSizeEntity';
import {NodeProvider} from '../../../shared/model/NodeProviderConstants';
import {ClusterService} from '../../../wizard-new/service/cluster';
import {NodeDataMode} from '../../config';
import {NodeDataService} from '../service';

export class NodeDataPacketProvider {
  constructor(
      private readonly _nodeDataService: NodeDataService, private readonly _clusterService: ClusterService,
      private readonly _presetService: PresetsService) {}

  flavors(): Observable<PacketSize[]> {
    // TODO: support dialog mode
    switch (this._nodeDataService.mode) {
      case NodeDataMode.Wizard:
        return this._clusterService.clusterChanges
            .pipe(filter(_ => this._clusterService.provider === NodeProvider.PACKET))
            .pipe(switchMap(
                cluster => this._presetService.provider(NodeProvider.PACKET)
                               .apiKey(cluster.spec.cloud.packet.apiKey)
                               .projectID(cluster.spec.cloud.packet.projectID)
                               .credential(this._presetService.preset)
                               .flavors()));
    }
  }
}
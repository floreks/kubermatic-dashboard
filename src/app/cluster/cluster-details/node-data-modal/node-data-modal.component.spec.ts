import {NgReduxTestingModule} from '@angular-redux/store/lib/testing/ng-redux-testing.module';
import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef, MatTabsModule} from '@angular/material';
import {BrowserModule, By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';

import {ApiService, ProjectService} from '../../../core/services';
import {DatacenterService, WizardService} from '../../../core/services';
import {NodeDataService} from '../../../core/services/node-data/node-data.service';
import {ClusterNameGenerator} from '../../../core/util/name-generator.service';
import {GoogleAnalyticsService} from '../../../google-analytics.service';
import {AWSNodeDataComponent} from '../../../node-data/aws-node-data/aws-node-data.component';
import {AzureNodeDataComponent} from '../../../node-data/azure-node-data/azure-node-data.component';
import {DigitaloceanNodeDataComponent} from '../../../node-data/digitalocean-node-data/digitalocean-node-data.component';
import {DigitaloceanOptionsComponent} from '../../../node-data/digitalocean-node-data/digitalocean-options/digitalocean-options.component';
import {HetznerNodeDataComponent} from '../../../node-data/hetzner-node-data/hetzner-node-data.component';
import {NodeDataComponent} from '../../../node-data/node-data.component';
import {OpenstackNodeDataComponent} from '../../../node-data/openstack-node-data/openstack-node-data.component';
import {OpenstackOptionsComponent} from '../../../node-data/openstack-node-data/openstack-options/openstack-options.component';
import {VSphereNodeDataComponent} from '../../../node-data/vsphere-add-node/vsphere-node-data.component';
import {VSphereOptionsComponent} from '../../../node-data/vsphere-add-node/vsphere-options/vsphere-options.component';
import {SharedModule} from '../../../shared/shared.module';
import {fakeDigitaloceanSizes} from '../../../testing/fake-data/addNodeModal.fake';
import {masterVersionsFake} from '../../../testing/fake-data/cluster-spec.fake';
import {fakeDigitaloceanCluster} from '../../../testing/fake-data/cluster.fake';
import {fakeDigitaloceanDatacenter} from '../../../testing/fake-data/datacenter.fake';
import {fakeDigitaloceanCreateNode, nodeDataFake} from '../../../testing/fake-data/node.fake';
import {ActivatedRouteStub, RouterStub, RouterTestingModule} from '../../../testing/router-stubs';
import {asyncData} from '../../../testing/services/api-mock.service';
import {DatacenterMockService} from '../../../testing/services/datacenter-mock.service';
import {ClusterNameGeneratorMock} from '../../../testing/services/name-generator-mock.service';
import {ProjectMockService} from '../../../testing/services/project-mock.service';
import {NodeService} from '../../services/node.service';

import {NodeDataModalComponent} from './node-data-modal.component';

describe('NodeDataModalData', () => {
  let fixture: ComponentFixture<NodeDataModalComponent>;
  let component: NodeDataModalComponent;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    const apiMock = jasmine.createSpyObj(
        'ApiService', ['getDigitaloceanSizes', 'createClusterNode', 'patchNodeDeployment', 'getClusterNodeUpgrades']);
    apiMock.getDigitaloceanSizes.and.returnValue(asyncData(fakeDigitaloceanSizes()));
    apiMock.getClusterNodeUpgrades.and.returnValue(asyncData(masterVersionsFake()));
    const nodeMock = jasmine.createSpyObj('NodeService', ['createNodeDeployment']);

    TestBed
        .configureTestingModule({
          imports: [
            BrowserModule,
            HttpClientModule,
            BrowserAnimationsModule,
            SlimLoadingBarModule.forRoot(),
            RouterTestingModule,
            NgReduxTestingModule,
            SharedModule,
            MatTabsModule,
          ],
          declarations: [
            NodeDataModalComponent,
            NodeDataComponent,
            OpenstackNodeDataComponent,
            OpenstackOptionsComponent,
            AWSNodeDataComponent,
            DigitaloceanNodeDataComponent,
            DigitaloceanOptionsComponent,
            HetznerNodeDataComponent,
            VSphereNodeDataComponent,
            VSphereOptionsComponent,
            AzureNodeDataComponent,
          ],
          providers: [
            {provide: MAT_DIALOG_DATA, useValue: {cluster: fakeDigitaloceanCluster()}},
            {provide: MatDialogRef, useValue: {}},
            {provide: ApiService, useValue: apiMock},
            {provide: ActivatedRoute, useClass: ActivatedRouteStub},
            {provide: DatacenterService, useClass: DatacenterMockService},
            {provide: ProjectService, useClass: ProjectMockService},
            {provide: NodeService, useValue: nodeMock},
            {provide: Router, useClass: RouterStub},
            {provide: ClusterNameGenerator, useClass: ClusterNameGeneratorMock},
            NodeDataService,
            WizardService,
            GoogleAnalyticsService,
          ],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeDataModalComponent);
    component = fixture.componentInstance;
    component.data.cluster = fakeDigitaloceanCluster();
    component.data.datacenter = fakeDigitaloceanDatacenter();
    component.data.nodeData = {
      spec: fakeDigitaloceanCreateNode().spec,
      count: 1,
      valid: true,
    };
    component.data.nodeData = nodeDataFake();
    component.data.editMode = false;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;
    activatedRoute.testParamMap = {clusterName: 'tbbfvttvs'};
    fixture.debugElement.injector.get(ApiService);
    fixture.detectChanges();
  });

  it('should create the add node modal cmp', () => {
    expect(component).toBeTruthy();
  });

  it('should render action buttons', () => {
    const actions = fixture.debugElement.query(By.css('.mat-dialog-actions'));
    expect(actions).not.toBeNull();
  });
});
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule, MatDialog } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { MemberComponent } from './member.component';
import { MemberItemComponent } from './member-item/member-item.component';
import { ApiService, ProjectService, UserService } from '../core/services';
import { AppConfigService } from '../app-config.service';
import { ApiMockService } from '../testing/services/api-mock.service';
import { ProjectMockService } from '../testing/services/project-mock.service';
import { UserMockService } from '../testing/services/user-mock.service';
import { AppConfigMockService } from '../testing/services/app-config-mock.service';
import { SharedModule } from '../shared/shared.module';
import { RouterTestingModule } from '../testing/router-stubs';
import { RouterStub } from './../testing/router-stubs';
import { asyncData } from '../testing/services/api-mock.service';

describe('MemberComponent', () => {
  let fixture: ComponentFixture<MemberComponent>;
  let component: MemberComponent;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SlimLoadingBarModule.forRoot(),
        RouterTestingModule,
        SharedModule,
        MatTabsModule,
      ],
      declarations: [
        MemberComponent,
        MemberItemComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ApiService, useClass: ApiMockService },
        { provide: ProjectService, useClass: ProjectMockService },
        { provide: UserService, useClass: UserMockService },
        { provide: AppConfigService, useClass: AppConfigMockService},
        MatDialog
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create members cmp', () => {
    expect(component).toBeTruthy();
  });
});
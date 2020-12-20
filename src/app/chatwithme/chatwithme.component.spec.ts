import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatwithmeComponent } from './chatwithme.component';

describe('ChatwithmeComponent', () => {
  let component: ChatwithmeComponent;
  let fixture: ComponentFixture<ChatwithmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatwithmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatwithmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

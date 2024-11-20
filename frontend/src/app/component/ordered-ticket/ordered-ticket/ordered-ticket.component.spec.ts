import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedTicketComponent } from './ordered-ticket.component';

describe('OrderedTicketComponent', () => {
  let component: OrderedTicketComponent;
  let fixture: ComponentFixture<OrderedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderedTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

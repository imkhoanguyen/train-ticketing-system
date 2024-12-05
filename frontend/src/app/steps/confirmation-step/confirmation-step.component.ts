import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../_services/payment.service';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../_models/api-response.module';
import { ToastrService } from '../../_services/toastr.service';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-step.component.html',
  styleUrl: './confirmation-step.component.css'
})
export class ConfirmationStepComponent {
  paymentData: any;
  status: string = '';
  private toastrService = inject(ToastrService);
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.paymentData = params;
      console.log('Payment data:', this.paymentData);
      this.status = this.paymentData.status;

    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

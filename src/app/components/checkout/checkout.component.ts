import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShopitFormService } from 'src/app/services/shopit-form.service';
import { CartService } from 'src/app/services/cart.service';
import { Subject } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  cartItems: CartItem[]=[];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private shopitFormService: ShopitFormService) { }

  ngOnInit(): void {

    this.listCartDeatils();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),

      

    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.shopitFormService.grtCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.shopitFormService.grtCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit years " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

  }

  listCartDeatils() {
    this.cartItems=this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

    this.cartService.computeCartTotals();
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.shopitFormService.grtCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit months " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
  
}

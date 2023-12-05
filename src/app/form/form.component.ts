import { Component, DestroyRef, inject } from '@angular/core';
import { UserInterface } from './interfaces/user.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from './form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  userForm: FormGroup;
  requestStarted: boolean;
  message: string;

  private destroyRef = inject(DestroyRef);

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submit(): void {
    this.requestStarted = true;
    this.message = '';

    const registerSub = this.formService
      .registerNewUser(this.userForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          return of(null);
        }),
      )
      .subscribe((userData: UserInterface) => {
        if (userData) {
          this.message = 'User registered successfully';
          this.userForm.reset();
        } else {
          this.message = 'Error occurred. Try again later.';
        }

        this.requestStarted = false;
        registerSub.unsubscribe();
      });
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user';

@Injectable()
export class AuthService {

  private code: string;

  constructor(private angularFireAuth: AngularFireAuth) { }

  createUser(user: User) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  signIn(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  resetPassword(email: string) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  setCode(code: string): void {
    this.code = code;
  }

  getCode(): string {
    return this.code;
  }
}

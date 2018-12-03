import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user';
import { Igreja } from '../../model/igreja.model';

@Injectable()
export class AuthService {

  private code: string;
  private igreja: Igreja;

  constructor(private angularFireAuth: AngularFireAuth) { }

  createUser(user: User) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  signIn(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signOut() {
    this.code = null;
    this.angularFireAuth.auth.signOut();
  }

  resetPassword(email: string) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  setCode(code: string): void {
    this.code = code;
  }
  setIgreja(igreja: Igreja): void {
    this.igreja = igreja;
  }

  getCode(): string {
    return this.code;
  }
  getInformation() {
    return this.igreja;
  }
}

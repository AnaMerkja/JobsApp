import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';

import { AngularFireAuth } from "@angular/fire/auth";
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<any>;
    userData: any;
    constructor(private router: Router, public afAuth: AngularFireAuth, public afs: AngularFirestore) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.signInWithEmailAndPassword(username, password)//authentication with firebase
                .then(
                    (res) => {//get user data from Users collection and save it in local storage 
                        this.afs.doc('users/' + res.user.uid).get().pipe(first()).subscribe(data => {
                            this.userData = data.data();
                            localStorage.setItem('user', JSON.stringify(this.userData));
                            this.userSubject.next(this.userData);
                            resolve(res);
                        });

                    },
                    err => {
                        reject(err)
                    });
        });

    }

    logout() {
        return this.afAuth.signOut().then(() => {//logout from fireauth, delete user from locale storage and redirect to login page
            localStorage.removeItem('user');
            this.userSubject.next(null);
            this.router.navigate(['/account/login']);
        });
    }

    register(user: User, email, password) {
        //register with email and password(can be implemented with email verification too)
        return this.afAuth.createUserWithEmailAndPassword(email, password);
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null) ? true : false;
    }

    update(id, usrData) {
        //get current user by its UID and update its data
        let that = this;
        return this.afs.firestore.collection('users').where('uid', '==', id).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    localStorage.setItem('user', JSON.stringify(usrData));
                    that.userSubject.next(usrData);
                    that.afs.doc('users/' + doc.id).update(usrData);
                });
            });
    }
}
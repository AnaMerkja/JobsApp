import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { JobOffers } from '../models/jobOffers.model';
import { AngularFirestore } from '@angular/fire/firestore';
import  firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private userSubject: BehaviorSubject<User>;

  constructor(private router: Router, private firestore: AngularFirestore) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  //method used only for recruiters
  getUserJobs() {
    //get current user's jobs
    return this.firestore.firestore.collection('jobs').where('userId', '==', this.userValue.uid).get();
  }

  //method used only for user, used at home page
  getAll() {
    return this.firestore.collection('jobs').snapshotChanges();
  }

  //get job by id
  getById(id: string) {
    return this.firestore.collection('jobs').doc(id).get();
  }

  update(id, job) {
    return this.firestore.doc('jobs/' + id).update(job);
  }

  create(job: JobOffers) {
    return this.firestore.collection('jobs').add(job);
  }

  delete(id: string) {
    return this.firestore.doc('jobs/' + id).delete();
  }

  //method used to mark job as favorite
  createFavorite(data) {
    return this.firestore.collection('favorites').add(data);
  }

  //method to get current user favorite jobs
  getFavorites() {
    let that = this;
    //get job ids from Favorites collection(which is used to save each job marked as favorite, only user id and job id)
    let e = this.firestore.firestore.collection('favorites').where('userId', '==', this.userValue.uid).get();
    return new Promise<any>((resolve, reject) => {
      e.then(
        (res) => {
          let ids =[];
          //push each job id in IDS array 
          res.docs.forEach(d => {
            ids.push(d.data().jobId);
          });
          //get job data from job collection where job id is in IDS array
          that.firestore.firestore.collection('jobs').where(firebase.firestore.FieldPath.documentId(), 'in', ids).get().then(data => {
            resolve(data);
          }).catch(error => reject(error));
        },
        err => {
          reject(err)
        });
    });
  }
  // deleteFavorites(id: string) {
  //   return this.firestore.doc('favorites/' + id).delete();
  // }
}

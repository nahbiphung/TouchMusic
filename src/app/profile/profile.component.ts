import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  private loadingSpinner: boolean;
  private userData: User;
  private faPlaylist: FavoriteList[];
  imageData: any;
  constructor(private db: AngularFirestore, private route: ActivatedRoute) {
    this.loadingSpinner = true;
    // this.faPlaylist = new Array<FavoriteList>();
   }

  ngOnInit() {
    // get params and user
    const getParams = this.route.snapshot.paramMap.get('uid');
    this.documentData = this.db.collection('users').doc(getParams);
    this.collectionData = this.db.collection('users').doc(getParams).collection('favoritePlaylist');
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.userData = res;
        console.log(this.userData);
        this.loadingSpinner = false;
      }
    }, (error) => {
      console.log('error');
    });

    this.collectionData.valueChanges().subscribe((newRes) => {
      if (newRes) {
        this.faPlaylist = newRes;
        console.log(newRes);
      }
    });
  }

}

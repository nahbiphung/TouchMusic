import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-performer',
  templateUrl: './performer.component.html',
  styleUrls: ['./performer.component.scss']
})
export class PerformerComponent implements OnInit {

  private collectionData: AngularFirestoreCollection<any>;
  private documentData: AngularFirestoreDocument<any>;
  private data: Performer;
  private songData: Song[];
  private albumData: Album[];
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const getParams = this.route.snapshot.paramMap.get('id');
    
    this.documentData = this.db.collection('Performer').doc(getParams);
    this.documentData.valueChanges().subscribe((res: Performer) => {
      if (res) {
        this.data = res;
      }
    });
    this.documentData.snapshotChanges().subscribe((res: any) => {
      if (res) {
        this.collectionData = this.db.collection('Song', query =>
          query.where('performerId', '==', res.payload.ref));
        this.collectionData.valueChanges().subscribe((songRes: Song[]) => {
          if (songRes) {
            this.songData = songRes;
            console.log(songRes);
          }
        });
        this.collectionData = this.db.collection('Album', query =>
          query.where('performerId', '==', res.payload.ref));
        this.collectionData.valueChanges().subscribe((albumRes: Album[]) => {
          if (albumRes) {
            this.albumData = albumRes;
            console.log(albumRes);
          }
        });
      }
    });

  }

}

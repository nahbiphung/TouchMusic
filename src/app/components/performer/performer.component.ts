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
  }

}

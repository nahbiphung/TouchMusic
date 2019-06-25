import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, reject } from 'q';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { link } from 'fs';

@Component({
  selector: 'app-admin-crawling',
  templateUrl: './admin-crawling.component.html',
  styleUrls: ['./admin-crawling.component.scss']
})
export class AdminCrawlingComponent implements OnInit {
  public loadingSpinner: boolean;
  public numbersOfNhaccuatui: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: CrawlingWebNhaccuatui[];
  public tableData: MatTableDataSource<any>;
  public displayedColumns: string[] = ['name', 'avatar', 'performer', 'link', 'lyric'];
  public dataSource: any;
  public waitForLoadNCTData = false;
  public finishLoadNCT = false;
  public getNCT: AngularFirestoreCollection<any>;
  public checkNCTData = false;
  public listNTC = [];
  public tableDataNCTFinish: MatTableDataSource<any>;
  public arrNCT10 = [];
  // Zingmp3
  public listZingSong: [];
  public zingSongCount = 0;
  public zing10Song = 0;
  public waitForLoadZingData = false;
  public finishZingData = false;
  public tableZingData: MatTableDataSource<any>;
  public displayZingColumns: string[] = ['name', 'avatar', 'performer', 'link', 'lyric'];
  public arrSong = [];
  public getZing: AngularFirestoreCollection<any>;
  public checkZingData = false;
  public listZing = [];
  public arrZing10 = [];
  public tableDataZingFinish: MatTableDataSource<any>;

  constructor(private http: HttpClient,
              private afs: AngularFirestore
  ) {
    this.data = [];
    this.loadingSpinner = true;
  }

  ngOnInit() {
    // nhaccuatui

    this.getNCT = this.afs.collection('CrawlingNCT');
    // check data NCT
    this.getNCT.valueChanges().subscribe(res => {
      if (res.length !== 0) {
        this.checkNCTData = true;
      }
    });
    // get data NCT
    this.getNCT.snapshotChanges().subscribe(arr => {
      this.listNTC = arr.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        } as CrawlingWebNhaccuatui;
      });
      for (let i = 0; i <= 9; i++) {
        this.arrNCT10[i] = this.listNTC[i];
      }
      this.tableDataNCTFinish = new MatTableDataSource(this.arrNCT10);
      this.tableDataNCTFinish.sort = this.sort;
      this.tableDataNCTFinish.paginator = this.paginator;
      this.loadingSpinner = false;
    });

    // zingmp3

    this.getZing = this.afs.collection('CrawlingZing');

    this.getZing.valueChanges().subscribe(res => {
      if (res.length !== 0) {
        this.checkZingData = true;
      }
    });

    this.getZing.snapshotChanges().subscribe(arr => {
      this.listZing = arr.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        };
      });

      for (let i = 0; i <= 9; i++) {
        this.arrZing10[i] = this.listZing[i];
      }
      this.tableDataZingFinish = new MatTableDataSource(this.arrZing10);
      this.tableDataZingFinish.sort = this.sort;
      this.tableDataZingFinish.paginator = this.paginator;
      this.loadingSpinner = false;
    });
  }
  // nhacccuatui

  getNumberofPages() {
    return this.http.get('https://touchmusic.herokuapp.com/nhaccuatuiPages').subscribe((res: any) => {
      if (res) {
        this.numbersOfNhaccuatui = res;
      }
      console.log(this.numbersOfNhaccuatui);
    });
  }
  getDataofPages(numberPage) {
    this.waitForLoadNCTData = true;
    const t = async () => {
      for (let index = 1; index <= numberPage; index++) {
        const dataPerPage: any = await new Promise((result) =>
          this.http.get('https://touchmusic.herokuapp.com/nhaccuatuiData?page=' + index).subscribe((res: any) => {
            if (res) {
              result(res);
            }
          }));
        console.log('phu');
        this.data = this.data.concat(dataPerPage);
        this.tableData = new MatTableDataSource(this.data);
        this.tableData.sort = this.sort;
        this.tableData.paginator = this.paginator;
      }
      this.waitForLoadNCTData = false;
      this.finishLoadNCT = true;
    };
    t();
  }

  saveIntoFirebase() {
    this.checkNCTData = true;
    for (let i = 0; i <= 99; i++) {
      this.afs.collection('CrawlingNCT').add({
        songName: this.data[i].name,
        imageSong: this.data[i].avatar,
        performer: this.data[i].performer,
        linkSong: this.data[i].link,
        lyricSong: this.data[i].lyric
      });
    }
  }
  private getDataAPI(numberPage: number) {
    return this.http.get('https://touchmusic.herokuapp.com/nhaccuatuiData?page=' + numberPage).subscribe((res: any) => {
      if (res) {
        // this.data = this.data.concat(res);
        // console.log(this.data);
      }
    });
  }

  // ZINGMP3
  getNumberZing() {
    return this.http.get('http://localhost:3002/zingSongsCount').subscribe((res: any) => {
      if (res) {
        this.listZingSong = res;
        this.zingSongCount = this.listZingSong.length - 1;
        this.zing10Song = parseInt((this.listZingSong.length / 10).toString() , this.zing10Song);
      }
    });
  }

  getZingTop100(numberSong: number) {
    this.waitForLoadZingData = true;
    const t = async () => {
      for (let i = 1; i <= numberSong; i++) {
        await new Promise((result) =>
            this.http.get('http://localhost:3002/zingTop100?song=' + i).subscribe((res: any) => {
              if (res) {
                for (const item of res) {
                  this.arrSong.push(item);
                }
                // console.log(arrSong);
                result(res);
              }
        }));
        this.tableZingData = new MatTableDataSource(this.arrSong);
        this.tableZingData.sort = this.sort;
        this.tableZingData.paginator = this.paginator;
      }
      this.waitForLoadZingData = false;
      this.finishZingData = true;
    };
    t();
  }

  saveZingIntoFirebase() {
    this.checkZingData = true;
    for (const i of this.arrSong) {
      this.afs.collection('CrawlingZing').add({
        songName: i.title,
        imageSong: i.imgsrc,
        performer: i.artist,
        linkSong: i.song,
        lyricSong: i.lyric
      });
    }
  }

}


export interface CrawlingWebNhaccuatui {
  avatar: string;
  name: string;
  performer: any;
  link: string;
  lyric: any;
}


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
  // Zingmp3
  public listZingSong: [];
  public zingSongCount = 0;
  public zing10Song = 0;
  public waitForLoadZingData = false;
  public finishZingData = false;
  public tableZingData: MatTableDataSource<any>;
  public displayZingColumns: string[] = ['name', 'avatar', 'performer', 'link', 'lyric'];

  constructor(private http: HttpClient,
              private afs: AngularFirestore
  ) {
    this.data = [];
  }

  ngOnInit() {
    this.getNCT = this.afs.collection('CrawlingNCT');
    // check data NCT
    this.getNCT.valueChanges().subscribe(res => {
      if (res) {
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
      this.tableData = new MatTableDataSource(this.listNTC);
      this.tableData.sort = this.sort;
      this.tableData.paginator = this.paginator;
    });
  }
  // nhacccuatui

  getNumberofPages() {
    return this.http.get('http://localhost:3001/nhaccuatuiPages').subscribe((res: any) => {
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
          this.http.get('http://localhost:3001/nhaccuatuiData?page=' + index).subscribe((res: any) => {
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
    for (const i of this.data) {
      this.afs.collection('CrawlingNCT').add({
        songName: i.name,
        imageSong: i.avatar,
        performer: i.performer,
        linkSong: i.link,
        lyricSong: i.lyric
      });
    }
  }
  private getDataAPI(numberPage: number) {
    return this.http.get('http://localhost:3001/nhaccuatuiData?page=' + numberPage).subscribe((res: any) => {
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
    // const arrSong = [];
    const t = async () => {
      for (let i = 1; i <= numberSong; i++) {
        await new Promise((result) =>
            this.http.get('http://localhost:3002/zingTop100?song=' + i).subscribe((res: any) => {
              if (res) {
                for (const item of res) {
                  // arrSong.push(item);
                  this.afs.collection('CrawlingZing').add({
                    songName: item.name,
                    imageSong: item.avatar,
                    performer: item.performer,
                    linkSong: item.link,
                    lyricSong: item.lyric
                  });
                }
                // console.log(arrSong);
                result(res);
              }
        }));
      }
      this.waitForLoadZingData = false;
      // this.tableZingData = new MatTableDataSource(arrSong);
      // this.tableZingData.sort = this.sort;
      // this.tableZingData.paginator = this.paginator;
    };
    t();
  }
}

export interface CrawlingWebNhaccuatui {
  avatar: string;
  name: string;
  performer: any;
  link: string;
  lyric: any;
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, reject } from 'q';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DialogComponent } from '../../dialog/dialog.component';


@Component({
  selector: 'app-admin-crawling',
  templateUrl: './admin-crawling.component.html',
  styleUrls: ['./admin-crawling.component.scss']
})
export class AdminCrawlingComponent implements OnInit {
  public loadingSpinner: boolean;
  public numbersOfNhaccuatui: any;
  @ViewChild('MatSortZing') sortZing: MatSort;
  @ViewChild('MatSortNCT') sortNCT: MatSort;
  @ViewChild('MatPaginatorZing') matPaginatorZing: MatPaginator;
  @ViewChild('MatPaginatorNCT') matPaginatorNCT: MatPaginator;
  public data: CrawlingWebNhaccuatui[];
  public tableData: MatTableDataSource<any>;
  public displayedColumns: string[] = ['name', 'avatar', 'performer', 'link', 'lyric', 'option'];
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
  public displayZingColumns: string[] = ['name', 'avatar', 'performer', 'link', 'lyric', 'option'];
  public arrSong = [];
  public newFormatSongZing: CrawlingWebNhaccuatui[];
  public getZing: AngularFirestoreCollection<any>;
  public checkZingData = false;
  public listZing = [];
  public arrZing10 = [];
  public tableDataZingFinish: MatTableDataSource<any>;
  public waitforLoadNCTNumberPage = false;
  public waitforLoadZingNumberSong = false;

  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              public dialog: MatDialog,
  ) {
    this.data = [];
    this.loadingSpinner = true;
    this.newFormatSongZing = [];
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
      this.tableDataNCTFinish.paginator = this.matPaginatorNCT;
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
      this.tableDataZingFinish.paginator = this.matPaginatorZing;
      this.loadingSpinner = false;
    });
  }


  // nhacccuatui
  getNumberofPages() {
    this.waitforLoadNCTNumberPage = true;
    return this.http.get('http://ec2-18-138-251-49.ap-southeast-1.compute.amazonaws.com:3001/nhaccuatuiPages').subscribe((res: any) => {
      if (res) {
        this.numbersOfNhaccuatui = res;
        this.waitforLoadNCTNumberPage = false;
      }
      console.log(this.numbersOfNhaccuatui);
    });
  }
  getDataofPages(numberPage) {
    this.waitForLoadNCTData = true;
    const t = async () => {
      // change number
      for (let index = 1; index <= numberPage; index++) {
        const dataPerPage: any = await new Promise((result) =>
          // tslint:disable-next-line: max-line-length
          this.http.get('http://ec2-18-138-251-49.ap-southeast-1.compute.amazonaws.com:3001/nhaccuatuiData?page=' + index).subscribe((res: any) => {
            if (res) {
              result(res);
            }
          }));
        console.log(index);
        this.data = this.data.concat(dataPerPage);
        this.tableData.data = this.data;
        this.tableData.paginator = this.matPaginatorNCT;
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

  // ZINGMP3
  getNumberZing() {
    this.waitforLoadZingNumberSong = true;
    return this.http.get('http://ec2-18-138-251-49.ap-southeast-1.compute.amazonaws.com:3002/zingSongsCount').subscribe((res: any) => {
      if (res) {
        this.listZingSong = res;
        this.zingSongCount = this.listZingSong.length - 1;
        this.zing10Song = parseInt((this.listZingSong.length / 10).toString() , this.zing10Song);
        this.waitforLoadZingNumberSong = false;
      }
    });
  }

  getZingTop100(numberSong: number) {
    this.waitForLoadZingData = true;
    const t = async () => {
      // chỉnh sữa pleaseeeeee
      for (let i = 1; i <= numberSong; i++) {
        await new Promise((result) =>
            // tslint:disable-next-line: max-line-length
            this.http.get('http://ec2-18-138-251-49.ap-southeast-1.compute.amazonaws.com:3002/zingTop100?song=' + i).subscribe((res: any) => {
              if (res) {
                for (const item of res) {
                  this.arrSong.push(item);
                }
                // console.log(arrSong);
                result(res);
              }
        }));
        console.log(i);
        this.tableZingData.data = this.arrSong;
        this.tableZingData.paginator = this.matPaginatorZing;
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

  deleteNCTData(dataNCT: CrawlingWebNhaccuatui) {
    this.data = this.data.filter(crawl => crawl.link !== dataNCT.link);
    this.tableData.data = this.data;
  }

  editNCTData(dataNCT: CrawlingWebNhaccuatui) {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '50vw',
      data: { currentUser: '', data: dataNCT, selector: 'EDIT_CRAWLINGSONG' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.data.findIndex(x => x.link === dataNCT.link);
        this.data = this.data.filter(crawl => crawl.link !== dataNCT.link);
        this.data.splice(index, 0, result);
        this.tableData.data = this.data;
      }
    });
  }

  deleteZingData(dataZing: any) {
    this.arrSong = this.arrSong.filter(crawl => crawl.song !== dataZing.song);
    this.tableZingData.data = this.arrSong;
  }

  editZingData(dataZing: any) {
    const newDataZing = {
      name: dataZing.title,
      avatar: dataZing.imgsrc,
      performer: dataZing.artist,
      link: dataZing.song,
      lyric: dataZing.lyric
    };
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '50vw',
      data: { currentUser: '', data: newDataZing, selector: 'EDIT_CRAWLINGSONG' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formatZing = {
          title: result.name,
          imgsrc: result.avatar,
          artist: result.performer,
          song: result.link,
          lyric: result.lyric,
        };
        const index = this.arrSong.findIndex(x => x.song === dataZing.song);
        this.arrSong = this.arrSong.filter(crawl => crawl.song !== dataZing.song);
        this.arrSong.splice(index, 0, formatZing);
        this.tableZingData.data = this.arrSong;
      }
    });
  }

  public setTable(event: number) {
    if (event === 1) {
      if (!this.tableData && this.data) {
        this.tableData = new MatTableDataSource(this.data);
        this.tableData.sort = this.sortNCT;
        this.tableData.paginator = this.matPaginatorNCT;
      }
    } else if (event === 0) {
      if (this.arrSong && !this.tableZingData) {
        this.tableZingData = new MatTableDataSource(this.arrSong);
        this.tableZingData.sort = this.sortZing;
        this.tableZingData.paginator = this.matPaginatorZing;
      }
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


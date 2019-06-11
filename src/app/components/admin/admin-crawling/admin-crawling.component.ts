import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, reject } from 'q';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

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
  constructor(private http: HttpClient) {
    this.data = [];
   }
  ngOnInit() {
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
    const t = async () => {
      for (let index = 1; index <= numberPage; index++) {
        const dataPerPage: any = await new Promise((result, reject) =>
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
    };
    t();
  }
  
  private getDataAPI(numberPage: number) {
    return this.http.get('http://localhost:3001/nhaccuatuiData?page=' + numberPage).subscribe((res: any) => {
      if (res) {
        this.data = this.data.concat(res);
        console.log(this.data);
      }
    });
  }

  // ZINGMP3

}

export interface CrawlingWebNhaccuatui {
  avatar: string;
  name: string;
  performer: any;
  link: string;
  lyric: any;
}

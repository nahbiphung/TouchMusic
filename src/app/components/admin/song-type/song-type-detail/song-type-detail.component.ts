import { Component, OnInit } from '@angular/core';
import { SongTypeService } from '../../../../services/song-type.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-song-type-detail',
  templateUrl: './song-type-detail.component.html',
  styleUrls: ['./song-type-detail.component.scss']
})
export class SongTypeDetailComponent implements OnInit {

  constructor(
    private songtypeService: SongTypeService,
    public dialogRef: MatDialogRef<SongTypeDetailComponent>
  ) { }

  ngOnInit() {
    this.songtypeService.getSongType();
  }

  onSubmit() {
    if (this.songtypeService.formSongtype.valid) {
      if (!this.songtypeService.formSongtype.controls.$key.value) {
        this.songtypeService.createSongType();
      } else {
        this.songtypeService.updateSongType();
      }
      this.onClose();
    }
  }

  onClose() {
    this.songtypeService.formReset();
    this.dialogRef.close();
  }

  onclickClearForm() {
    this.songtypeService.formReset();
  }
}

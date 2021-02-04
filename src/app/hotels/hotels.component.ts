import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, DoCheck } from '@angular/core';
import { MatChipInputEvent, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { NgForm } from '@angular/forms';
import { HotelService } from './hotel.service';
import { Hotel } from './hotel.model';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit, AfterViewInit {

  emails: string[] = [];
  phones: string[] = [];
  selectedFile: File;
  logo: string;
  @ViewChild('fileInput') fileInput: ElementRef;

  readonly separatorKeyCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  displayedColumns = ['id', 'name', 'logo', 'address', 'email', 'phone', 'latitude', 'longitude', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Hotel>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  hotel: Hotel;
  updateMode: boolean = false;

  constructor(private hotelService: HotelService) { }
  
  ngOnInit() {

    this.hotelService.getHotels().subscribe(
      result => {
        this.dataSource.data = result;
      }
    );

    this.hotelService.hotelIsEdit.subscribe(
      result => {
        console.log(result);
        this.updateMode = true;
        this.hotel = result;
        this.logo = result.logo;
        this.emails = this.hotel.email;
        this.phones = this.hotel.phone;
      }
    );
  }

  ngAfterViewInit() {
    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  addEmail(event: MatChipInputEvent) {

    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.emails.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  addPhone(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.phones.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

  }

  removeEmail(email) {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  removePhone(phone) {
    const index = this.phones.indexOf(phone);

    if (index >= 0) {
      this.phones.splice(index, 1);
    }
  }

  onSubmit(form: NgForm) {

    if (this.hotel) {

      this.hotel.name = form.value.name;
      this.hotel.logo = this.logo;
      this.hotel.address = form.value.address;
      this.hotel.email = this.emails;
      this.hotel.phone = this.phones;
      this.hotel.latitude = form.value.latitude;
      this.hotel.longitude = form.value.longitude;
      this.hotel.status = form.value.status;

      console.log(this.hotel);

      this.hotelService.updateHotel(this.hotel).subscribe(
        result => console.log(result)
      );
      this.hotel = null;
      this.updateMode = false;

    } else {
    
      const hotel = {
        name: form.value.name,
        logo: this.logo,
        address: form.value.address,
        email: this.emails,
        phone: this.phones,
        longitude: form.value.longitude,
        latitude: form.value.latitude,
        status: form.value.status
      };

      this.hotelService.addHotel(hotel).subscribe(
        result => {
          this.dataSource.data = result;
        }
      );
    }

    form.reset();
    this.emails = [];
    this.phones = [];
  }

  onEdit(hotel: Hotel) {
    this.hotelService.editHotel(hotel);
  }

  onDelete(hotel: Hotel) {
    this.hotelService.deleteHotel(hotel).subscribe(
      result => { 
        console.log(result);
        this.dataSource.data = result;
        console.log(this.dataSource.data);
      }
    );
  }

  onFileSelected() {
    this.selectedFile = this.fileInput.nativeElement.files[0];
    this.logo = Date.now() + '-' + this.selectedFile.name
  }

  uploadFile() {
    this.hotelService.uploadFile(this.selectedFile, this.logo);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

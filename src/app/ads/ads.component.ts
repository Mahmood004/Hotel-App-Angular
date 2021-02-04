import { Component, OnInit, ViewChild, Injectable, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { HotelService } from '../hotels/hotel.service';
import { CategoryService } from '../shared/category.service';
import { Hotel } from '../hotels/hotel.model';
import { Category } from '../categories/category.model';
import { SubCategory } from '../sub-categories/sub-category.model';
import { NgForm } from '@angular/forms';
import { AdService } from './ad.servis';
import { Ad } from './ad.model';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})

@Injectable()
export class AdsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'description', 'images', 'videos', 'hotel', 'category', 'subCategory', 'type', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Ad>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  hotels: Hotel[] = [];
  categories: Category[]= [];
  subCategories: SubCategory[] = [];
  ads: Ad[] = [];
  ad: Ad;

  constructor(private dialog: MatDialog, private hotelService: HotelService, private categoryService: CategoryService, private adService: AdService) { }

  ngOnInit() {

    this.adService.getAds().subscribe(
      result => {
        console.log(result);
        this.ads = result;
        this.dataSource.data = this.ads;
      }
    );

    this.hotelService.getHotels().subscribe(
      result => {
        this.hotels = result;
      }
    );

    this.categoryService.getAllCategories().subscribe(
      result => {
        this.categories = result;
      }
    );

    this.adService.adIsEdit.subscribe(
      result => {
        console.log(result);
        this.ad = result;
        this.adService.images = this.ad.image;
        this.adService.videos = this.ad.video;
      }
    );
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openUploadDialog() {
    this.dialog.open(DialogComponent, {
      width: '50%',
      height: '50%'
    });
  }

  filterSubCategories(categoryId) {
    this.categoryService.getSubCategories(categoryId).subscribe(
      result => {
        this.subCategories = result;
      }
    )
  }

  onSubmit(form: NgForm) {

    if (this.ad) {
      this.ad.description = form.value.description;
      this.ad.hotelId = form.value.hotelId;
      this.ad.hotelName = this.hotels.find(hotel => hotel.id ==  form.value.hotelId).name;
      this.ad.categoryId = form.value.categoryId;
      this.ad.categoryName = this.categories.find(category => category.id ==  form.value.categoryId).name;
      this.ad.subCategoryId = form.value.subCategoryId;
      this.ad.subCategoryName = this.subCategories.find(subCategory => subCategory.id == form.value.subCategoryId).name;
      this.ad.type = form.value.type;

      this.adService.updateAd(this.ad).subscribe(
        result => {
          console.log(result);
          this.ad = null;
        }
      );

    } else {

      const ad = {
        description: form.value.description,
        image: this.adService.images,
        video: this.adService.videos,
        hotelId: form.value.hotelId,
        hotelName: this.hotels.find(hotel => hotel.id ==  form.value.hotelId).name,
        categoryId: form.value.categoryId,
        categoryName: this.categories.find(category => category.id ==  form.value.categoryId).name,
        subCategoryId: form.value.subCategoryId,
        subCategoryName: this.subCategories.find(subCategory => subCategory.id == form.value.subCategoryId).name,
        type: form.value.type
      }
  
      this.adService.addAd(ad).subscribe(
        result => {
          console.log(result);
          this.dataSource.data = result;
        } 
      );
    }

    form.reset();
    this.adService.images = [];
    this.adService.videos = [];
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(ad: Ad) {
    this.categoryService.getSubCategories(ad.categoryId).subscribe(
      result => {
        this.subCategories = result;
      }
    );
    this.adService.editAd(ad);
  }

  onDelete(ad: Ad) {
    this.adService.deleteAd(ad).subscribe(
      result => {
        this.dataSource.data = result;
        console.log(result);
      }
    );
  }

}

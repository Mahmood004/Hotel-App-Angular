import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SubCategory } from './sub-category.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CategoryService } from '../shared/category.service';
import { NgForm } from '@angular/forms';
import { Category } from '../categories/category.model';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css']
})
export class SubCategoriesComponent implements OnInit, AfterViewInit {

  allCategories: Category[] = [];
  subCategories: SubCategory[] = [];

  subCategory: SubCategory;
  updateMode: boolean = false;

  displayedSubCategoryColumns = ['id', 'name', 'category', 'status', 'edit', 'delete'];
  dataSourceSubCategory = new MatTableDataSource<SubCategory>();
  @ViewChild(MatSort) sortSubCategory: MatSort;
  @ViewChild('paginatorSubCategory') paginatorSubCategory: MatPaginator;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {

    this.categoryService.getAllCategories().subscribe(
      result => {
        this.allCategories = result;
      }
    );

    this.categoryService.getSubCategories().subscribe(
      result => {
        this.subCategories = result;
        this.dataSourceSubCategory.data = this.subCategories;
      }
    );

    this.categoryService.subCategoryIsEdit.subscribe(
      result => {
        console.log(result);
        this.subCategory = result;
      }
    );

  }

  ngAfterViewInit() {
    this.dataSourceSubCategory.sort = this.sortSubCategory;
    this.dataSourceSubCategory.paginator = this.paginatorSubCategory;
  }

  onSubmitSubCategory(form: NgForm) {

    if (this.subCategory) {
      
      this.subCategory.parentId = form.value.category;
      this.subCategory.categoryName = this.allCategories.find(cat => cat.id === form.value.category).name
      this.subCategory.name = form.value.name;
      this.subCategory.status = form.value.status;

      const obj = this.allCategories.find(category => category.id == this.subCategory.id);
      obj.name = form.value.name;
      
      this.categoryService.updateSubCategory(this.subCategory).subscribe(
        result => console.log(result)
      );

      this.subCategory = null;

    } else {

      const subCategory = {
        name: form.value.name,
        categoryName: this.allCategories.find(cat => cat.id === form.value.category).name,
        parentId: form.value.category,
        status: form.value.status
      };
  
      this.categoryService.addSubCategory(subCategory).subscribe(
        result => {
          this.dataSourceSubCategory.data = result.subCategories;
          this.allCategories.push(result.subCategory);
          console.log(this.allCategories);
        }
      );
    }

    form.reset();
  }

  onSubCategoryEdit(subCategory: SubCategory) {
    this.categoryService.editSubCategory(subCategory);
  }

  onSubCategoryDelete(subCategory: SubCategory) {
    this.allCategories.splice(this.allCategories.indexOf(subCategory), 1);
    this.categoryService.deleteSubCategory(subCategory).subscribe(
      result => {
        this.dataSourceSubCategory.data = result;
        this.allCategories = [...this.categoryService.categories, ...this.categoryService.subCategories];
      }
    );
  }

  applySubCategoryFilter(filterValue: string) {
    this.dataSourceSubCategory.filter = filterValue.trim().toLowerCase();
  }

}

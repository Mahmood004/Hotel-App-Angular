import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from './category.model';
import { CategoryService } from '../shared/category.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, AfterViewInit {

  categories: Category[] = [];
  
  category: Category;
  updateMode: boolean = false;

  displayedCategoryColumns = ['id', 'name', 'status', 'edit', 'delete'];
  dataSourceCategory = new MatTableDataSource<Category>();
  @ViewChild(MatSort) sortCategory: MatSort;
  @ViewChild('paginatorCategory') paginatorCategory: MatPaginator;
  

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result;
        this.dataSourceCategory.data = this.categories;
      }
    );

    this.categoryService.categoryIsEdit.subscribe(
      result => {
        this.updateMode = true;
        this.category = result;
      }
    );
  }

  ngAfterViewInit() {
    this.dataSourceCategory.sort = this.sortCategory;
    this.dataSourceCategory.paginator = this.paginatorCategory;
  }

  onSubmit(form: NgForm) {

    if (this.category) {

      this.category.name = form.value.name;
      this.category.status = form.value.status;
      this.categoryService.updateCategory(this.category).subscribe(
        result => console.log(result)
      );
      this.category = null;
      this.updateMode = false;

    } else {

      const category = {
        name: form.value.name,
        status: form.value.status
      };
      
      this.categoryService.addCategory(category).subscribe(
        result => {
          this.dataSourceCategory.data = result;
        }
      );
    }
    
    form.reset();
  }

  onCategoryEdit(category: Category) {
    this.categoryService.editCategory(category);
  }

  onCategoryDelete(category: Category) {
    this.categoryService.deleteCategory(category).subscribe(
      result => {
        this.dataSourceCategory.data = result;
      }
    );
  }

  applyCategoryFilter(filterValue: string) {
    this.dataSourceCategory.filter = filterValue.trim().toLowerCase();
  }

}

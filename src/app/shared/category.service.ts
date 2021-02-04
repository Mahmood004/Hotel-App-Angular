import { Category } from "../categories/category.model";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Injectable, EventEmitter } from "@angular/core";
import { SubCategory } from "../sub-categories/sub-category.model";
import { UIService } from "../shared/ui.service";

@Injectable()
export class CategoryService {

    categories: Category[] = [];
    subCategories: SubCategory[] = [];

    categoryIsEdit = new EventEmitter<Category>();
    subCategoryIsEdit = new EventEmitter<SubCategory>();

    constructor(private http: Http, private uiService: UIService) {}

    addCategory(category: Category) {

        const body = JSON.stringify(category);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.post('http://localhost:3000/category' + token, body, {headers: headers})
            .map((response: Response) => {
                const category = response.json();
                const { id, name, status } = category;
                this.categories.push({ id, name, status });
                return this.categories;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while submitting a new category', null, 3000);
                return Observable.throw(error.json());
            });
    }

    addSubCategory(subCategory: SubCategory) {

        const body = JSON.stringify(subCategory);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.post('http://localhost:3000/subCategory' + token, body, {headers: headers})
            .map((response: Response) => {
                const subCategory = response.json();
                const { id, parentId, name, status, category } = subCategory;
                this.subCategories.push({ id, parentId, name, status, categoryName: category.name });
                return { subCategory, subCategories: this.subCategories };
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while submitting a new sub category', null, 3000);
                return Observable.throw(error.json());
            });
    }

    getCategories() {
        return this.http.get('http://localhost:3000/categories')
            .map((response: Response) => {
                const categories = response.json();
                const transformedCategories: Category[] = [];
                for (let category of categories) {
                    const { id, name, status } = category;
                    transformedCategories.push({ id, name, status });
                }
                this.categories = transformedCategories;
                return this.categories;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while fetching categories', null, 3000);
                return Observable.throw(error.json());
            })
    }

    getAllCategories() {
        return this.http.get('http://localhost:3000/allCategories')
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while fetching all categories', null, 3000);
                return Observable.throw(error.json());
            });
    }

    getSubCategories(categoryId?: number) {
        
        return this.http.get('http://localhost:3000/subCategories?cat_id=' + categoryId)
            .map((response: Response) => {
                const subCategories = response.json();
                console.log(subCategories);
                const transformedSubCategories: SubCategory[] = [];
                for (let subCategory of subCategories) {
                    const { id, parentId, name, status, category } = subCategory;
                    transformedSubCategories.push({ id, parentId, name, status, categoryName: category.name });
                }
                this.subCategories = transformedSubCategories;
                return this.subCategories;
            })
            .catch((error: Response) => {
                console.log(error);
                this.uiService.showSnackbar('Something went wrong while fetching sub categories', null, 3000);
                return Observable.throw(error.json());
            })
    }

    editCategory(category: Category) {
        this.categoryIsEdit.emit(category);
    }

    editSubCategory(subCategory: SubCategory) {
        this.subCategoryIsEdit.emit(subCategory);
    }

    updateCategory(category: Category) {

        const body = JSON.stringify(category);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.patch('http://localhost:3000/category/' + category.id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while updating a category', null, 3000);
                return Observable.throw(error.json());
            })
    }

    updateSubCategory(subCategory: SubCategory) {

        const body = JSON.stringify(subCategory);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.patch('http://localhost:3000/subCategory/' + subCategory.id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while updating a sub category', null, 3000);
                return Observable.throw(console.log(error.json())); 
            });
    }

    deleteCategory(category: Category) {

        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.categories.splice(this.categories.indexOf(category), 1);
        console.log('delete category section', category);
        const url = 'http://localhost:3000/category/' + category.id + token;
        console.log(url);
        return this.http.delete('http://localhost:3000/category/' + category.id + token)
            .map((response: Response) => this.categories) 
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while deleting a category', null, 3000);
                return Observable.throw(error.json());
            })
    }

    deleteSubCategory(subCategory: SubCategory) {

        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.subCategories.splice(this.subCategories.indexOf(subCategory), 1);
        return this.http.delete('http://localhost:3000/subCategory/' + subCategory.id + token)
            .map((response: Response) => {
                const subCategories = response.json();
                const transformedSubCategories: SubCategory[] = [];
                for (let subCategory of subCategories) {
                    const { id, parentId, name, status, category } = subCategory;
                    transformedSubCategories.push({ id, parentId, name, status, categoryName: category.name });
                }
                this.subCategories = transformedSubCategories;
                return this.subCategories;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while deleting a sub category', null, 3000);
                return Observable.throw(error.json());
            });
    }
}
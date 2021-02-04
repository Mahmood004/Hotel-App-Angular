import { NgModule } from "@angular/core";
import { CategoriesComponent } from "./categories.component";
import { SharedModule } from "../shared/shared.module";
import { CategoryRoutingModule } from "./category-routing.module";

@NgModule({
    declarations: [
        CategoriesComponent
    ],
    imports: [
        SharedModule,
        CategoryRoutingModule
    ],
    exports: []
})
export class CategoryModule {}
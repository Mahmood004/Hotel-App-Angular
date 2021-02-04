import { NgModule } from "@angular/core";
import { SubCategoriesComponent } from "./sub-categories.component";
import { SharedModule } from "../shared/shared.module";
import { SubCategoryRoutingModule } from "./sub-category-routing.module";

@NgModule({
    declarations: [
        SubCategoriesComponent
    ],
    imports: [
        SharedModule,
        SubCategoryRoutingModule
    ],
    exports: []
})
export class SubCategoryModule {}
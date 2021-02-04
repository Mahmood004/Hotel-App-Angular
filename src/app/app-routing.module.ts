import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "./auth/auth-guard.service";

const routes: Routes = [

    { path: 'hotels', loadChildren: './hotels/hotel.module#HotelModule', canLoad: [AuthGuardService] },
    { path: 'categories', loadChildren: './categories/category.module#CategoryModule', canLoad: [AuthGuardService] },
    { path: 'subCategories', loadChildren: './sub-categories/sub-category.module#SubCategoryModule', canLoad: [AuthGuardService] },
    { path: 'ads', loadChildren: './ads/ad.module#AdModule', canLoad: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
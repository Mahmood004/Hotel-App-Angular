import { NgModule } from "@angular/core";
import { AdsComponent } from "./ads.component";
import { HttpClientModule } from "@angular/common/http";
import { DialogComponent } from "./dialog.component";
import { SharedModule } from "../shared/shared.module";
import { AdRoutingModule } from "./ad-routing.module";

@NgModule({
    declarations: [
        AdsComponent,
        DialogComponent
    ],
    imports: [
        SharedModule,
        HttpClientModule,
        AdRoutingModule
    ],
    exports: [],
    entryComponents: [DialogComponent]
})
export class AdModule {}
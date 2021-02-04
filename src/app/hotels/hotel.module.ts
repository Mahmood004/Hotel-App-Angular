import { NgModule } from "@angular/core";
import { HotelsComponent } from "./hotels.component";
import { SharedModule } from "../shared/shared.module";
import { HotelRoutingModule } from "./hotel-routing.module";

@NgModule({
    declarations: [
        HotelsComponent
    ],
    imports: [
        SharedModule,
        HotelRoutingModule
    ],
    exports: []
})
export class HotelModule {}
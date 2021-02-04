import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        HttpModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        HttpModule
    ]
})
export class SharedModule {}

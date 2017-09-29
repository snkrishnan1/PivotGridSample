import { Component, NgModule } from '@angular/core';
import { IgPivotGridComponent, IgPivotDataSelectorComponent } from "../../src/igniteui.angular2";
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SlideOut } from './SlideOut.ts';
import { AfterViewInit, ElementRef, Inject, Input, Renderer, ViewChild } from '@angular/core';
import { PivotGrid } from './app';
import { InfraPivotGrid } from './InfraPivotGrid.ts'
import { SessionService } from './SessionService.ts';
//import { CORE_DIRECTIVES } from '@angular/common';

declare var jQuery: any;

@Component({
    selector: 'workbook',
    templateUrl: "./Workbook.html"
})
export class Workbook {
    private optsGrid: IgPivotGrid;
    private gridId: string;
    private data: any;
    private result: any;
    selected: any;
    workbookSheet: any;
    //@ViewChild(PivotGrid) pivotGrid: PivotGrid;
    workbookSheetsList: any;
    ReportID: any;
    constructor() {
        this.workbookSheet = [{ "name": "" }];//Prepopulate the dropdown with empty while loading, then it is assigned with the actual value
        this.selected = this.workbookSheet;

        this.workbookSheetsList = [{ "name": "Report1" }, { "name": "Report2" }, { "name": "Report3" }, { "name": "Report4" }];
        this.ReportID = "Report1";
     
    }

    onChange(workbook: any) {
        console.log("onChange event in Workbook");
        console.log(workbook);
        this.ReportID = workbook.name;
        //this.pivotGrid.LoadInfraPivotGrid();
     
    }

   

}

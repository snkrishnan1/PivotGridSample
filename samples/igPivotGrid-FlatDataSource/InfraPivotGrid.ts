import { Component, NgModule, SimpleChange, AfterViewInit } from '@angular/core';
import { IgPivotGridComponent, IgPivotDataSelectorComponent } from "../../src/igniteui.angular2";
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SlideOut } from './SlideOut.ts';
import { ElementRef, Inject, Input, Renderer, ViewChild } from '@angular/core';
import { SessionService } from './SessionService.ts';
import { Workbook } from './Workbook.ts';
import { WidgetConfigService } from './WidgetConfigService.ts';

declare var jQuery: any;
declare var window: any;

@Component({
    selector: 'InfraPivotGrid',
    templateUrl: "./igPivotGrid-FlatDataSourceTemplate.html"
})
export class InfraPivotGrid {
    private optsGrid: IgPivotGrid;
    private gridId: string;
    private selectorId: string;
    private data: any;
    private result: any;
    @ViewChild(SlideOut) slideOut: SlideOut;
    showRowTotalOnTop: boolean;
    private optsSelector: IgPivotDataSelector;
    @Input() ReportID: any;
    //widgetConfigData: any;

    slideOutReportID: any;

    constructor(private _SessionService: SessionService, private _WidgetConfigService: WidgetConfigService) {
        console.log("In constructor of InfraPivotGrid");
        this.gridId = "pivotGrid";
        this.selectorId = "dataSelector";
	    this.showRowTotalOnTop = true;
    }


    //Whenever the ReportId changes in the Parent component, this event is triggered because of the Input()
    ngOnChanges(changes: SimpleChange) {
        console.log("In ngOnChanges of PivotGrid");
        if (changes['ReportID']) {
            console.log("ReportID changed in parent : " + this.ReportID);
            if (this.ReportID != undefined) {

                //Loading the PivotGrid
                this.LoadInfraPivotGrid();
                console.log("After Loading this.LoadInfraPivotGrid()");

            }
        }
    }

    public LoadInfraPivotGrid()
    {
        console.log("In LoadInfraPivotGrid, ReportID : " + this.ReportID);
        console.log("this.CacheURL : " + this.CacheURL);

        let getWindow = () => {
            return window.innerHeight - 150;
        };

        this._WidgetConfigService.GetData(this.ReportID).subscribe(reslt => {
            //console.log("data from Redic Cache");
            //console.log(reslt);
            if (reslt === "") {
                this._SessionService.ERROR_MESSAGE = "Report doesn't contain any data. Please populate data and rerun this report.";
                //this.loading = false;
                return;
            }
            var json = JSON.parse(reslt);
            this.result = JSON.parse(reslt);
            console.log("After JSON Parse of cache data");
            //console.log(json);

            this._WidgetConfigService.GetWidgetConfig(this.ReportID).subscribe(res => {
                console.log("After subscribe in PopulatePivotGrid - GetData");

                //this.widgetConfigData = res;
                //console.log("this.widgetConfigData");
                //console.log(this.widgetConfigData);
               

                var dateHierarchy = false;
                var widgetConfigData = JSON.parse(res, (key, value) => {
                    if (key === "aggregator") {
                        //;console.log("inside if (key === 'aggregator') {");
                        if (typeof value === "string" && value.search("function") > -1) {
                            var startPos = value.indexOf("{");
                            var endPos = value.lastIndexOf("}");
                            var body = value.substring(startPos + 1, endPos);
                            var args = "items, cellMetadata";
                            value = new Function(args, body);
                            return value;
                        }
                    }
                    else if (key === "memberProvider") {
                        if (typeof value === "string" && value.search("function") > -1) {
                            var startPos = value.indexOf("{");
                            var endPos = value.lastIndexOf("}");
                            var body = value.substring(startPos + 1, endPos);
                            var args = "item";
                            value = new Function(args, body);
                            return value;
                        }
                        else
                            return eval(value);
                    }
                    else if (key === "rendering") {
                        if (typeof value === "string" && value.search("function") > -1) {
                            var startPos = value.indexOf("{");
                            var endPos = value.lastIndexOf("}");
                            var body = value.substring(startPos + 1, endPos);
                            var args = "event, object";
                            value = new Function(args, body);
                            return value;
                        }
                    }
                    else
                        return value;
                });

                for (var i = 0; i < json.length; i++) {
                    var obj = json[i];
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop) && !isNaN(obj[prop]) && !this.CheckColumnExistsInDimension(widgetConfigData.dataSource.metadata.cube.dimensions, prop)) {//to convert the string numerics to actual numbers
                            obj[prop] = +obj[prop];
                        }
                    }
                }

                //this.result = json;
                console.log("After processing - widgetConfigData.dataSource");
                console.log(widgetConfigData.dataSource);

                console.log("this.widgetConfigData.dataSource.metadata");
                console.log(widgetConfigData.dataSource.metadata);

                this.data = new jQuery.ig.OlapFlatDataSource({
                    dataSource: this.result,                //From this.cacheurl
                    metadata: widgetConfigData.dataSource.metadata,    //mtaData,
                    rows: widgetConfigData.dataSource.rows,            // Preload hierarchies for the rows, columns, filters and measures
                    columns: widgetConfigData.dataSource.columns,
                    measures: widgetConfigData.dataSource.measures
                });

                console.log("this.data");
                console.log(this.data);

                if (widgetConfigData.dateFormatColumns != null)
                    window.dateColumnName = widgetConfigData.dateFormatColumns.split("|");

                if (widgetConfigData.dateFormats != null)
                    window.dateFormats = widgetConfigData.dateFormats.split("|");

                if (widgetConfigData.showRowTotalOnTop == "false")
                    this.showRowTotalOnTop = false;

                console.log("Before binding grid");
                var windowHeight = getWindow() + "px";

                this.optsGrid = {
                    dataSource: this.data,
                    height: "630px",
                    width: "100%",
                    autoGenerateColumns: false,
                    allowSorting: true,
                    allowHeaderRowsSorting: true,
                    allowHeaderColumnsSorting: true,
                    firstSortDirection: "ascending",
                    firstLevelSortDirection: "ascending",
                    defaultRowHeaderWidth: 130,
                    levelSortDirections: widgetConfigData.levelSortDirections,
                    allowResizing: true,
                    isParentInFrontForRows: this.showRowTotalOnTop,//to show the summary/total row in the bottom
                    gridOptions: {
                        defaultColumnWidth: 100,
                        features: [
                            {
                                name: "Resizing",
                                allowDoubleClickToResize: true,
                            }
                        ],
                        rendering: widgetConfigData.rendering,
                        dataRendering: function (evt: any, ui: any) {
                            // return if the column collection is not generated yet
                            if (ui.owner.options.columns && ui.owner.options.columns.length === 0) {
                                return;
                            }
                            for (var i = 0; i < ui.owner.options.columns.length; i++) {
                                if (ui.owner.dataSource.data()[0] && $.isNumeric(ui.owner.dataSource.data()[0][ui.owner.options.columns[i].key])) {
                                    ui.owner.options.columns[i].columnCssClass = "right-align !important";
                                }
                            }
                        },
                    },
                    dataSourceInitialized: function (evt, ui) {
                        ui.owner.expandTupleMember("rowAxis", 0, 0, true);
                        //ui.owner.expandTupleMember("rowAxis", 0, 0, true);
                        //ui.owner.expandTupleMember("columnAxis", 0, 0, true);
                    },
                    tupleMemberExpanding: function (evt, ui) {
                        //show progress indicator here
                        //this.loading = true;
                    },
                    tupleMemberExpanded: function (evt, ui) {
                        //hide progress indicator here
                        //this.loading = false;
                    }
                };


                ////To trigger the Change event in the SlideOut component
                this._SessionService.PivotGridDataSource = this.data;//Data is passed from the parent component to child component with the help of this Service component
                this.slideOutReportID = this.ReportID;//to Trigger change event in SlideOut

            });  //end of this.cacheDataService.GetData(this.cacheurl).subscribe(reslt =>

        });//end of (res => {





    }

    CheckColumnExistsInDimension(objDimension: any, columnName: any) {
        for (var prop in objDimension) {
            if (objDimension[prop].name == columnName)
                return true;
        }
        return false;
    }

    //ngAfterViewInit() {
    //    this.slideOut.LoadConfigurator(this.data);
    //}
}


//@NgModule({
//    imports: [BrowserModule],
//    declarations: [Workbook, InfraPivotGrid, IgPivotGridComponent, IgPivotDataSelectorComponent, SlideOut],
//    providers: [SessionService, WidgetConfigService],
//    bootstrap: [Workbook]
//    //bootstrap: [AppComponent]
//})
//export class AppModule { }

//platformBrowserDynamic().bootstrapModule(AppModule);

//@NgModule({
//	imports:	  [ BrowserModule ],
//    declarations: [AppComponent, IgPivotGridComponent, IgPivotDataSelectorComponent, SlideOut ],
//	bootstrap:	[ AppComponent ]
//})
//export class AppModule {}

//platformBrowserDynamic().bootstrapModule(AppModule);
import { Component, ElementRef, Inject, ViewChild, Input, SimpleChange } from '@angular/core';
import { IgPivotDataSelectorComponent } from "../../src/igniteui.angular2";
import { SessionService } from './SessionService.ts';
declare var jQuery: any;

@Component({
    selector: 'slide-out',
    templateUrl: './SlideOut.html',
    styleUrls:['../SlideOut.css']
})

export class SlideOut {
    elementRef: ElementRef;
    private slideItOut = false;
    private optsSelector: IgPivotDataSelector;
    @Input() slideOutReportID: any;
    data: any;

    constructor( @Inject(ElementRef) elementRef: ElementRef, private _SessionService: SessionService)
    {
        this.elementRef = elementRef;
        this.slideOutReportID = "Test";
    }

    ngOnChanges(changes: SimpleChange) {
        //debugger;
        if (changes['slideOutReportID']) {
            console.log("slideOutReportID changed in parent : " + this.slideOutReportID);

            if (this.slideOutReportID != undefined) {
                let getWindow = () => {
                    return window.innerHeight - 50;
                };
                console.log("slide out Height : " + (getWindow()));

                //To bind the selector component data is being fetched from the Service component
                this.data = this._SessionService.PivotGridDataSource;

                this.optsSelector = {
                    dataSource: this.data,
                    height: getWindow(),
                    width: "400px",
                    deferUpdate: true,
                    dragAndDropSettings: {
                        zIndex: 100
                    }
                };
            }
        }
    }

    public LoadConfigurator(dataSource: any)
    {
        let getWindow = () => {
            return window.innerHeight - 150;
        };
        console.log("slide out Height : " + (getWindow() / 2));

        this.optsSelector = {
            dataSource: dataSource,
            height: "550px",
            width: "400px",
            deferUpdate: false,
            dragAndDropSettings: {
                zIndex: 150
            }
        };
    }
}


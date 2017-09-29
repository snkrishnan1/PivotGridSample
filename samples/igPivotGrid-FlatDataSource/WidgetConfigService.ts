import { Component, Injectable } from '@angular/core';
import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
//import { ContentHeaders } from './Headers';
import { SessionService } from './SessionService.ts';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Headers } from '@angular/http';

@Injectable()
export class WidgetConfigService {
    private WIDGETCONFIGSERVICE_BASEURL: string;
    private WIDGETCONFIGSERVICE_SHEETSBYWORKBOOKID: string;
    private WIDGETCONFIGSERVICE_WIDGETCONFIGURL: string;

    private WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL: string;
    private WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL: string;

    //private WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL1: string;
    //private WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL1: string;
    //private WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL2: string;
    //private WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL2: string;
    private DataFolder: any;
    private _http: Http;

    constructor(http: Http, private _SessionService: SessionService) {
        console.log("Constructor of WidgetConfigService");
        this.WIDGETCONFIGSERVICE_BASEURL = "http://localhost:3000/";

        this.DataFolder = 2;




        this._http = http;
    }

    //public GetSheetsByWorkbookID = (WorkbookID): Observable<Response> => {
    //    console.log("Inside method GetSheetsByWorkbookID in WidgetConfigService");
    //    console.log("API URL: " + this.WIDGETCONFIGSERVICE_SHEETSBYWORKBOOKID);



    //    //export const ContentHeaders = new Headers();
    //    let ContentHeaders = new Headers();
    //    ContentHeaders.append('Accept', 'application/json');
    //    ContentHeaders.append('Content-Type', 'application/json');

    //    return this._http.get(this.WIDGETCONFIGSERVICE_SHEETSBYWORKBOOKID, { headers: ContentHeaders })
    //        .map(Response => Response.json())
    //        .catch(this.HandleError);
    //}

    GetData(requrl: string) {
        console.log("requrl passed : " + requrl);
        if (requrl == "Report1") {
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report1/CacheJsonData1.json";
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report1/ConfigData1.json";
        }
        else if (requrl == "Report2") {
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report2/CacheJsonData2.json";
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report2/ConfigData2.json";
        }
        else if (requrl == "Report3") {
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report3/CacheJsonData3.json";
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report3/ConfigData3.json";
        }
        else if (requrl == "Report4") {
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report4/CacheJsonData4.json";
            this.WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL = this.WIDGETCONFIGSERVICE_BASEURL + "/samples/igPivotGrid-FlatDataSource/MockData/Report4/ConfigData4.json";
        }


        console.log("In GetData of WidgetConfigService : " + this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.WIDGETCONFIGSERVICE_PIVOTGRIDCACHEDATAURL, options)
            .map(res => res.text());
    }

    GetWidgetConfig(reportID: string) {
        console.log("In GetWidgetConfig of WidgetConfigService");
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        //this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL = this.WIDGETCONFIGSERVICE_BASEURL + reportID;
        this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL = this.WIDGETCONFIGSERVICE_PIVOTGRIDCONFIGDATAURL;
        console.log("this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL : " + this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL);
        return this._http.get(this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL, options)
            .map(res => res.text());
    }

    private HandleError(error: any) {
        console.log("Inside HandleError of WidgetConfigService");
        this._SessionService.ERROR_MESSAGE = "Error occurred in WidgetConfig Service. Error : " + error;
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}





//import { Component, Injectable } from '@angular/core';
//import { Http, Headers, Response, Jsonp } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
//import { Observer } from 'rxjs/Observer';
////import { ContentHeaders } from './Headers';

////import { SessionService } from './SessionService';

//import 'rxjs/Rx';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/catch';


//@Injectable()
//export class CacheService {

//    private CLIENTAPISERVICE_BASEURL: string;
//    private CACHE_DATA: string;
//    private CONFIG_DATA: string;


//    private _http: Http;

//    constructor(http: Http, private _SessionService: SessionService) {
//        console.log("Constructor of ClientAPIService");
//        this.CLIENTAPISERVICE_BASEURL = "http://localhost:3000/";
//        this.CACHE_DATA = this.CLIENTAPISERVICE_BASEURL + "CacheJsonData.json";
//        this.CONFIG_DATA = this.CLIENTAPISERVICE_BASEURL + "ClientApiService/GetReportGroupsList.json";

//        this._http = http;
//    }

//    GetData(requrl: string) {
//        console.log("In GetData of WidgetConfigService : " + requrl);
//        var headers = new Headers();
//        headers.append('Content-Type', 'application/json');
//        let options = new RequestOptions({ headers: headers });

//        return this._http.get(requrl, options)
//            .map(res => res.text());
//    }

//    GetWidgetConfig(reportID: string) {
//        console.log("In GetWidgetConfig of WidgetConfigService");
//        var headers = new Headers();
//        headers.append('Content-Type', 'application/json');
//        let options = new RequestOptions({ headers: headers });

//        this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL = this.WIDGETCONFIGSERVICE_BASEURL + reportID;
//        console.log("this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL : " + this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL);
//        return this._http.get(this.WIDGETCONFIGSERVICE_WIDGETCONFIGURL, options)
//            .map(res => res.text());
//    }

//}
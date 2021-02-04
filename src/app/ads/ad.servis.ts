import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from "@angular/common/http";
import { Http, Headers, Response } from '@angular/http'
import { Subject } from 'rxjs/Subject';
import { Injectable, EventEmitter } from "@angular/core";
import { Ad } from "../ads/ad.model";
import { Observable } from "rxjs";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AdService {
    constructor(private httpClient: HttpClient, private http: Http, private uiService: UIService) {}

    ads: Ad[] = [];
    adIsEdit = new EventEmitter<Ad>();
    images: string[] = [];
    videos: string[] = [];
    videoExtensions = ['3g2', '3gp', 'avi', 'flv', 'h264', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'rm', 'swf', 'vob', 'wmv'];

    public upload(files: Set<File>) {

        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const status = {};

        files.forEach(file => {

            let fileName = Date.now() + '-' + file.name;

            if (this.videoExtensions.includes(fileName.split('.').pop())) {
                this.videos.push(fileName);
            } else {
                this.images.push(fileName);
            }

            const formData = new FormData();
            formData.append('file', file, fileName);

            const req = new HttpRequest('POST', 'http://localhost:3000/uploads' + token, formData, {
                reportProgress: true,
                responseType: 'text'
            });

            const progress = new Subject<number>();

            this.httpClient.request(req).subscribe(
                event => {
                    if (event.type == HttpEventType.UploadProgress) {
                        const percentDone = Math.round(100 * event.loaded / event.total);

                        progress.next(percentDone);
                    } else if (event instanceof HttpResponse) {
                        console.log('in it');
                        progress.complete();
                    }
                },
                error => {
                    console.log(error);
                }
            );

            status[file.name] = {
                progress: progress.asObservable()
            };
        });

        return status;

    }

    addAd(ad: Ad) {
        const body = JSON.stringify(ad);
        const headers = new Headers({'content-type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.post('http://localhost:3000/ad' + token, body, {headers: headers})
            .map((response: Response) => {
                let newAdId = response.json().id;
                const { description, image, video, hotelId, hotelName, categoryId, categoryName, subCategoryId, subCategoryName, type } = ad;
                this.ads.push({ id: newAdId, description, image: image, video: video, hotelId, hotelName, categoryId, categoryName, subCategoryId, subCategoryName, type });
                return this.ads;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while submitting a new ad', null, 3000);
                return Observable.throw(error.json());
            });
    }

    getAds() {
        return this.http.get('http://localhost:3000/ads')
            .map((response: Response) => {
                const ads = response.json();
                console.log(ads);
                const transformedAds = [];
                for (let ad of ads) {
                    const { id, description, image, video, hotel, category, subCategory, type } = ad;
                    
                    transformedAds.push({ id, description, image: image.split(','), video: video.split(','), hotelId: hotel.id, hotelName: hotel.name, categoryId: category.id, categoryName: category.name, subCategoryId: subCategory.id, subCategoryName: subCategory.name, type });
                }
                this.ads = transformedAds;
                console.log(this.ads);
                return this.ads;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while fetching ads', null, 3000);
                return Observable.throw(error.json());
            });
    }

    editAd(ad: Ad) {
        this.adIsEdit.emit(ad);
    }

    updateAd(ad: Ad) {
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(ad);
        console.log(body);
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.patch('http://localhost:3000/ad/' + ad.id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while updating an ad', null, 3000);
                return Observable.throw(error.json());
            });
    }

    deleteAd(ad: Ad) {
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.ads.splice(this.ads.indexOf(ad), 1);
        return this.http.delete('http://localhost:3000/ad/' + ad.id + token)
            .map((response: Response) => this.ads)
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while deleting an ad', null, 3000);
                return Observable.throw(error.json());
            });
    }
}
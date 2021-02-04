import { Hotel } from "../hotels/hotel.model";
import { Http, Headers, Response } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { UIService } from "../shared/ui.service";


@Injectable()
export class HotelService {

    private hotels: Hotel[] = [];

    hotelIsEdit = new EventEmitter<Hotel>();

    constructor(private http: Http, private uiService: UIService) {}

    addHotel(hotel: Hotel) {
        
        const body = JSON.stringify(hotel);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.post('http://localhost:3000/hotel' + token, body, {headers: headers})
            .map((response: Response) => {
                const hotel = response.json();
                const { id, name, logo, address, email, phone, latitude, longitude, status } = hotel
                this.hotels.push({ id, name, logo, address, email: email.split(','), phone: phone.split(','), latitude, longitude, status });
                return this.hotels;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while submitting a new hotel', null, 3000);
                return Observable.throw(error.json());
            });
    }

    getHotels() {

        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.get('http://localhost:3000/hotels' + token)
            .map((response: Response) => {
                const hotels = response.json();
                const transformedHotels: Hotel[] = [];
                for (let hotel of hotels) {
                    const { id, name, logo, address, email, phone, latitude, longitude, status } = hotel
                    transformedHotels.push({ id, name, logo, address, email: email.split(','), phone: phone.split(','), latitude, longitude, status });
                }
                this.hotels = transformedHotels;
                return this.hotels;
            })
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while fetching hotels', null, 3000);
                return Observable.throw(error.json());
            })
    }

    editHotel(hotel: Hotel) {
        this.hotelIsEdit.emit(hotel);
    }

    updateHotel(hotel: Hotel) {
        const body = JSON.stringify(hotel);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.patch('http://localhost:3000/hotel/' + hotel.id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while updating a hotel', null, 3000);
                return Observable.throw(error.json());
            })
    }

    deleteHotel(hotel: Hotel) {
        
        this.hotels.splice(this.hotels.indexOf(hotel), 1);
        console.log(this.hotels);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.delete('http://localhost:3000/hotel/' + hotel.id + token)
            .map((response: Response) => this.hotels)
            .catch((error: Response) => {
                console.log(error.json());
                this.uiService.showSnackbar('Something went wrong while deleting a hotel', null, 3000);
                return Observable.throw(error.json());
            });

    }

    uploadFile(file: File, avatar: string) {

        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const formData: FormData = new FormData();
        formData.append('file', file, avatar);

        this.http.post('http://localhost:3000/upload' + token, formData).subscribe(
            response => {
                
                if (response.status == 200 && response.ok) {
                    console.log(response['_body']);
                    return response;
                }
            }
        )
        
    }

}
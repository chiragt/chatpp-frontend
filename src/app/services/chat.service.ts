import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User,Chat } from '@app/models';

@Injectable({ providedIn: 'root' })
export class ChatService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    sendMessage(message,toid) {
        var userData = JSON.parse(localStorage.getItem('user'));
        let from_id = userData.data.id;
        let to_id = Number(toid);
        if(from_id==to_id){
            this.router.navigate(['/users']);
        }
        return this.http.post(`${environment.apiUrl}/message`, { message,from_id,to_id });
    }

    getMessage(id) {
        var userData = JSON.parse(localStorage.getItem('user'));
        let from_id = id;
        let to_id = userData.data.id;
        return this.http.get<Chat[]>(`${environment.apiUrl}/message/${from_id}/${to_id}`);
    }
}
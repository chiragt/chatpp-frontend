import { Component, OnInit } from '@angular/core';
import {io} from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ChatService } from '@app/services';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-chatwithme',
  templateUrl: './chatwithme.component.html',
  styleUrls: ['./chatwithme.component.css']
})
export class ChatwithmeComponent implements OnInit {
  socket;
  loading = false;
  message : string;
  private retrivedata: Array<any> = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
        private http: HttpClient,
        private chatService: ChatService
        
  ) { }

  ngOnInit(): void {

    this.setupSocketConnection();
    
  }
  setupSocketConnection() {
    var activeURL = window.location.href;
    let activeURLWithId = activeURL.split('/');
    this.socket = io(`${environment.socket_endpoint}`, {transports: ['websocket', 'polling', 'flashsocket']});
    this.socket.on('message-broadcast', (data: string) => {
   if (data) {
    const element = document.createElement('li');
    element.innerHTML = data;
    element.style.background = 'white';
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    document.getElementById('message-list').appendChild(element);
    }
  });
  //Get All the messages
  this.chatService.getMessage(activeURLWithId[5])
  .pipe(first())
  .subscribe(
      data => {
          
          if(data !== null){
            this.retrivedata = data;
            let allUserItem = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):[];
            for (let entry of this.retrivedata) {
                //console.log('entry', entry.Message.message)
                
                const element = document.createElement('li');
                element.innerHTML = entry.Message.message;
                element.style.background = 'mistyrose';
                element.style.padding =  '15px 30px';
                element.style.margin = '10px';
                (entry.from_id == allUserItem.data.id) ? element.style.textAlign = 'right' : element.style.textAlign = 'left';
                (entry.from_id == allUserItem.data.id) ? element.style.background = 'mistyrose' : element.style.background = 'white';
                
                document.getElementById('message-list').appendChild(element);
            }

          }
          //this.router.navigate(['../login'], { relativeTo: this.route });
      },
      error => {
          this.loading = false;
      });

 }
 SendMessage() {
  //this.http.post(`${environment.apiUrl}/message`, this.message);
  this.socket.emit('message',this.message);


  const element = document.createElement('li');
  element.innerHTML = this.message;
  element.style.background = 'mistyrose';
  element.style.padding =  '15px 30px';
  element.style.margin = '10px';
  element.style.textAlign = 'right';
  document.getElementById('message-list').appendChild(element);
 
  var activeURL = window.location.href;
  let activeURLWithId = activeURL.split('/');
  this.chatService.sendMessage(this.message,activeURLWithId[5])
  .pipe(first())
  .subscribe(
      data => {
         
         // this.router.navigate(['../login'], { relativeTo: this.route });
      },
      error => {
          
          this.loading = false;
      });

  this.message = '';

  
  
}
}

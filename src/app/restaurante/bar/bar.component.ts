import { Component, OnInit, OnDestroy } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { OrderPayload } from '../../interfaces/OrderPayload';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css'
})
export class BarComponent  implements OnInit, OnDestroy {

  public ordenes: OrderPayload[] = [];

  private stompClient: any;

  constructor() {
    this.initSocketConnection();
  }

  ngOnDestroy(): void {
    this.stompClient.disconnect();
  }

  ngOnInit(): void {
    this.joinRoom('bar');
  }

  initSocketConnection() {
    const url = '//localhost:8081/restaurante-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/restaurante-topic/${roomId}`, (message: any) => {
        const messageContent = JSON.parse(message.body) as OrderPayload;
        console.log(messageContent);
        this.ordenes.push(messageContent);
      })
    });
  }

  // sendMessage(roomId: string) {
  //   const mensj = {
  //     mensaje: this.miMensaje
  //   } as Orden;
  //   this.stompClient.send(`/app/restaurante/${roomId}`, {}, JSON.stringify(mensj));
  //   this.miMensaje = '';
  // }
}

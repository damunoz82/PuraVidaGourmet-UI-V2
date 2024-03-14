import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FormsModule } from '@angular/forms';
import { Orden } from '../../interfaces/orden';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit{

  private stompClient: any;

  public mensajes: string[] = [];
  public miMensaje: string = '';

  constructor() {
    this.initSocketConnection();
  }

  ngOnInit(): void {
    this.joinRoom('test');
  }

  initSocketConnection() {
    const url = '//localhost:8080/ordenes-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/cocina-topic/${roomId}`, (message: any) => {
        const messageContent = JSON.parse(message.body) as Orden;
        console.log(messageContent);
        this.mensajes.push(messageContent.mensaje);
      })
    });
  }

  sendMessage(roomId: string) {
    const mensj = {
      mensaje: this.miMensaje
    } as Orden;
    this.stompClient.send(`/app/cocina/${roomId}`, {}, JSON.stringify(mensj));
    this.miMensaje = '';
  }

}

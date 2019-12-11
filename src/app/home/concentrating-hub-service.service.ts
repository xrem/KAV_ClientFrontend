import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { HubMessage } from '@app/models/HubMessage';

@Injectable({
  providedIn: 'root'
})
export class ConcentratingHubServiceService {
  public readonly lastEvent: BehaviorSubject<HubMessage> = new BehaviorSubject<HubMessage>(null);
  public readonly connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly socket: Socket) {
    socket.on('connect', () => {
      this.connected.next(true);
    });
    socket.on('disconnect', () => {
      this.connected.next(false);
      this.lastEvent.next(null);
    });
    this.connected.subscribe(s => {
      if (s) {
        socket.on('event', (e: object) => {
          this.lastEvent.next(new HubMessage(e));
        });
      }
    });
  }
}

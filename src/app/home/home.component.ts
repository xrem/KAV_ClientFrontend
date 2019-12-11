import { AfterContentInit, Component } from '@angular/core';
import { ConcentratingHubServiceService } from '@app/home/concentrating-hub-service.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterContentInit {
  status: string;
  terminalStatus: string;
  freezerStatus: string;
  isEstablishingConnection = true;
  connectedAtLeastOnce = false;

  constructor(private readonly hub: ConcentratingHubServiceService) {
    this.freezerStatus = 'Нет данных';
    this.terminalStatus = 'Нет данных';
  }

  ngAfterContentInit(): void {
    this.hub.connected.pipe(first(x => x === true)).subscribe(() => (this.connectedAtLeastOnce = true));
    this.hub.connected.subscribe(state => (this.isEstablishingConnection = !state));
    this.hub.lastEvent.subscribe(event => {
      if (event) {
        if (event.data.terminal) {
          this.terminalStatus = event.data.terminal.status || 'Нет данных';
        }
        if (event.data.freezer) {
          this.freezerStatus = event.data.freezer.status || 'Нет данных';
        }
        this.status = `[${dateToTimeString(event.timestamp)}]`;
      } else {
        this.status = 'Ожидание...';
      }
    });
  }
}

function dateToTimeString(date: Date): string {
  return date.toLocaleString('ru', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
}

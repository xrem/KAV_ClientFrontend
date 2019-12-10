import { AfterContentInit, Component } from '@angular/core';
import { ConcentratingHubServiceService } from '@app/home/concentrating-hub-service.service';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterContentInit {
  status: string;
  isEstablishingConnection = true;
  connectedAtLeastOnce = false;

  constructor(private readonly hub: ConcentratingHubServiceService) {}

  ngAfterContentInit(): void {
    this.hub.connected.pipe(first(x => x === true)).subscribe(() => (this.connectedAtLeastOnce = true));
    this.hub.connected.subscribe(state => (this.isEstablishingConnection = !state));
    this.hub.lastEvent.subscribe(event => {
      if (event) {
        this.status = `[${dateToTimeString(event.timestamp)}] ${JSON.stringify(event.data)}`;
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

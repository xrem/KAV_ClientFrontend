import { AfterContentInit, Component } from '@angular/core';
import { ConcentratingHubServiceService } from '@app/home/concentrating-hub-service.service';
import { first } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageTypeEnum } from '@app/models/MessageTypeEnum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterContentInit {
  public status = 'Запуск...';
  terminalStatus: string;
  freezerStatus: string;
  screen: string = null;
  isEstablishingConnection = true;
  connectedAtLeastOnce = false;
  showWorkingSpinnerInStatus = true;
  holdingTimer: number = null;

  constructor(private readonly hub: ConcentratingHubServiceService) {
    this.freezerStatus = 'Нет данных';
    this.terminalStatus = 'Нет данных';

    of(this.isEstablishingConnection).subscribe(x => {
      this.showWorkingSpinnerInStatus = x;
    });
  }

  private get screenSrc(): string | undefined {
    if (this.screen) {
      return `/assets/${this.screen}.gif`;
    }
    return undefined;
  }

  private get showIntro(): boolean {
    return this.screen === null;
  }

  ngAfterContentInit(): void {
    this.hub.connected.pipe(first(x => x === true)).subscribe(() => (this.connectedAtLeastOnce = true));
    this.hub.connected.subscribe(state => (this.isEstablishingConnection = !state));
    this.hub.lastEvent.subscribe(hubEvent => {
      if (hubEvent) {
        const freezerSignal = hubEvent.type(hubEvent.data.freezer);
        const terminalSignal = hubEvent.type(hubEvent.data.terminal);
        const idle = freezerSignal === MessageTypeEnum.Idle && terminalSignal === MessageTypeEnum.Idle;
        this.showWorkingSpinnerInStatus = !idle;
        // if become idle
        if (idle && (this.screen !== null || this.status !== null)) {
          if (this.holdingTimer === null) {
            this.holdingTimer = window.setTimeout(() => {
              this.status = null;
              this.screen = null;
              this.holdingTimer = null;
            }, 8000);
          }
        }

        if (freezerSignal === MessageTypeEnum.ExtendedWait) {
          this.status = 'Операция может занять больше времени чем обычно, пожалуйста ожидайте...';
        }

        if (freezerSignal === MessageTypeEnum.Refund) {
          this.status = 'Отмена операции, будет произведён автоматический возврат средств...';
        }

        if (freezerSignal === MessageTypeEnum.WaitingCard) {
          this.screen = 'wait';
        }

        if (terminalSignal === MessageTypeEnum.Nop && freezerSignal === MessageTypeEnum.Nop && this.screen === 'wait') {
          this.screen = 'processing';
        }

        if (terminalSignal === MessageTypeEnum.Failed) {
          this.screen = 'failed';
        }

        if (terminalSignal === MessageTypeEnum.Success) {
          this.screen = 'success';
        }
      } else {
        if (this.connectedAtLeastOnce) {
          this.status = 'Пытаюсь решить проблему с установкой связи...';
        } else {
          this.status = 'Ожидание ответа от сервера...';
        }
        window.clearTimeout(this.holdingTimer);
        this.holdingTimer = null;
        this.screen = null;
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

import { MessageTypeEnum } from '@app/models/MessageTypeEnum';

export class HubMessage {
  public readonly timestamp: Date;
  constructor(public readonly data: any) {
    this.timestamp = new Date();
  }
  public type(data: any): number {
    if (data && data.type && typeof data.type === 'number') {
      const typeNumber = data.type as number;
      if (typeNumber >= 0 && typeNumber <= 7) {
        return typeNumber;
      }
    }
    return 0;
  }
}

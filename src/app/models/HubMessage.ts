export class HubMessage {
  public readonly timestamp: Date;
  constructor(public readonly data: any) {
    this.timestamp = new Date();
  }
}

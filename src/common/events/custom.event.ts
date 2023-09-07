export class CustomEvent {
  readonly eventName: string;
  readonly description: any;

  constructor(eventName: string, description: any) {
    this.eventName = eventName;
    this.description = description;
  }
}

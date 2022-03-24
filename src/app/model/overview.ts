export class Overview{
  public id!: number;
  public group: string;
  public topic: string;
  public grade: string;
  public advantages: string;
  public disadvantages: string;
  public date!: Date;

  constructor() {
    this.group = '';
    this.topic = '';
    this.grade = '';
    this.advantages = '';
    this.disadvantages = '';
  }
}

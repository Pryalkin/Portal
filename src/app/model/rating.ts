import {User} from "./user";

export class Rating{
  public id!: number;
  public rating: number;
  public user!: User;

  constructor() {
    this.rating = 0;
  }
}

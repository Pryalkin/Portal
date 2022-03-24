import {User} from "./user";

export class Comments{
  public id!: number;
  public comment!: string;
  public date!: Date;
  public user: User;

  constructor() {
    this.user = new User();
  }
}


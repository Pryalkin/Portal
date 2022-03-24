import {Overview} from "./overview";
import {Tags} from "./tags";
import {Images} from "./images";
import {User} from "./user";
import {Rating} from "./rating"
import {LikeAndDislike} from "./likeAndDislike";
import {Comments} from "./comments";

export class GeneralOverview{
  public id!: number;
  public overview: Overview;
  public tags: Tags[];
  public images: Images[];
  public user: User;
  public rating!: Rating[];
  public likeAndDislike: LikeAndDislike[];
  public comments: Comments[];

  constructor() {
    this.overview = new Overview();
    this.tags = new Array<Tags>();
    this.images = new Array<Images>();
    this.user = new User();
    this.likeAndDislike = new Array<LikeAndDislike>();
    this.comments = new Array<Comments>();
  }
}

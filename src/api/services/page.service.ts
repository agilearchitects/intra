import { PageEntity } from "../entities/page.entity";

export class PageService {
  public constructor(
    private readonly pageEntity: PageEntity,
  ) { }

  public async page(pageId: number, withChildren: true | number = 0) {
    if (withChildren === true) { withChildren = 1; }


  }

  public async pages(parentId: number) {

  }
}

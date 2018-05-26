import { LokkrPage } from './app.po';

describe('lokkr App', () => {
  let page: LokkrPage;

  beforeEach(() => {
    page = new LokkrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

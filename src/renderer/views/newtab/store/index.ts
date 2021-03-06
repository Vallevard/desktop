import { observable, computed } from 'mobx';
import { ISettings, ITheme, IVisitedItem } from '~/interfaces';
import { getTheme } from '~/utils/themes';
import { requestURL } from '~/utils/network';
// import { INewsItem } from '~/interfaces/news-item';

export class Store {
  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  // @observable
  // public news: INewsItem[] = [];

  @observable
  public image = '';

  @observable
  private _imageVisible = true;

  public set imageVisible(value: boolean) {
    this._imageVisible = value;
    if (value && this.image == '') this.loadImage();
  }

  @computed
  public get imageVisible() {
    return this._imageVisible;
  }

  @observable
  public changeImageDaily = true;

  @observable
  public topSitesVisible = true;

  @observable
  public quickMenuVisible = true;

  @observable
  public overflowVisible = false;

  @observable
  private _preferencesContent: 'main' | 'custom' = 'main';

  public set preferencesContent(value: 'main' | 'custom') {
    this._preferencesContent = value;
    this.overflowVisible = false;
  }

  @computed
  public get preferencesContent() {
    return this._preferencesContent;
  }

  @observable
  private _dashboardSettingsVisible = false;

  public set dashboardSettingsVisible(value: boolean) {
    this._dashboardSettingsVisible = value;

    if (!value) {
      this.preferencesContent = 'main';
    }
  }

  @computed
  public get dashboardSettingsVisible() {
    return this._dashboardSettingsVisible;
  }

  private page = 1;
  private loaded = true;

  @observable
  public topSites: IVisitedItem[] = [];

  public constructor() {
    (window as any).updateSettings = (settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    };

    if (this.imageVisible) {
      this.loadImage();
    }

    this.loadTopSites();
    // this.loadNews();

    // window.onscroll = () => {
    //   this.updateNews();
    // };

    // window.onresize = () => {
    //   this.updateNews();
    // };
  }

  public async loadImage() {
    let url = localStorage.getItem('imageURL');
    let isNewUrl = true;

    if (this.changeImageDaily) {
      const dateString = localStorage.getItem('imageDate');

      if (dateString && dateString !== '') {
        const date = new Date(dateString);
        const date2 = new Date();
        const diffTime = Math.floor(
          (date2.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffTime > 1) {
          url = '';
          isNewUrl = false;
        }
      }
    }

    if (!url || url == '') {
      url = 'https://picsum.photos/1920/1080';
    }

    fetch(url)
      .then(response => Promise.all([response.url, response.blob()]))
      .then(([resource, blob]) => {
        this.image = URL.createObjectURL(blob);

        return resource;
      })
      .then(imgUrl => {
        if (isNewUrl) {
          localStorage.setItem('imageURL', imgUrl);
          localStorage.setItem('imageDate', new Date().toString());
        }
      })
      .catch(e => console.error(e));
  }

  // public async updateNews() {
  //   const scrollPos = window.scrollY;
  //   const scrollMax =
  //     document.body.scrollHeight - document.body.clientHeight - 768;

  //   if (scrollPos >= scrollMax && this.loaded && this.page !== 10) {
  //     this.page++;
  //     this.loaded = false;
  //     try {
  //       await this.loadNews();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //     this.loaded = true;
  //   }
  // }

  // public async loadNews() {
  //   try {
  //     const { data } = await requestURL('http://80.211.255.51:7000/news'); // ?lang=
  //     const json = JSON.parse(data);

  //     if (json.articles) {
  //       this.news = this.news.concat(json.articles);
  //     } else {
  //       throw new Error('Error fetching news');
  //     }
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  public async loadTopSites() {
    this.topSites = await (window as any).getTopSites(8);
  }
}

export default new Store();

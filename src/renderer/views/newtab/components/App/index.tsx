import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Wrapper, Content, IconItem, Menu, Image, RightBar } from './style';
import { TopSites } from '../TopSites';
import { icons } from '~/renderer/constants';
// import { News } from '../News';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import { Preferences } from '../Preferences';

const GlobalStyle = createGlobalStyle`${Style}`;

window.addEventListener('mousedown', () => {
  store.dashboardSettingsVisible = false;
});

const onIconClick = (name: string) => () => {
  window.location.href = `${WEBUI_BASE_URL}${name}${WEBUI_URL_SUFFIX}`;
};

const onTuneClick = () => {
  store.dashboardSettingsVisible = !store.dashboardSettingsVisible;
};

const onRefreshClick = () => {
  store.image = '';
  setTimeout(() => {
    localStorage.setItem('imageDate', '');
    store.loadImage();
  }, 50);
};

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <div>
          <GlobalStyle />

          <Preferences />

          <Menu>
            <IconItem
              title="Settings"
              icon={icons.settings}
              onClick={onIconClick('settings')}
            ></IconItem>
            <IconItem
              title="History"
              icon={icons.history}
              onClick={onIconClick('history')}
            ></IconItem>
            <IconItem
              title="Bookmarks"
              icon={icons.bookmarks}
              onClick={onIconClick('bookmarks')}
            ></IconItem>
            <IconItem
              title="Downloads"
              icon={icons.download}
              onClick={onIconClick('downloads')}
            ></IconItem>
            {/* <IconItem
                title="Extensions"
                icon={icons.extensions}
                onClick={onIconClick('extensions')}
              ></IconItem> */}
          </Menu>

          <Refresh icon={icons.refresh} onClick={onRefreshClick}></Refresh>
          </Wrapper>
        {/* <Content>
            <News></News>
          </Content> */}
        </div>
      </ThemeProvider >
    );
  }),
);

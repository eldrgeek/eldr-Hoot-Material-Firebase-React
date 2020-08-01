import Main from './js/components/Main';
import { CurrentModule } from './js/CurrentModule';
import './css/index.css';
import './css/tailwind.css';

if (module.hot) {
  module.hot.accept(['./js/app', './js/components/FrontPage'], () => {
    CurrentModule(Main);
  });
}
CurrentModule(Main);

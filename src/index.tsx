import FrontPage from './js/components/FrontPage';
import { CurrentModule } from './js/CurrentModule';
import './css/index.css';
import './css/tailwind.css';

if (module.hot) {
  module.hot.accept(['./js/app', './js/components/FrontPage'], () => {
    CurrentModule(FrontPage);
  });
}
CurrentModule(FrontPage);

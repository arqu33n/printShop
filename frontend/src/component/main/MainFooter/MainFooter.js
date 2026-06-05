import './MainFooter.css'
import vkLogo from '@images/icons/vk-logo.png'

export const MainFooter = {
  name: 'MainFooter',

  data() {
    return {
      vkLogo,
    }
  },

  template: `
      <footer class="footer">
        <div class="footer__vk">
          <a href="http://vk.com/3dprintantonled" target="_blank">
            <img :src="vkLogo">
          </a>
        </div>
        <div class="footer__contacts" id="contacts">
          <h3>Контакты</h3>
          <ul style="list-style: none;">
            <li class="vk_id">vk_id: @tonledovsk</li>
            <li class="tg_id">tg_id: @tonledov</li>
          </ul>
        </div>
      </footer>
	`,
}

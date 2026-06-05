import '@css/reset.css'
import '@css/styles.css'
import {MainHeader} from "@component/main/MainHeader/MainHeader.js";
import {MainFooter} from "@component/main/MainFooter/MainFooter.js";

export const ShopLayout = {
  name: 'ShopLayout',

	components: {
		MainHeader,
		MainFooter
	},


  template: `
         <div class="wrap">
		   <MainHeader/>
			<main class="main"><slot></slot></main>
		   <MainFooter/>
		</div>
    `,
}

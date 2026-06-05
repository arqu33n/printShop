import './NotFound.css'
import notFound from "@images/not-found.png"

import { defineComponent } from 'vue'


export default defineComponent ({
	name: 'NotFound',

	data() {
		return {
			notFound
		}
	},

	template:`
		<router-link to="/" class="not-found">
			<img :src="notFound" class="not-found__img">
<!--		  	<div class="error__to-main">На главную</div>-->
		</router-link>
	`
})
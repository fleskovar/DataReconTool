import Vue from 'vue'
import './plugins/vuetify'
import {store} from './store'


import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {Canvas} from  '../src/js/Canvas'
import router from './router'


Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
library.add(fas) // Include needed icons.

Vue.use({
	iconfont: 'faSvg',
	icons:{
		'save': 'far fa-book fa-3x',
		'pfd': 'far fa-drafting-compass fa-3x'
	}
  });

Vue.config.productionTip = false

window.graph = null;

var app = new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');

window.onload = function(e){    
	
	var container = document.getElementById('canvas');
  	//main(container);

	var c = new Canvas(container);
	app.$store.commit('setCanvas', c);
	
	//c.AddNode(2, 2);
	//c.AddNode(2, 2);
	//c.AddNode(1, 0);
	//c.AddNode(0, 1);
	
}
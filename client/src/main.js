import Vue from 'vue'
import './plugins/vuetify'
import {store} from './store'


import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft,
		 faArrowRight,
		 faSearchMinus,
		 faSearchPlus,
		 faCaretLeft,
		 faCaretRight,
		 faPlus,
		 faTrash } from '@fortawesome/free-solid-svg-icons'
import {Canvas} from  '../src/js/Canvas'
import router from './router'

import Ace from 'ace-builds/src-noconflict/ace'
//import VueBus from 'vue-bus'


Vue.component('font-awesome-icon', FontAwesomeIcon); // Register component globally
library.add(fas);// Include needed icons.
library.add( faArrowLeft,
			 faArrowRight,
			 faSearchMinus,
			 faSearchPlus,
			 faCaretLeft,
			 faCaretRight,
			 faPlus,
			 faTrash);

Vue.use({
	iconfont: 'faSvg',	
  });
Vue.use(Ace);
//Vue.use(VueBus);

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

	var canvas = new Canvas(container, app.$store);
	app.$store.commit('setCanvas', canvas);
		
	//c.AddNode(2, 2);
	//c.AddNode(2, 2);
	//c.AddNode(1, 0);
	//c.AddNode(0, 1);
	
}
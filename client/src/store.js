import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    canvas: null,
    document_name: 'Untitled'

  },
  mutations: {
    setCanvas(state, canvas){
      state.canvas = canvas;
    },
    setDocumentName(state, name){
      state.document_name = name;
    }
  },
  actions: {
    AddNode(context, payload)
    {
      context.state.canvas.AddNode(payload.n_in, payload.n_out);
    }
  }
});

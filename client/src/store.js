import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    canvas: null,
    document_name: 'Untitled',
    selected_element: null,
    selected_element_type: null
  },
  mutations:
  {
    setCanvas(state, canvas)
    {
      state.canvas = canvas;
    },
    setDocumentName(state, name)
    {
      state.document_name = name;
    },
    setSelectedElement(state, el, el_type)
    {      
      state.selected_element=el;
      state.selected_element_type=el_type;
    }
  },
  actions:
  {
    AddNode(context, payload)
    {
      context.state.canvas.AddNode(payload.n_in, payload.n_out);
    }
  }
});

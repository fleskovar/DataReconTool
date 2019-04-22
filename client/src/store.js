import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    canvas: null,
    document_name: 'Untitled',
    selected_element: null,
    selected_element_type: null,
    data_input_column_names: [],
    data_input_columns: [],
    stream_labels: []
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
    },
    appendColumnInputNames(state, column_name)
    {
      state.data_input_column_names.push(column_name);
    },
    removeColumnInputNames(state, index)
    {
      state.data_input_column_names.splice(index, 1);
    },

    setColumnInputs(state, columns)
    {
      state.data_input_columns = columns;
    }
  },
  actions:
  {
    AddNode(context, payload)
    {
      context.state.canvas.AddNode(payload.n_in, payload.n_out);
    },

    AddColumnInput(context, column_name)
    {
      var index = context.state.data_input_column_names.indexOf(column_name);
      if(index == -1){
        //Checks if column name is not repeated
        context.commit("appendColumnInputNames", column_name);
        context.dispatch("UpdateInputDataColumns");
      }
    },

    RemoveColumnInput(context, column_name)
    {
      var index = context.state.data_input_column_names.indexOf(column_name);
      if(index != -1){
        //Checks if column name is registered
        context.commit("removeColumnInputNames", index);
        context.dispatch("UpdateInputDataColumns");
      }
    },

    UpdateInputDataColumns(context)
    {
      var data_columns = [];
      for(var i=0; i < context.state.data_input_column_names.length; i++)
      {
        var col = {};
        col.text = context.state.data_input_column_names[i];
        col.name = context.state.data_input_column_names[i];
        col.sortable = false;
        col.align = 'left';
        data_columns.push(col);
      }
      context.commit("setColumnInputs", data_columns);
    }
  }
});

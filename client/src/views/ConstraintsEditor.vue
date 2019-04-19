<template>
    <div>
      <v-card flat>
      <v-layout justify-end>
        <v-btn color="green" dark v-on:click='dialog_add = true'>Save Constraints</v-btn>
      </v-layout>
      </v-card>

      
      <editor editor-id="editorA" :content="contentA" v-on:change-content="changeContentA"/>
      
  </div>
</template>

<script>

  import Editor from '../components/Editor.vue'

  export default {    
    data () {
      return {
        contentA: '#Define a constraint as an arbitrary python function\n\n#def f(vars):\n#\tratio = vars["A"]/vars["B"]\n#\treturn ratio',
        contentB: 'default content for Editor B'
      }
    },
    components: {
      Editor
    },
    methods: {
      reset () {
        this.contentA = 'reset content for Editor A'
        this.contentB = 'reset content for Editor B'
      },
      changeContentA (val) {
        if (this.contentA !== val) {
          this.contentA = val
        }
      },
      changeContentB (val) {
        if (this.contentB !== val) {
          this.contentB = val
        }
      }
    }
  }
</script>

<style>

</style>
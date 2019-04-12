<template>
    <div :id="editorId" style="width: 100%; height: 100%;"/>
</template>


<script>

  export default {     
    props: ['editorId', 'content', 'python', 'theme'],
    data () {
        return {
        editor: Object,
        beforeContent: ''
        }
    },
    watch: {
        'content' (value) {
            if (this.beforeContent !== value) {
            this.editor.setValue(value, 1)
        }
        }
    },
    mounted () {
        var theme_github = require('ace-builds/src-noconflict/theme-xcode');
        var python_mode = require('ace-builds/src-noconflict/mode-python').Mode;
        const lang = this.lang || 'python'
        const theme = this.theme || 'github'
    
        this.editor = window.ace.edit(this.editorId)
        this.editor.setValue(this.content, 1)
        
        // mode-xxx.js or theme-xxx.jsがある場合のみ有効
        this.editor.getSession().setMode(new python_mode())
        this.editor.setTheme(theme_github)

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue()
        this.$emit('change-content', this.editor.getValue())
        })
    }
  }
</script>
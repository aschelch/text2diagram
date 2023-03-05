mermaid.initialize({ startOnLoad: true });

document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        generating: false,
        text:'a class diagram of "Paul" and is child "Tom"',
        messages: [],

        generate(){
            const input = this.text
            this.text=''
            this.messages.push({role:'user', content:input})
            this.generating = true;
            fetch('/generate', {
                method:'POST', 
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(this.messages)
            })
            .then(r => r.json())
            .then(r => {
                this.messages.push({role:'assistant', content:r})
                this.generating = false;
            })
            .catch(() => {
                this.generating = false;
            });
        }
    }))
})


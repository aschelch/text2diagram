mermaid.initialize({ startOnLoad: true });

document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        generating: false,
        text:'',
        messages: [],
        init(){
            this.$watch('messages', () => {
                this.$refs.mermaid.removeAttribute('data-processed')
                mermaid.init(undefined, this.$refs.mermaid)
                this.scrollBottom()
            })

            const examples = [
                'a class diagram of "Paul" and his child "Tom"',
                'a state diagram of a coffee machine',
                'a sequence diagram of Alice and Bob joking about developers',
                'a gannt diagram of my new project "My awesome project", with 3 tasks (Spec, Dev, test) starting on 1st of April',
            ]
            this.text = examples[Math.floor(Math.random() * examples.length)]

        },
        scrollBottom(){
            this.$refs.discussion.scrollTop = this.$refs.discussion.scrollHeight;
        },
        generate(){
            const input = this.text
            if(input == ''){return;}
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
                this.messages.push({role:'error', content:'All free credits has been used for today. Please try again tomorrow 😉'})
                this.generating = false;
            });
        }
    }))
})


class CopyButtonPlugin{
    constructor(options={}){
        this.hook=options.hook;
        this.callback=options.callback
    }
    "after:highlightElement"({el,text}){
        let button=Object.assign(document.createElement("button"),{
            innerHTML: "<span class='material-icons-round'>content_copy</span>",
            className:"hljs-copy-button"
        });
        button.dataset.copied=false;
        el.parentElement.classList.add("hljs-copy-wrapper");
        el.parentElement.appendChild(button);
        button.onclick=() => {
            let newText=text;
            if(this.hook && typeof this.hook==="function"){
                newText=this.hook(text,el)||text
            }
            this.copyToClipboard(newText).then(() => {
                button.innerHTML="<span class='material-icons-round'>file_copy</span>";
                button.dataset.copied=true;
                setTimeout(()=>{
                    button.innerHTML="<span class='material-icons-round'>content_copy</span>";
                    button.dataset.copied=false;
                    alert=null
                },2e3)
            }).then(()=>{
                if(typeof this.callback==="function") return this.callback(newText,el)
            })
        }
    }

    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            let textarea = document.createElement('textarea');
            textarea.textContent = text;
            document.body.appendChild(textarea);

            textarea.select();
            try {
                document.execCommand('copy');
                resolve();
            } catch (ex) {
                reject(ex);
            } finally {
                document.body.removeChild(textarea);
            }
        });
    }
}




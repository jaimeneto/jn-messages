/*!
 * JnMessages v1.0.0 (https://github.com/jaimeneto/jn-messages)
 * Copyright 2019 Jaime Neto <jaimeneto.com>
 * Licensed under MIT (https://github.com/jaimeneto/jn-messages/master/LICENSE)
 */

/**
 * msgBox = new JnMessageBox('#messages');
 * msgBox = new JnMessageBox(document.selectQuery('#messages')),
 * msgBox = new JnMessageBox({
 *      wrapper: '#messages', 
 *      type: 'corner',
 *      closable: true, 
 *      counter: true,
 *      timeout: 10,
 *      max: 5
 * });
 */
class JnMessageBox {

    constructor(options) {
        this._setOptions(options);
    }

    _setOptions(options) {
        if (typeof options === 'string') {
            options = { wrapper: options }
        }

        if ('closable' in options) {
            this.setClosable(options.closable);
        }
        if ('counter' in options) {
            this.setCounter(options.counter);
        }
        if ('type' in options) {
            this.setType(options.type);
        }
        if ('timeout' in options) {
            this.setTimeout(options.timeout);
        }
        if ('max' in options) {
            this.setMax(options.max);
        }
        if ('wrapper' in options) {
            this._setWrapper(options.wrapper);
        }
    }

    _setWrapper(wrapper) {
        if (typeof wrapper === 'string') {
            this.wrapper = document.querySelector(wrapper);
        }

        // captura o estilo atual do bloco de mensagens
        const wrapperDisplay = window.getComputedStyle(this.wrapper).display;
        this.display = wrapperDisplay ? wrapperDisplay : 'block';

        // Define as classes CSS do bloco de mensagens
        this.wrapper.classList.add('messages');
        
        this.wrapper.classList.remove('floating');
        this.wrapper.classList.remove('corner');

        if (this.type) {
            this.wrapper.classList.add(this.type);
        }

        // oculta o bloco de mensagens, por padrão
        this.wrapper.style.display = 'none';
        this.wrapper.style.opacity = 0;
    }

    /**
     * Quando não tiver mais nenhuma mensagem, faz um fadeOut
     */
    _createFadingOut() {
        const mutationObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target.querySelectorAll('.message').length === 0) {
                    mutation.target.style.opacity = 0;
                    setTimeout(() => mutation.target.style.display = 'none', 500);
                }
            });
        });
        mutationObserver.observe(this.wrapper, { childList: true });
    }

    _hideToMax() {
        const messages = this.wrapper.querySelectorAll('.message');
        if (this.max && messages.length >= this.max) {
            messages.forEach((msg, index) => index <= messages.length - this.max
                && msg.classList.add('hidden'));
        }
    }

    _handleCounter(text, type)
    {
        if (this.counter === undefined) {
            return true;
        }

        const messages = this.wrapper.querySelectorAll('.message');
        var isNewMessage = true;

        if (messages.length > 0) {
            messages.forEach(function(msg){
                if (msg.classList.contains(type) &&
                    msg.querySelector('.text').innerHTML === text
                ) {
                    var counter = msg.querySelector('.counter');
                    if (counter === null) {
                        counter = document.createElement('div');
                        counter.classList.add('counter');
                        counter.innerText = '1';
                        msg.append(counter);
                    }
                    counter.innerText = parseInt(counter.innerText) + 1;
                    isNewMessage = false;
                }
            });
        }

        // Retorna true não tiver nenhuma mensagem, 
        // ou for uma mensagem diferente da última
        return isNewMessage;
    }

    show(text, type = 'alert') {

        // cria a nova mensagem
        const message = new JnMessage({
            text: text,
            type: type,
            closable: this.closable,
            timeout: this.timeout
        });

        var isNewMessage = this._handleCounter(text, type);

        if (isNewMessage) {
            this._createFadingOut();

            // Se tiver definido um número máximo de mensagens e o bloco de mensagens
            // ja tiver alcançado esse máximo exclui o excedente
            this._hideToMax();

            // Insere a nova mensagem no bloco de mensagens
            message.appendTo(this.wrapper);
    
            // Exibe o bloco de mensagens
            this.wrapper.style.display = this.display;
            this.wrapper.style.opacity = 1;
        }
    }
    
    setType(type) {
        this.type = '';
        if (type === 'floating' || type === 'corner') {
            this.type = type;
        }
    }

    alert(text) {
        this.show(text, 'alert');
    }

    success(text) {
        this.show(text, 'success');
    }

    error(text) {
        this.show(text, 'error');
    }

    info(text) {
        this.show(text, 'info');
    }

    setClosable(boolean) {
        this.closable = boolean;
    }
    
    setCounter(boolean) {
        this.counter = boolean;
    }

    setTimeout(seconds) {
        this.timeout = seconds;
    }

    setMax(number) {
        this.max = number;
    }

    hideAll() {
        const messages = this.wrapper.querySelectorAll('.message');
        messages.forEach((message) => message.classList.add('hidden'));
    }
}

/**
 * msg = new JnMessage('This is a message');
 * msg.appendTo('#messages');
 * msg.appendTo(document.querySelector('#messages'));
 * msg = new JnMessage({text:'This is a message', type:'success', closable:true, timeout:10, wrapper:'#messages'});
 */
class JnMessage {
    constructor(options) {
        this._setOptions(options);
    }

    _setOptions(options) {

        if (typeof options === 'string') {
            options = { text: options }
        }

        if ('text' in options) {
            this.setText(options.text);
        }
        if ('closable' in options) {
            this.setClosable(options.closable);
        }
        if ('timeout' in options) {
            this.setTimeout(options.timeout);
        }

        if (!('type' in options)) {
            options.type = 'alert';
        }
        this.setType(options.type);

        if ('wrapper' in options) {
            this.appendTo(options.wrapper);
        }
    }

    _render() {
        this.element = document.createElement('div');
        this.element.classList.add('message');
        this.element.classList.add(this.type);

        if (this.closable) {
            this.element.classList.add('closable');
        }

        this._createText();
        this.hide();  // Cria o element oculto pra fazer o fadein

        this._createFading();
        this._createCloseButton();
        this._fadeIn();

        return this.element;
    }

    _createFading() {
        this.element.addEventListener('transitionend', (e) => {
            if (this.isHidden() && e.propertyName === 'opacity') {
                // exclui a mensagem após ocultá-la
                e.target.remove();
            }
        });
    }

    _createText() {
        const text = document.createElement('div');
        text.insertAdjacentHTML('beforeend', this.text);
        text.classList.add('text');
        this.element.prepend(text);
    }

    _createCloseButton() {
        if (this.closable) {
            const closeButton = document.createElement('a');
            closeButton.href = '#';
            closeButton.insertAdjacentHTML('beforeend', '×');
            closeButton.classList.add('close-btn');

            closeButton.addEventListener('click', (e) => {
                e.preventDefault;
                this.hide();
            });

            this.element.prepend(closeButton);
        }
    }

    _initTimeout() {
        if (this.timeout) {
            // cria uma barra de tempo que cresce até atingir o tamanho máximo da mensagam,
            // indicando se a mensagem está perto de sumir
            const timebar = document.createElement('div');
            timebar.classList.add('timebar');
            timebar.style.width = 0;
            timebar.style.transition = `width ${this.timeout/1000}s linear`;

            this.element.append(timebar);

            setTimeout(() => timebar.style.width = '100%', 10);

            // oculta a mensagem ao fim do tempo determinado
            setTimeout(() => this.hide(), this.timeout);
        }
    }

    _fadeIn() {
        setTimeout(() => {
            this.element.classList.remove('hidden')
            this._initTimeout();
        }, 100);
    }

    appendTo(wrapper) {
        if (typeof wrapper === 'string') {
            wrapper = document.querySelector(wrapper);
        }

        wrapper.append(this._render());
    }

    isHidden() {
        return this.element.classList.contains('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    setText(text) {
        this.text = text;
    }

    setType(type) {
        this.type = type;
    }

    setClosable(boolean) {
        this.closable = boolean;
    }

    setTimeout(seconds) {
        this.timeout = seconds * 1000;
    }

    getText(text) {
        return this.text;
    }

    getType(type) {
        return this.type;
    }
}

/**
 * const fixedMsgs = new JnFixedMessages({
 *      wrapper: '#defaultMsgs', 
 *      closable: true, 
 *      fixedMessages: {
 *          "MSA-001": "This is a <u>fixed</u> <b>alert</b> message!",
 *          "MSS-001": "This is a <u>fixed</u> <b>success</b> message!",
 *          "MSE-001": "This is a <u>fixed</u> <b>error</b> message!",
 *          "MSI-001": "This is a <u>fixed</u> <b>info</b> message!"
 *      }
 * });
 * 
 * fixedMsgs.alert("MSA-001");
 * fixedMsgs.success("MSS-001");
 * fixedMsgs.error("MSE-001");
 * fixedMsgs.info("MSI-001");
 * fixedMsgs.info("INVALID");   // shows: Invalid message code: INVALID
 */
class JnFixedMessages extends JnMessageBox {

    constructor(options) {
        super(options);
        
        JnFixedMessages.fixedMessages = {};
        if ('fixedMessages' in options) {
            JnFixedMessages.fixedMessages = options.fixedMessages;
        }
    }

    // static load(url) {
    //     console.log(url);
    //     const request = async() => {
    //         const response = await fetch(url);
    //         const data = await response.json();
    //         this._fixedMessages = data;
    //     };
    //     request();
    // }

    static set fixedMessages(msgs) {
        this._fixedMessages = msgs;
    }
    
    static get fixedMessages() {
        return this._fixedMessages;
    }

    static exists(code)
    {
        return JnFixedMessages.fixedMessages[code] !== undefined;
    }

    static getFixedMessage(code) {
        if (!JnFixedMessages.exists(code)) {
            return 'Invalid message code: ' + code;
        }

        return JnFixedMessages.fixedMessages[code];
    }

    custom(text, type = 'alert') {
        super.show(text, type);
    }

    show(code, type) {
        if (!JnFixedMessages.exists(code)) {
            type = 'debug';
        }

        super.show(JnFixedMessages.getFixedMessage(code), type);
    }

}
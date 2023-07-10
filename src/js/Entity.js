import requestServer from './api/createRequest.js';
import Modal from './api/Modal.js';
import Chat from './api/Chat.js';

export default class Entity {
  constructor(element) {
    this.parent = element;
    this.chat = null;
    this.modal = new Modal();
  }

  init() {
    this.get();
    this.create();
    this.registerEvent();
  }

  get() {
    const headerChat = document.createElement('h2');
    headerChat.textContent = 'Чат';
    this.parent.append(headerChat);
    const chatEl = document.createElement('div');
    chatEl.className = 'container';
    this.chat = new Chat(chatEl);
    this.parent.append(this.chat.container);
    document.body.append(this.modal.elem);
  }

  create() {
    const id = setInterval(() => {
      requestServer({ url: '', method: 'GET' }, async (response) => {
        const result = await response;
        if (response.status) {
          const msg = this.modal.elem.querySelector('.msg-server');
          msg.textContent = 'Сервер запущен';
          msg.style.color = 'green';
          this.modal.elem.querySelector('.submit').disabled = false;
          clearInterval(id);
        } else {
          if (result instanceof TypeError) {
            console.log('ждите');
          }
        }
      });
    }, 2000);
  }

  registerEvent() {
    this.modal.addListenerSubmit(this.onSubmitForm.bind(this));
  }

  onSubmitForm() {
    const str = this.modal.form.nickname.value.trim();
    if (str.length > 2) {
      const options = {
        url: '/users/entry',
        method: 'POST',
        body: JSON.stringify({ name: str }),
      };
      requestServer(options, async (response) => {
        const result = await response;
        if (result.status === 'find') {
          this.modal.form.append(this.modal.tooltip);
          this.modal.tooltip.classList.remove('hidden')
          setTimeout(() => {
            this.modal.tooltip.remove();
          }, 4000);
        } else if (result.status === 'ok') {
          this.modal.form.reset();
          this.modal.elem.remove();
          this.chat.youName = result.name;
          this.chat.openChat();
        } else {
          console.log(result);
        }
      });
    }
  }
}
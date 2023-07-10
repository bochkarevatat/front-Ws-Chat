import Users from './Users.js';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.users = new Users();
    this.chatMessagesContainer = null;
    this.youName = null; 
    this.connectId = null;
    this.init();
  }

  init() {
    this.bindToDOM()
  }

  static get markup() {
    return `
      <div class='user'></div>
      <div class='chat__area'>
        <div class='chat__messages-container'>
        <div class="messageAll"></div>
        </div>
        <div class='chat__messages-input'>
          <form class='form__group'>
            <input 
              class='form__input' type="text" name="report"
              placeholder='Type your message here...' 
              required>
          </form>
        </div>
    </div>
`
  }
  static get chatArea() {
    return '.chat__area';
  }
  static get user() {
    return '.user';
  }
  static get chatMessagesContainer() {
    return '.chat__messages-container';
  }
  static get formInput() {
    return '.form__input';
  }
  static get formGroup() {
    return '.form__group';
  }
  static get message() {
    return '.messageAll';
  }
  message
  bindToDOM() {
    this.container.innerHTML = Chat.markup;
    this.chatArea = this.container.querySelector(Chat.chatArea);
    this.user = this.container.querySelector(Chat.user);
    this.user.append(this.users.elem);
    this.chatMessagesContainer = this.container.querySelector(Chat.chatMessagesContainer);
    this.formInput = this.container.querySelector(Chat.formInput);
    this.formGroup = this.container.querySelector(Chat.formGroup);
    this.message = this.container.querySelector(Chat.message);
    
  }

  addMessage(report) {
    const name = report.user === this.youName ? 'You' : report.user;
    const date = new Date().toLocaleString();
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    if (name === 'You') {
      messageEl.classList.add('you');
    }
    messageEl.insertAdjacentHTML(
      'beforeend',
      `<div class="message-header">
      <div class="message-header_name">${name}</div>
      <div class="message-header_time">${date.replace(',', '')}</div>
      </div>
      <div class="message-text">${report.text}</div>`
    );
    this.chatMessagesContainer.append(messageEl);
    //
  }

  openChat() {
    const ws = new WebSocket('wss://my-first-proect.onrender.com');
    
    this.formGroup.addEventListener('submit', (e) => {
      e.preventDefault();
      // удалить пробельные символы
      const message = this.formInput.value.trim();
      
      if (!message) return;
      
      ws.send(JSON.stringify({ message: { date: Date.now(), text: message } }));
      console.log(message)
      this.formInput.value = '';
    });

    ws.addEventListener('open', () => {
      console.log('ws open')
      ws.send(JSON.stringify({ name: this.youName }));
    });

    
    ws.addEventListener('message', (e) => {

      const data = JSON.parse(e.data);
      console.log(data);

      if (data.joining) {
        this.connectId = data.joining;
      }

      if (data.online) {
        const allUsers = [];
        data.online.forEach((item) => {
          if (item.id === this.connectId) {
            allUsers.push('You');
          } else {
            allUsers.push(item.name);
          }
        });
        this.users.renderUsers(allUsers);
      }

      if (data.loadMsg) {
        data.loadMsg.forEach((item) => this.addMessage(item));
      }

      if (data.message) {
        this.addMessage(data.message);
      }
    });

    ws.addEventListener('close', (e) => {
      console.log(e);
      console.log('ws close');
    });

    ws.addEventListener('error', (e) => {
      console.log(e);
      console.log('ws error');
    });

  }
}
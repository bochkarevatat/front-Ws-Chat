export default class Modal {
  constructor() {
    
    this.elem = null;
    this.tooltipEl = null;
    this.formEl = null;
    this.eventSubmit = null;
    this.bindToDOM();
    this.onSubmitForm = this.onSubmitForm.bind(this)
    // this.createEl();
  }

  static get markup() {
    return `
    <div class='modal__form'>
    <form class="form">
    <h3>Выберите псевдоним</h3>
    <div class="tooltip hidden"></div>
    <input type="text" class="nickname" name="nickname">
    <button type="submit" class="submit" disabled>Продолжить</button>
  </form>
  <div class="msg-server">Ждите...</div>
  </div>
        `;
  }

  static get modalForm() {
    return '.modal__form';
  }
  static get form() {
    return '.form';
  }
  static get tooltip() {
    return '.tooltip';
  }

  bindToDOM() {
    this.elem = document.createElement('div');
    this.elem.className = 'modal';
    this.elem.innerHTML = Modal.markup;
    this.modalForm = this.elem.querySelector(Modal.modalForm);
    this.tooltip = this.elem.querySelector(Modal.tooltip);
    this.tooltip.textContent = 'Такой ник уже существует';
    this.form = this.elem.querySelector(Modal.form);
    this.form.addEventListener('submit', this.onSubmitForm.bind(this));
  }

  addListenerSubmit(callback) {
    this.eventSubmit = callback;
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.eventSubmit.call(null);
  }
}
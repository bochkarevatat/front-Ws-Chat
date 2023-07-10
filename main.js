(()=>{"use strict";async function e(e,t){const s=`https://my-first-proect.onrender.com${e.url}`;try{const n=await fetch(s,{method:e.method,headers:{"Content-Type":"application/json;charset=utf-8"},body:e.body}),i=await n.json();await t(i)}catch(e){await t(e)}}class t{constructor(){this.elem=null,this.tooltipEl=null,this.formEl=null,this.eventSubmit=null,this.bindToDOM(),this.onSubmitForm=this.onSubmitForm.bind(this)}static get markup(){return'\n    <div class=\'modal__form\'>\n    <form class="form">\n    <h3>Выберите псевдоним</h3>\n    <div class="tooltip hidden"></div>\n    <input type="text" class="nickname" name="nickname">\n    <button type="submit" class="submit" disabled>Продолжить</button>\n  </form>\n  <div class="msg-server">Ждите...</div>\n  </div>\n        '}static get modalForm(){return".modal__form"}static get form(){return".form"}static get tooltip(){return".tooltip"}bindToDOM(){this.elem=document.createElement("div"),this.elem.className="modal",this.elem.innerHTML=t.markup,this.modalForm=this.elem.querySelector(t.modalForm),this.tooltip=this.elem.querySelector(t.tooltip),this.tooltip.textContent="Такой ник уже существует",this.form=this.elem.querySelector(t.form),this.form.addEventListener("submit",this.onSubmitForm.bind(this))}addListenerSubmit(e){this.eventSubmit=e}onSubmitForm(e){e.preventDefault(),this.eventSubmit.call(null)}}class s{constructor(){this.elem=null,this.createUsersField()}createUsersField(){this.elem=document.createElement("div"),this.elem.className="users"}addUser(e){const t=document.createElement("div");t.className="user";const s="You"===e?"Y":e.slice(0,2);"Y"===s&&t.classList.add("you"),t.insertAdjacentHTML("beforeend",`<div class="user-avatar">${s}</div>\n        <div class="user-name">${e}</div>`),this.elem.append(t)}renderUsers(e){this.elem.innerHTML="",e.forEach((e=>this.addUser(e)))}}class n{constructor(e){this.container=e,this.users=new s,this.chatMessagesContainer=null,this.youName=null,this.connectId=null,this.init()}init(){this.bindToDOM()}static get markup(){return"\n      <div class='user'></div>\n      <div class='chat__area'>\n        <div class='chat__messages-container'>\n        <div class=\"messageAll\"></div>\n        </div>\n        <div class='chat__messages-input'>\n          <form class='form__group'>\n            <input \n              class='form__input' type=\"text\" name=\"report\"\n              placeholder='Type your message here...' \n              required>\n          </form>\n        </div>\n    </div>"}static get chatArea(){return".chat__area"}static get user(){return".user"}static get chatMessagesContainer(){return".chat__messages-container"}static get formInput(){return".form__input"}static get formGroup(){return".form__group"}static get message(){return".messageAll"}bindToDOM(){this.container.innerHTML=n.markup,this.chatArea=this.container.querySelector(n.chatArea),this.user=this.container.querySelector(n.user),this.user.append(this.users.elem),this.chatMessagesContainer=this.container.querySelector(n.chatMessagesContainer),this.formInput=this.container.querySelector(n.formInput),this.formGroup=this.container.querySelector(n.formGroup),this.message=this.container.querySelector(n.message)}addMessage(e){const t=e.user===this.youName?"You":e.user,s=(new Date).toLocaleString(),n=document.createElement("div");n.className="message","You"===t&&n.classList.add("you"),n.insertAdjacentHTML("beforeend",`<div class="message-header">\n      <div class="message-header_name">${t}</div>\n      <div class="message-header_time">${s.replace(",","")}</div>\n      </div>\n      <div class="message-text">${e.text}</div>`),this.chatMessagesContainer.append(n)}openChat(){const e=new WebSocket("wss://my-first-proect.onrender.com");this.formGroup.addEventListener("submit",(t=>{t.preventDefault();const s=this.formInput.value.trim();s&&(e.send(JSON.stringify({message:{date:Date.now(),text:s}})),this.formInput.value="")})),e.addEventListener("open",(()=>{e.send(JSON.stringify({name:this.youName}))})),e.addEventListener("message",(e=>{const t=JSON.parse(e.data);if(console.log(t),t.joining&&(this.connectId=t.joining),t.online){const e=[];t.online.forEach((t=>{t.id===this.connectId?e.push("You"):e.push(t.name)})),this.users.renderUsers(e)}t.loadMsg&&t.loadMsg.forEach((e=>this.addMessage(e))),t.message&&this.addMessage(t.message)})),e.addEventListener("close",(e=>{console.log(e),console.log("ws close")})),e.addEventListener("error",(e=>{console.log(e),console.log("ws error")}))}}const i=document.querySelector("#root");new class{constructor(e){this.parent=e,this.chat=null,this.modal=new t}init(){this.get(),this.create(),this.registerEvent()}get(){const e=document.createElement("h2");e.textContent="Чат",this.parent.append(e);const t=document.createElement("div");t.className="container",this.chat=new n(t),this.parent.append(this.chat.container),document.body.append(this.modal.elem)}create(){const t=setInterval((()=>{e({url:"",method:"GET"},(async e=>{const s=await e;if(e.status){const e=this.modal.elem.querySelector(".msg-server");e.textContent="Сервер запущен",e.style.color="green",this.modal.elem.querySelector(".submit").disabled=!1,clearInterval(t)}else s instanceof TypeError&&console.log("ждите")}))}),2e3)}registerEvent(){this.modal.addListenerSubmit(this.onSubmitForm.bind(this))}onSubmitForm(){const t=this.modal.form.nickname.value.trim();if(t.length>2){e({url:"/users/entry",method:"POST",body:JSON.stringify({name:t})},(async e=>{const t=await e;"find"===t.status?(this.modal.form.append(this.modal.tooltip),this.modal.tooltip.classList.remove("hidden"),setTimeout((()=>{this.modal.tooltip.remove()}),4e3)):"ok"===t.status?(this.modal.form.reset(),this.modal.elem.remove(),this.chat.youName=t.name,this.chat.openChat()):console.log(t)}))}}}(i).init()})();
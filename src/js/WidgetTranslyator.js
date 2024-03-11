export default class WidgetTranslyator {
  constructor(url, parent) {
    this.urlServer = url;
    this.conteiner = parent;
    this.field = null;
    this.eventSource = new EventSource(url);
  }

  bindToDOM() {
    // Отрисовка виджета в поле родителя
    this.field = WidgetTranslyator.addTagHTML(this.conteiner, 'widget-content');

    this.eventSource.addEventListener('open', (e) => {
      console.log('sse open', e);
    });
    
    this.eventSource.addEventListener('error', (e) => {
      console.log('sse error', e);
    });
    
    this.eventSource.addEventListener('message', (e) => {
      const body = JSON.parse(e.data);
      this.addField(body);
      console.log('body', body);      
      console.log('sse message');
    });
  }

  addField(obj) {
    // Добавление комментария
    const div = WidgetTranslyator.addTagHTML(this.field, 'widget-message');
    const img = WidgetTranslyator.addTagHTML(div, 'message-img');
    const message = WidgetTranslyator.addTagHTML(div, 'message-content');
    const time = WidgetTranslyator.addTagHTML(message, 'message-time');
    time.textContent = WidgetTranslyator.getNewFormatDate(obj.time);
    const text = WidgetTranslyator.addTagHTML(message, 'message-text');
    text.textContent = obj.text;
    if (obj.type === 'freekick') {
      img.classList.add('freekick');
    }
    if (obj.type === 'goal') {
      img.classList.add('goal');
    }
    this.field.scrollTop = this.field.scrollHeight; // прокручиваем элемент до конца
  }

  static addTagHTML(parent, className = null, type = 'div') {
    // Создает заданный тег и добавляет его в parent
    const div = document.createElement(type);
    div.classList.add(className);
    parent.append(div);
    return div;
  }

  static getNewFormatDate(timestamp) {
    // возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear());
    const month = WidgetTranslyator._addZero(start.getMonth());
    const date = WidgetTranslyator._addZero(start.getDate());
    const hours = WidgetTranslyator._addZero(start.getHours());
    const minutes = WidgetTranslyator._addZero(start.getMinutes());
    const seconds = WidgetTranslyator._addZero(start.getSeconds());
    const time = `${hours}:${minutes}:${seconds} ${date}.${month}.${year}`;
    return time;
  }

  static _addZero(number) {
    // делает число двухзначным
    let result = number;
    if (result < 10) {
      result = `0${result}`;
    }
    return result;
  }
}

export default class WidgetWorklog {
  constructor(conteiner) {
    this.conteiner = conteiner;
    this.field = null;
  }

  init() {
    // Добавляем обработчики событий для элементов
    this.field = this.conteiner.querySelector('.worklog-logs');
  }

  drawLog(obj) {
    // Отрисовка логов
    const parent = WidgetWorklog.addTagHTML(this.field, 'log');
    const header = WidgetWorklog.addTagHTML(parent, 'log-header');
    const server = WidgetWorklog.addTagHTML(parent, 'log-server');
    const info = WidgetWorklog.addTagHTML(parent, 'log-info');
    if (obj.data) {
      server.textContent = `Server: ${obj.data.id}`;
      if (obj.status === 'Received') {
        info.textContent = `INFO: Received "${obj.data.command}"`;
        header.textContent = WidgetWorklog.getNewFormatDate(obj.data.time);
      } else {
        info.textContent = `INFO: ${obj.status}`;
        header.textContent = WidgetWorklog.getNewFormatDate(obj.data.time);
      }
    } else {
      server.textContent = `Server: ${obj.id}`;
      info.textContent = `INFO: ${obj.state}`;
      header.textContent = WidgetWorklog.getNewFormatDate(obj.time);
    }
    this.field.scrollTop = this.field.scrollHeight; // прокручиваем элемент до конца
  }

  static getNewFormatDate(timestamp) {
    // возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear());
    const month = WidgetWorklog._addZero(start.getMonth());
    const date = WidgetWorklog._addZero(start.getDate());
    const hours = WidgetWorklog._addZero(start.getHours());
    const minutes = WidgetWorklog._addZero(start.getMinutes());
    const seconds = WidgetWorklog._addZero(start.getSeconds());
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

  static addTagHTML(parent, className = null, type = 'div') {
    // Создает заданный тег и добавляет его в parent
    const div = document.createElement(type);
    div.classList.add(className);
    parent.append(div);
    return div;
  }
}

export default class WidgetInstances {
  constructor(conteiner) {
    this.conteiner = conteiner;
    this.field = null;
    this.createListeners = [];
    this.deleteListeners = [];
    this.changeListeners = [];
  }

  init() {
    // Добавляем обработчики событий для элементов
    this.field = this.conteiner.querySelector('.instances-content');
    const link = this.conteiner.querySelector('.instances-link');
    link.addEventListener('click', (event) => this.onClickCreate(event));
    this.field.addEventListener('click', (event) => this.onClickForm(event));
  }

  addInstance(obj) {
    // Отрисовывает новый instance
    const div = WidgetInstances.addTagHTML(this.field, 'instance');
    div.setAttribute('id', obj.id);
    const title = WidgetInstances.addTagHTML(div, 'instance-title');
    title.textContent = obj.id;

    const status = WidgetInstances.addTagHTML(div, 'instance-status');
    const span = WidgetInstances.addTagHTML(status, 'status-header', 'span');
    span.textContent = 'Status:';
    const state = WidgetInstances.addTagHTML(status, 'status-img');
    state.classList.add(obj.state.toLowerCase());
    const spanState = WidgetInstances.addTagHTML(status, 'status-state', 'span');
    spanState.textContent = obj.state;

    const actions = WidgetInstances.addTagHTML(div, 'instance-actions');
    const spanHeader = WidgetInstances.addTagHTML(actions, 'actions-header', 'span');
    spanHeader.textContent = 'Actions:';
    const btnPlay = WidgetInstances.addTagHTML(actions, 'action-run');
    if (obj.state === 'Stopped') {
      btnPlay.classList.add('play');
    } else {
      btnPlay.classList.add('pause');
    }
    WidgetInstances.addTagHTML(actions, 'action-delete');
    this.field.scrollTop = this.field.scrollHeight; // прокручиваем элемент до конца
  }

  static deleteInstace(id) {
    // Удаление элементов по id
    const element = document.getElementById(id);
    element.remove();
  }

  static changeInstace(command, id) {
    // Отрисовка останова/запуска instance
    const element = document.getElementById(id);
    const actionDiv = element.querySelector('.action-run');
    const status = element.querySelector('.status-img');
    const span = element.querySelector('.status-state');
    if (command === 'Stopped') {
      actionDiv.classList.remove('pause');
      actionDiv.classList.add('play');
      status.classList.remove('running');
      status.classList.add('stopped');
      span.textContent = 'Stopped';
    } else {
      actionDiv.classList.remove('play');
      actionDiv.classList.add('pause');
      status.classList.remove('stopped');
      status.classList.add('running');
      span.textContent = 'Running';
    }
  }

  static addTagHTML(parent, className = null, type = 'div') {
    // Создает заданный тег и добавляет его в parent
    const div = document.createElement(type);
    div.classList.add(className);
    parent.append(div);
    return div;
  }

  onClickCreate(event) {
    // Нажали кнопку создать instance
    event.preventDefault();
    this.createListeners.forEach((o) => o.call(null, event));
  }

  addClickCreate(callback) {
    // Сохраняет callback создания instance
    this.createListeners.push(callback);
  }

  onClickForm(event) {
    // Нажали кнопку в поле instance
    event.preventDefault();
    const { target } = event;
    const parent = target.closest('.instance');
    if (target.className.includes('action-run')) {
      this.changeListeners.forEach((o) => o.call(null, parent));
      return;
    }
    if (target.className.includes('action-delete')) {
      this.deleteListeners.forEach((o) => o.call(null, parent));
    }
  }

  addClickChange(callback) {
    // Сохраняет callback запуск/останов instance
    this.changeListeners.push(callback);
  }

  addClickDelete(callback) {
    // Сохраняет callback удаление instance
    this.deleteListeners.push(callback);
  }
}

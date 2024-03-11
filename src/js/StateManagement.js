export default class StateManagement {
  constructor(instance, worklog, port) {
    this.editorInstance = instance;
    this.editorWorklog = worklog;
    this.urlServer = `http://localhost:${port}`;
    this.ws = new WebSocket(`ws://localhost:${port}`);
  }

  init() {
    this.editorInstance.init();
    this.editorWorklog.init();

    this.editorInstance.addClickCreate(this.onClickCreate.bind(this));
    this.editorInstance.addClickDelete(this.onClickDelete.bind(this));
    this.editorInstance.addClickChange(this.onClickChange.bind(this));
    this.getInstances();

    this.ws.addEventListener('message', (e) => {
      const obj = JSON.parse(e.data);
      this.editorWorklog.drawLog(obj);
      if (obj.status === 'Created') {
        this.editorInstance.addInstance(obj.data);
      }
      if (obj.status === 'Removed') {
        this.editorInstance.constructor.deleteInstace(obj.data.id);
      }
      if ((obj.status === 'Stopped') || (obj.status === 'Started')) {
        this.editorInstance.constructor.changeInstace(obj.status, obj.data.id);
      }
    });
  }

  onClickChange(element) {
    // Callback - событие click нажатия на запуск/останов instance
    const actionDiv = element.querySelector('.action-run');
    let typeCommand = null;
    if (actionDiv.className.includes('play')) {
      typeCommand = 'Start command';
    } else {
      typeCommand = 'Pause command';
    }
    const id = element.getAttribute('id');
    this.ws.send(JSON.stringify({
      command: typeCommand,
      id,
    }));
  }

  onClickDelete(element) {
    // Callback - событие click нажатия на удаление instance
    const id = element.getAttribute('id');
    this.ws.send(JSON.stringify({
      command: 'Delete command',
      id,
    }));
  }

  onClickCreate() {
    // Callback - событие click нажатия на создание instance
    this.ws.send(JSON.stringify({ command: 'Create command' }));
  }

  async getInstances() {
    // Получение списка instances от сервера
    const url = `${this.urlServer}/instances/`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const array = await response.json();
    for (const obj of array) {
      this.editorInstance.addInstance(obj);
      this.editorWorklog.drawLog(obj);
    }
  }

  getNewFormatDate(timestamp) {
    // Возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear()).slice(2);
    const month = this._addZero(start.getMonth());
    const date = this._addZero(start.getDate());
    const hours = this._addZero(start.getHours());
    const minutes = this._addZero(start.getMinutes());
    const time = `${date}.${month}.${year} ${hours}:${minutes}`;
    return time;
  }
}

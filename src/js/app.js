import WidgetTranslyator from './WidgetTranslyator';

const body = document.querySelector('.conteiner');
const url = 'https://javascript-21-websockets-backend-task3.onrender.com/sse';
const widget = new WidgetTranslyator(url, body);
widget.bindToDOM();

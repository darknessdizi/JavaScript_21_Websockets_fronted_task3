import WidgetTranslyator from './WidgetTranslyator';

const body = document.querySelector('.conteiner');
const url = 'http://localhost:9000/sse';
const widget = new WidgetTranslyator(url, body);
widget.bindToDOM();

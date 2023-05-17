var formfield = document.getElementById('formfield');
const formCounter = document.getElementById('counter').value;

function add(){
  var newField = document.createElement('input');
  var newField2 = document.createElement('input');
  newField.setAttribute('type','text');
  newField.setAttribute('name','text[]');
  newField.setAttribute('class','text');
  newField.setAttribute('siz',50);
  formfield.appendChild(newField);
}

function remove(){
  var input_tags = formfield.getElementsByTagName('input');
  if(input_tags.length > 2) {
    formfield.removeChild(input_tags[(input_tags.length) - 1]);
  }
}
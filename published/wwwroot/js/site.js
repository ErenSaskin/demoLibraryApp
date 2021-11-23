const uri = 'api/Books';
const uri2 = 'api/weatherForecast';

let books = [];


function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function getweather(city = 'istanbul') {
  fetch(uri2 + "/" + city)
    .then(response => response.json())
    .then(data => _displayWeather(data))
    .catch(error => console.error('Unable to get items.', error));
}


function searchCity() {
  const searchCityTextbox = document.getElementById('search-city');
  let name = searchCityTextbox.value.trim();
  if(name != ''){
    getweather(name);
  }
}

function _displayWeather(data) {
  const tBody = document.getElementById('city');
  tBody.innerHTML = '';

  _displayCount(data.length);

  data.forEach(item => {

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    var img = new Image(); // width, height values are optional params 
    img.src = 'http://openweathermap.org/img/wn/' +item.icon+ '.png';
    td1.appendChild(img);

    let td2 = tr.insertCell(1);
    let textNode2 = document.createTextNode(item.name);
    td2.appendChild(textNode2);

    let td3 = tr.insertCell(2);
    let textNode3 = document.createTextNode(item.date);
    td3.appendChild(textNode3);

    let td4 = tr.insertCell(3);
    let textNode4 = document.createTextNode(item.temp);
    td4.appendChild(textNode4);

    let td5 = tr.insertCell(4);
    let textNode5 = document.createTextNode(item.main);
    td5.appendChild(textNode5);

    let td6 = tr.insertCell(5);
    let textNode6 = document.createTextNode(item.description);
    td6.appendChild(textNode6);

    let td7 = tr.insertCell(6);
    let textNode7 = document.createTextNode(item.feelsLike);
    td7.appendChild(textNode7);

    let td8 = tr.insertCell(7);
    let textNode8 = document.createTextNode(item.tempMin);
    td8.appendChild(textNode8);

    let td9 = tr.insertCell(8);
    let textNode9 = document.createTextNode(item.tempMax);
    td9.appendChild(textNode9);

  });

  city = data;
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');
  const addAuthorTextbox = document.getElementById('add-author');

  const item = {
    name: addNameTextbox.value.trim(),
    author: addAuthorTextbox.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
      addAuthorTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
  const item = books.find(item => item.id === id);
  
  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-author').value = item.author;
  document.getElementById('editForm').style.display = 'block';
  document.getElementById('addForm').style.display = 'none';
}

function updateItem() {
  const itemId = document.getElementById('edit-id').value;
  const item = {
    id: itemId,
    name: document.getElementById('edit-name').value.trim(),
    author: document.getElementById('edit-author').value.trim(),
  };

  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('addForm').style.display = 'block';

}

function _displayCount(itemCount) {
  const name = (itemCount === 0) ? 'There is no book yet.' : 'Number of existing books:';

  document.getElementById('counter').innerText = `${name} ${itemCount}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('books');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {

    let editButton = button.cloneNode(false);
    let itemId = "" + item.id;
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm("${itemId}")`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem("${itemId}")`);

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let textNode = document.createTextNode(item.name);
    td1.appendChild(textNode);

    let td2 = tr.insertCell(1);
    let textNode2 = document.createTextNode(item.author);
    td2.appendChild(textNode2);

    let td3 = tr.insertCell(2);
    td3.appendChild(editButton);
    td3.appendChild(deleteButton);
  });

  books = data;
}

function openLibrary() {
  document.getElementById('weatherForecast').style.display = 'none';
  document.getElementById('library').style.display = 'block';

}
function openWeatherForecast() {
  document.getElementById('library').style.display = 'none';
  document.getElementById('weatherForecast').style.display = 'block';

}
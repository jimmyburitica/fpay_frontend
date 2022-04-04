const URL_GLOBAL = 'http://localhost/fpay/public/api';
const divMessages = document.getElementById('div_messages');
const divUsers = document.getElementById('div_users');
const divNewUser = document.getElementById('div_new_user');

indexUsers();

/**
 * Get users
 */
async function indexUsers() {
  let url = `${URL_GLOBAL}/users`;
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    let result = await response.json();

    if (result.data.length > 0) {
      renderUsers(result.data);
    } else {
      renderNoUsers();
    }
  } catch (error) {
    // console.error(error);
    renderErrorUsers();
  }
}

/**
 * Show user´s list
 * @param {*} result 
 */
function renderUsers(result) {
  let html = '';
  for (const item of result) {
    html += `
    <div class="col-6 col-md-4 col-lg-3 col-xl-2 my-1 my-lg-3 p-2 p-lg-2">
      <div class="card border-1 border-brown shadow">
        <img src="${item.avatar}" class="card-img-top rounded-circle p-3 p-lg-4" alt="avatar">
        <div class="card-body px-1 pt-0">
          <h5 class="card-text text-center">${item.name}</h5>
        </div>
      </div>
    </div>
    `;
  }
  divUsers.innerHTML = html;
}

/**
 * There aren't users
 */
function renderNoUsers() {
  divUsers.innerHTML = `
    <div div class="alert alert-warning border-brown" role = "alert" >
      No hay usuarios. Cree uno en el siguiente enlace.
    </div >
  `;
}

/**
 * Server error
 */
function renderErrorUsers() {
  divUsers.innerHTML = `
    <div div class="alert alert-danger border-brown" role = "alert" >
      Ha ocurrido un error de conexión con el servidor, intente de nuevo en unos minutos.
    </div >
  `;
}

/**
 * Show / Hide div for new user
 * @param {*} show 
 */
function divAddUser(show) {
  if (show === 'show') {
    divNewUser.classList.add('active');
  } else {
    divNewUser.classList.remove('active');
    document.getElementById('new_name').value = '';
    document.getElementById('btn_save').disabled = false;
    document.getElementById('spinner_save').classList.add('visually-hidden');
  }
  divMessages.classList.add('visually-hidden');
}

/**
 * Save new user
 */
async function saveNewUser() {
  const url = `${URL_GLOBAL}/users`;
  const btnSave = document.getElementById('btn_save');
  const spinnerSave = document.getElementById('spinner_save');
  btnSave.disabled = true;
  spinnerSave.classList.remove('visually-hidden');

  const newName = document.getElementById('new_name').value;
  const avatar = getAvatar(newName);

  let data = {
    name: newName,
    avatar: avatar,
  };
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    let result = await response.json();
    indexUsers();
    divAddUser('hide');
    renderNewUserSuccess();
  } catch (error) {
    console.error(error);
    divAddUser('hide');
  }
}

/**
 * Get avatar
 * @param {string} newName 
 * @returns 
 */
function getAvatar(newName) {
  let firstName = newName.split(' ')[0];
  firstName = firstName.toLowerCase();
  // Remove accents
  firstName = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  let avatar = `https://avatars.dicebear.com/api/adventurer-neutral/${firstName}.svg`;
  return avatar;
}

/**
 * Show alert
 */
function renderNewUserSuccess() {
  divMessages.classList.remove('visually-hidden');
  divMessages.innerHTML = `
    <div class="alert alert-success border-brown" role = "alert">
      Usuario creado de forma exitosa.
    </div>
  `;
}


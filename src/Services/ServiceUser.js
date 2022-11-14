export function SignInUser(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/sign_in_user";

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUsers(texto, limit, offset) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl =
    base +
    "user/get_users?texto=" +
    texto +
    "&limit=" +
    limit +
    "&offset=" +
    offset;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUser(id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/get_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createUser(request) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/create_user";

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateUser(request, id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/update_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updatePasswordUser(request, id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/update_password_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateStateUser(id, request) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/update_state_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteUser(id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/delete_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// @JR
export function getDistinctUser(id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/get_distinct_user?id=" + id;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// @JR
export function getMailGerents(sales_org) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "user/gerents?sales_org=" + sales_org;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

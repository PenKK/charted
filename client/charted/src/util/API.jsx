import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Update with your backend URL
  withCredentials: true, // This is essential for sending cookies
});

export async function registerAccount(data) {
  return api
    .post("/auth/register", data)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err.response);
    });
}

export async function login(data) {
  return api
    .post("/auth/login", data, {
      withCredentials: true,
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(err => {
      return Promise.reject(err.response);
    });
}

export async function getWorkspacesDisplay() {
  return api.get(`/workspace/getDisplay`).then(response => {
    return response.data;
  });
}

export async function createWorkspace(data) {
  return api.post(`/workspace/create`, data).then(response => {
    return response.data;
  });
}

export async function getWorkspaceData(workspaceID) {
  return api.get(`/workspace/getData/${workspaceID}`).then(response => {
    return response.data;
  });
}

export async function createChart(data) {
  return api.post(`/chart/create`, data).then(response => {
    return response.data;
  });
}

export async function deleteChart(data) {
  return api.post(`/chart/delete`, data).then(response => {
    return response.data;
  });
}

export async function getWorkspaceCharts(workspaceID) {
  return api.get(`/workspace/getCharts/${workspaceID}`).then(response => {
    return response.data;
  });
}

export async function createItem(data) {
  return api.post(`/chart/createItem`, data).then(response => {
    return response.data;
  });
}

export async function moveItem(data) {
  return api.post(`/chart/moveItem`, data).then(response => {
    console.log(response);
    return response.data;
  });
}

export async function setItemDescription(data) {
  return api.post(`/chart/changeDescription`, data).then(response => {
    return response.data;
  });
}

export async function deleteItem(itemID, chartID) {
  return api.post(`/chart/deleteItem`, { itemID, chartID }).then(response => {
    return response.data;
  });
}

export async function validateToken(userID, token, expiryDate) {
  return fetch(`http://142.93.148.156:80/u/signin/auth/check/token?userID=${userID}&accessToken=${token}&expiryDateString=${expiryDate}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

export async function validateCurrentToken() {
  return fetch(`http://142.93.148.156:80/u/signin/auth/check/token?userID=${getCookie("userID")}&accessToken=${getCookie("token")}&expiryDateString=${getCookie("tokenExpiry")}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

export async function nullifyToken(userID) {
  return fetch(`http://142.93.148.156:80/u/signin/nullify/token?userID=${userID}`, {
    method: "POST",
  }).then(response => {
    return response.json();
  });
}

export async function getAllUserWorkspaces(userID) {
  return fetch(`http://142.93.148.156:80/u/get/workspaces/all/userid?userID=${userID}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

// export async function getWorkspaceIDS(userID) {
//   return fetch(`http://142.93.148.156:80/u/get/workspaces/all/userid?userID=${userID}`, {
//     method: "GET",
//   }).then(response => {
//     return response.json();
//   });
// }

// export async function getWorkspaceCreationDate(workspaceID) {
//   return fetch(`http://142.93.148.156:80/u/get/workspaces/createddate/workspaceid?workspaceID=${workspaceID}`, {
//     method: "GET",
//   }).then(response => {
//     return response.json();
//   });
// }

// export async function getWorkspaceIsPublic(workspaceID) {
//   return fetch(`http://142.93.148.156:80/u/get/workspaces/ispublic/workspaceid?workspaceID=${workspaceID}`, {
//     method: "GET",
//   }).then(response => {
//     return response.json();
//   });
// }

export async function authenticateWorkspace(userID, workspaceID) {
  try {
    return await fetch(`http://142.93.148.156:80/u/w/auth/${userID}/${workspaceID}`, {
      method: "GET",
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data.status == "success" ? 1 : -1;
      });
  } catch (error) {
    return 0; // Server offline
  }
}

export async function getWorkspaceName(workspaceID) {
  return fetch(`http://142.93.148.156:80/u/get/workspaces/name/workspaceid?workspaceID=${workspaceID}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

// export async function getWorkspaceCharts(workspaceID) {
//   return fetch(`http://142.93.148.156:80/u/get/charts/workspaceid?workspaceID=${workspaceID}`, {
//     method: "GET",
//   }).then(response => {
//     return response.json();
//   });
// }

export async function getChartsDisplay(workspaceID) {
  return fetch(`http://142.93.148.156:80/u/get/charts/display/workspaceid?workspaceID=${workspaceID}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

export async function setItemName(itemID, newName) {
  return fetch(`http://142.93.148.156:80/u/set/item/name/itemID?itemID=${itemID}&name=${newName}`, {
    method: "GET",
  }).then(response => {
    return response.json();
  });
}

export async function changeAccountUsername(data) {
  return fetch(`http://142.93.148.156:80/u/set/user/name/userid`, {
    method: "POST",
    body: data,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      return { status: "offline" };
    });
}

export async function changeAccountEmail(data) {
  return fetch(`http://142.93.148.156:80/u/set/user/email/userid`, {
    method: "POST",
    body: data,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      return { status: "offline" };
    });
}

export async function changeAccountPassword(data) {
  return fetch(`http://142.93.148.156:80/u/set/user/password/userid`, {
    method: "POST",
    body: data,
  }).then(response => {
    return response.json();
  });
}

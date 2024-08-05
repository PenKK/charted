import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://charted.mooo.com:3000",
  withCredentials: true, // Cookies
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

export async function changeUsername(data) {
  return api
    .post(`/user/changeUsername`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err.response;
    });
}

export async function changeEmail(data) {
  return api
    .post(`/user/changeEmail`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err.response;
    });
}

export async function changePassword(data) {
  return api
    .post(`/user/changePassword`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err.response;
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

// export async function getWorkspaceCharts(workspaceID) {
//   return fetch(`http://142.93.148.156:80/u/get/charts/workspaceid?workspaceID=${workspaceID}`, {
//     method: "GET",
//   }).then(response => {
//     return response.json();
//   });
// }


const logoutBtn = document.getElementById("logotBtn");
logoutBtn.addEventListener("click", logout);
async function logout(event) {
  event.preventDefault();

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  showAlert("Successfully logged out");

  window.location.href = "logIn_index.html";
}

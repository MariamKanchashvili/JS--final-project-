let accessToken = ""; //რადგან ფუნქციიდან ვერ გამოდის ვქმნით გლობალ ცვლადს რაც საშუალებას გვაძლევს რომ გარედან შევიტანთ ფუნქციის დაბრუნებისას

async function getCurrentUser() {
  try {
    // Storage-დან token-ის წამოღება
    const accessToken = sessionStorage.getItem("accessToken");

    // თუ token არ არსებობს
    if (!accessToken) {
      alert("Please Sign In First");

      return;
    }

    const res = await fetch("https://api.everrest.educata.dev/auth", {
      headers: {
        "Content-type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      document.getElementById("currentUser-firstname").value =
        data.firstName || "";

      document.getElementById("currentUser-lastname").value =
        data.lastName || "";

      document.getElementById("currentUser-age").value = data.age || "";

      document.getElementById("currentUser-email").value = data.email || "";

      document.getElementById("currentUser-address").value = data.address || "";

      document.getElementById("currentUser-role").value = data.role || "";

      document.getElementById("currentUser-zipcode").value = data.zipcode || "";

      document.getElementById("currentUser-avatar").value = data.avatar || "";

      document.getElementById("currentUser-phone").value = data.phone || "";
      if (data.gender) {
  const genderInput = document.querySelector(
    `input[name="gender"][value="${data.gender}"]`
  );

  if (genderInput) {
    genderInput.checked = true;
  }
}

      document.getElementById("currentUser-verified").value = data.verified
        ? "✅"
        : "❌";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);

    alert("Server Error");
  }
}

// // გვერდის ჩატვირთვისთანავე
// window.addEventListener("DOMContentLoaded", getCurrentUser);

// verify email
const form = document.getElementById("verify-id");

form.addEventListener("submit", verifyEmail);

async function verifyEmail(event) {
  event.preventDefault();

  const email = document.getElementById("verifyEmail").value;
  console.log(email);
  try {
    const res = await fetch(
      "https://api.everrest.educata.dev/auth/verify_email",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ email: email }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      sessionStorage.setItem("verify", JSON.stringify(data));
      getCurrentUser()
    } else {
      alert("Something went wrong");
    }
    console.log(data);
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
}

// Update user Data

async function updateUserData(event) {
  event.preventDefault();

  const fields = {
    firstName: document.getElementById("updateData-firstname").value,
    lastName: document.getElementById("updateData-lastname").value,
    age: document.getElementById("updateData-age").value,
    email:document.getElementById("updateData-email").value,
    address: document.getElementById("updateData-address").value,
    role:document.getElementById("updateData-role").value,
    phone: document.getElementById("updateData-phone").value,
    zipcode: document.getElementById("updateData-zipcode").value,
    avatar: document.getElementById("updateData-avatar").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
  };

  const userUpdateData = {};
  for (const key in fields) {
    if (fields[key] !== "" && fields[key] !== undefined) {
      userUpdateData[key] = key === "age" ? Number(fields[key]) : fields[key];
    }
  }

  const response = await fetch("https://api.everrest.educata.dev/auth/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(userUpdateData),
  });

  const data = await response.json();
  if (response.ok) {
    getCurrentUser();
  } else {
    console.log("error");
  }
  console.log(data);
}

document
  .getElementById("updateData-form")
  .addEventListener("submit", updateUserData);

// recover password

const recoverForm = document.getElementById("recoverPass-id");

recoverForm.addEventListener("submit", recoverPassword);

async function recoverPassword(event) {
    event.preventDefault();

    const email = document.getElementById("recoverPass").value

    try {
        const response = await fetch("https://api.everrest.educata.dev/auth/recovery", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify({ email: email })
        })

        const data = await response.json()

        if (response.ok) {
            alert(data.message)
        } else {
            alert("Something went wrong")
        }
    } catch (error) {
        console.log(error)
        alert("Server error")
    }
}

// change password

const refreshToken = "";
const changeForm = document.getElementById("changePass-id");

changeForm.addEventListener("submit", changePassword);

async function changePassword(event) {
  event.preventDefault();

  const changePass = document.getElementById("changePass").value;
  console.log(changePass);

  const oldPass = document.getElementById("oldPass").value;
  console.log(oldPass);
  try {
const response = await fetch("https://api.everrest.educata.dev/auth/change_password", {
    method: "PATCH",
    headers: {
        "Content-type": "application/json",
        "Accept": "*/*",
        "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` 
    },
    body: JSON.stringify({ oldPassword: oldPass, newPassword: changePass })
})

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("accessToken", data.access_token);

      sessionStorage.setItem("refreshToken", data.refresh_token);
      alert("Password successfully");
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    alert("Server error");
  }
}

// log out

const logoutBtn = document.getElementById("logotBtn");
logoutBtn.addEventListener("click", logout);
async function logout(event) {
  event.preventDefault();

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  alert("Successfully logged out");

  window.location.href = "logIn_index.html";
}

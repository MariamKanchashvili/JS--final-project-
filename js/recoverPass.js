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

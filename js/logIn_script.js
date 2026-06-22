// Sign In 

async function signIn(event) {
  event.preventDefault()
    const email=document.getElementById("signin-email").value
    const password=document.getElementById("signin-password").value

    const res=await fetch("https://api.everrest.educata.dev/auth/sign_in",{
        method:"POST",
        headers:{
        "Content-type":"application/json",
        "Accept":"*/*",
         },
         body:JSON.stringify({email,password})
    })

    const data=await res.json()
    accessToken=data.accesToken;

if(res.ok){
    sessionStorage.setItem("accessToken", data.access_token) 
    showAlert("Signed in")
  setTimeout(() => {
    window.location.href = "user_index.html" ;
    }, 1500);
    return;
    

}else{
    showAlert("You are not registered! please sign up first")
}
  console.log(data)

sessionStorage.setItem("accessToken", data.access_token)
}
console.log(sessionStorage.getItem("accessToken"))
document
.getElementById("signin-form")
.addEventListener("submit", signIn)


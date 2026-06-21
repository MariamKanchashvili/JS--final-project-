//sign up 

let accessToken="";  //რადგან ფუნქციიდან ვერ გამოდის ვქმნით გლობალ ცვლადს რაც საშუალებას გვაძლევს რომ გარედან შევიტანთ ფუნქციის დაბრუნებისას

async function signUp(event) {
event.preventDefault();

    const userData={
firstName:document.getElementById("signup-firstname").value,
lastName:document.getElementById("signup-lastname").value,
age:Number(document.getElementById("signup-age").value),
email:document.getElementById("signup-email").value,
password:document.getElementById("signup-password").value,
address:document.getElementById("signup-address").value,
phone:document.getElementById("signup-phone").value,
zipcode:document.getElementById("signup-zipcode").value,
avatar:document.getElementById("signup-avatar").value,
gender:document.querySelector('input[name="gender"]:checked')?.value,

  };
  console.log(userData)
  const res=await fetch("https://api.everrest.educata.dev/auth/sign_up",
    {
   method:"POST",
   headers:{
    "Content-type":"application/json",
    "Accept":"*/*"
   },
   body:JSON.stringify(userData)
  })

  const data= await res.json()
  if(res.ok){
    showAlert("Signed up");
     window.location.href =
    "logIn_index.html"
}else{
    showAlert("Something went wrong");
}
  console.log(data)
   
}

document
.getElementById("signup-form")
.addEventListener("submit",signUp)
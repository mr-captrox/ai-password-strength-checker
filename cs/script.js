const password = document.getElementById("password");
const bar = document.getElementById("strengthBar");
const text = document.querySelector("#strengthText span");
const score = document.getElementById("score");
const ai = document.getElementById("aiSuggestion");

const length = document.getElementById("length");
const upper = document.getElementById("upper");
const lower = document.getElementById("lower");
const number = document.getElementById("number");
const special = document.getElementById("special");

function checkPassword(){

let pass=password.value;

let total=0;

if(pass.length>=8){
length.innerHTML="✅ At least 8 Characters";
total+=20;
}else{
length.innerHTML="❌ At least 8 Characters";
}

if(/[A-Z]/.test(pass)){
upper.innerHTML="✅ One Uppercase Letter";
total+=20;
}else{
upper.innerHTML="❌ One Uppercase Letter";
}

if(/[a-z]/.test(pass)){
lower.innerHTML="✅ One Lowercase Letter";
total+=20;
}else{
lower.innerHTML="❌ One Lowercase Letter";
}

if(/[0-9]/.test(pass)){
number.innerHTML="✅ One Number";
total+=20;
}else{
number.innerHTML="❌ One Number";
}

if(/[!@#$%^&*(),.?":{}|<>]/.test(pass)){
special.innerHTML="✅ One Special Character";
total+=20;
}else{
special.innerHTML="❌ One Special Character";
}

score.innerHTML=total+"%";
bar.style.width=total+"%";

if(total<=20){
bar.style.background="red";
text.innerHTML="Weak";
ai.innerHTML="Use at least 8 characters and include uppercase, lowercase, number and symbol.";
}
else if(total<=40){
bar.style.background="orange";
text.innerHTML="Fair";
ai.innerHTML="Password is improving. Add more character types.";
}
else if(total<=60){
bar.style.background="gold";
text.innerHTML="Medium";
ai.innerHTML="Add a special character and make it longer.";
}
else if(total<=80){
bar.style.background="dodgerblue";
text.innerHTML="Strong";
ai.innerHTML="Good password. Consider using 12+ characters.";
}
else{
bar.style.background="green";
text.innerHTML="Very Strong";
ai.innerHTML="Excellent! Your password follows strong security practices.";
}

}

document.getElementById("togglePassword").onclick=function(){

if(password.type==="password"){
password.type="text";
this.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
}else{
password.type="password";
this.innerHTML='<i class="fa-solid fa-eye"></i>';
}

}

function resetAll(){

password.value="";
checkPassword();

}

function generatePassword(){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";

let pass="";

for(let i=0;i<14;i++){

pass+=chars.charAt(Math.floor(Math.random()*chars.length));

}

password.value=pass;

checkPassword();

}
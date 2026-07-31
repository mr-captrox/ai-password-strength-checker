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

const commonPasswords = [
    "password", "123456", "123456789", "12345", "12345678", "111111", 
    "1234567", "sunshine", "qwerty", "iloveyou", "admin", "welcome", 
    "123123", "monkey", "secret", "letmein", "password123", "admin123", "dragon"
];

function isCommonPassword(pass) {
    if (pass.length < 4) return false;
    let normalized = pass.toLowerCase();
    normalized = normalized.replace(/@/g, 'a')
                           .replace(/0/g, 'o')
                           .replace(/1/g, 'i')
                           .replace(/\$/g, 's')
                           .replace(/!/g, 'i')
                           .replace(/3/g, 'e');

    for (let i = 0; i < commonPasswords.length; i++) {
        if (normalized.includes(commonPasswords[i])) {
            return true;
        }
    }
    return false;
}

function checkPassword(){

let pass=password.value;

let total=0;

// Reset text color
text.style.color = "#333";

if (pass.length === 0) {
    score.innerHTML = "0%";
    bar.style.width = "0%";
    bar.style.background = "red";
    text.innerHTML = "None";
    ai.innerHTML = "Enter a password to receive suggestions.";
    length.innerHTML="❌ At least 8 Characters";
    upper.innerHTML="❌ One Uppercase Letter";
    lower.innerHTML="❌ One Lowercase Letter";
    number.innerHTML="❌ One Number";
    special.innerHTML="❌ One Special Character";
    return;
}

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

if (isCommonPassword(pass)) {
    score.innerHTML="0%";
    bar.style.width="100%";
    bar.style.background="red";
    text.innerHTML="Very Weak";
    text.style.color="red";
    ai.innerHTML="🚨 Warning: This password contains a highly common dictionary pattern and is easily hacked!";
    return;
}

score.innerHTML=total+"%";
bar.style.width=total+"%";

if(total<=20){
bar.style.background="red";
text.innerHTML="Weak";
text.style.color="red";
ai.innerHTML="Use at least 8 characters and include uppercase, lowercase, number and symbol.";
}
else if(total<=40){
bar.style.background="orange";
text.innerHTML="Fair";
text.style.color="orange";
ai.innerHTML="Password is improving. Add more character types.";
}
else if(total<=60){
bar.style.background="gold";
text.innerHTML="Medium";
text.style.color="gold";
ai.innerHTML="Add a special character and make it longer.";
}
else if(total<=80){
bar.style.background="dodgerblue";
text.innerHTML="Strong";
text.style.color="dodgerblue";
ai.innerHTML="Good password. Consider using 12+ characters.";
}
else{
bar.style.background="green";
text.innerHTML="Very Strong";
text.style.color="green";
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
const randomValues = new Uint32Array(14);
window.crypto.getRandomValues(randomValues);

for(let i=0;i<14;i++){
    pass += chars[randomValues[i] % chars.length];
}

password.value=pass;
checkPassword();
}

function copyPassword() {
    if (!password.value) return;
    navigator.clipboard.writeText(password.value).then(() => {
        const copyBtn = document.getElementById("copyBtn");
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}
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

const crackTimeElement = document.getElementById("crackTime");
const pwnedStatusElement = document.getElementById("pwnedStatus");
const aiPredictionElement = document.getElementById("aiPrediction");

let tfModel = null;
let pwnedTimeout;

function encodePasswordForAI(password) {
    const max_length = 20;
    let encoded = [];
    for (let i = 0; i < max_length; i++) {
        if (i < password.length) encoded.push(password.charCodeAt(i));
        else encoded.push(0);
    }
    return encoded;
}

async function initializeAI() {
    try {
        const response = await fetch('../password_dataset.csv');
        const textData = await response.text();
        const rows = textData.split('\n').slice(1);
        
        let xs = [];
        let ys = [];
        
        for (let row of rows) {
            const cols = row.trim().split(',');
            if (cols.length === 2) {
                xs.push(encodePasswordForAI(cols[0]));
                ys.push(parseInt(cols[1]));
            }
        }
        
        const X = tf.tensor2d(xs);
        const y = tf.tensor2d(ys, [ys.length, 1]);
        
        aiPredictionElement.innerHTML = "Building Neural Network...";
        
        tfModel = tf.sequential();
        tfModel.add(tf.layers.embedding({inputDim: 256, outputDim: 16, inputLength: 20}));
        tfModel.add(tf.layers.flatten());
        tfModel.add(tf.layers.dense({units: 16, activation: 'relu'}));
        tfModel.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
        
        tfModel.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});
        
        aiPredictionElement.innerHTML = "Training AI...";
        
        await tfModel.fit(X, y, {
            epochs: 20,
            batchSize: 32,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    aiPredictionElement.innerHTML = `Training AI (Epoch ${epoch+1}/20)...`;
                }
            }
        });
        
        aiPredictionElement.innerHTML = "✅ AI Ready!";
        
    } catch(e) {
        aiPredictionElement.innerHTML = "❌ AI Failed to Load";
        console.error("TFJS Error:", e);
    }
}
initializeAI();

async function checkPwned(pass) {
    if (pass.length === 0) {
        pwnedStatusElement.innerHTML = "Waiting...";
        pwnedStatusElement.style.color = "#333";
        return;
    }
    pwnedStatusElement.innerHTML = "Checking...";
    pwnedStatusElement.style.color = "orange";
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(pass);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);
        
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const textData = await response.text();
        const hashes = textData.split('\n');
        
        let found = false;
        let count = 0;
        for (let line of hashes) {
            const [h, c] = line.split(':');
            if (h === suffix) {
                found = true;
                count = parseInt(c.trim());
                break;
            }
        }
        
        if (found) {
            pwnedStatusElement.innerHTML = `❌ Pwned! Found ${count.toLocaleString()} times.`;
            pwnedStatusElement.style.color = "red";
        } else {
            pwnedStatusElement.innerHTML = `✅ No Breaches Found`;
            pwnedStatusElement.style.color = "green";
        }
    } catch(e) {
        pwnedStatusElement.innerHTML = "Error checking status";
        pwnedStatusElement.style.color = "red";
    }
}

function checkPassword(){

    let pass = password.value;

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
        crackTimeElement.innerHTML = "Instant";
        pwnedStatusElement.innerHTML = "Waiting...";
        pwnedStatusElement.style.color = "#333";
        if (tfModel) aiPredictionElement.innerHTML = "✅ AI Ready!";
        return;
    }

    // Run Local TFJS AI Inference
    if (tfModel) {
        const inputTensor = tf.tensor2d([encodePasswordForAI(pass)]);
        const prediction = tfModel.predict(inputTensor);
        const pValue = prediction.dataSync()[0]; // 0 is bad, 1 is good
        const crackProbability = (1.0 - pValue) * 100;
        
        if (crackProbability > 50) {
            aiPredictionElement.innerHTML = `<span style="color:red;">${crackProbability.toFixed(1)}% likely to be hacked</span>`;
        } else {
            aiPredictionElement.innerHTML = `<span style="color:green;">${crackProbability.toFixed(1)}% likely to be hacked</span>`;
        }
    }

    // Update UI rules
    length.innerHTML = pass.length>=8 ? "✅ At least 8 Characters" : "❌ At least 8 Characters";
    upper.innerHTML = /[A-Z]/.test(pass) ? "✅ One Uppercase Letter" : "❌ One Uppercase Letter";
    lower.innerHTML = /[a-z]/.test(pass) ? "✅ One Lowercase Letter" : "❌ One Lowercase Letter";
    number.innerHTML = /[0-9]/.test(pass) ? "✅ One Number" : "❌ One Number";
    special.innerHTML = /[!@#$%^&*(),.?":{}|<>]/.test(pass) ? "✅ One Special Character" : "❌ One Special Character";

    // Use zxcvbn for true entropy and crack time
    let result;
    if (typeof zxcvbn === 'function') {
        result = zxcvbn(pass);
    } else {
        // Fallback if CDN fails
        result = { score: 0, crack_times_display: { offline_slow_hashing_1e4_per_second: "Unknown" }, feedback: { warning: "zxcvbn failed to load" } };
    }

    crackTimeElement.innerHTML = result.crack_times_display.offline_slow_hashing_1e4_per_second;

    let total = 0;
    if (result.score === 0) { total = 10; bar.style.background="red"; text.innerHTML="Very Weak"; text.style.color="red"; }
    else if (result.score === 1) { total = 25; bar.style.background="red"; text.innerHTML="Weak"; text.style.color="red"; }
    else if (result.score === 2) { total = 50; bar.style.background="orange"; text.innerHTML="Fair"; text.style.color="orange"; }
    else if (result.score === 3) { total = 75; bar.style.background="dodgerblue"; text.innerHTML="Strong"; text.style.color="dodgerblue"; }
    else if (result.score === 4) { total = 100; bar.style.background="green"; text.innerHTML="Very Strong"; text.style.color="green"; }

    score.innerHTML = total + "%";
    bar.style.width = total + "%";

    if (result.feedback && result.feedback.warning) {
        ai.innerHTML = "🚨 " + result.feedback.warning;
    } else if (result.feedback && result.feedback.suggestions && result.feedback.suggestions.length > 0) {
        ai.innerHTML = "🤖 " + result.feedback.suggestions[0];
    } else {
        if (result.score === 4) ai.innerHTML = "🤖 Excellent! Your password is highly secure.";
        else ai.innerHTML = "🤖 Keep adding unique characters to improve entropy.";
    }

    // Debounce the HIBP API Call (Wait 500ms after last keystroke)
    clearTimeout(pwnedTimeout);
    pwnedTimeout = setTimeout(() => {
        checkPwned(pass);
    }, 500);

}

document.getElementById("togglePassword").onclick = function(){
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

function exportAudit() {
    if (!password.value) {
        alert("Enter a password first to export its audit!");
        return;
    }
    const auditText = `=== PASSWORD SECURITY AUDIT ===
Generated on: ${new Date().toLocaleString()}

- Password Score: ${score.innerHTML}
- Strength Rating: ${text.innerHTML}
- AI Hack Probability: ${aiPredictionElement.innerHTML.replace(/<[^>]*>?/gm, '')}
- Estimated Crack Time: ${crackTimeElement.innerHTML}
- Breach Status: ${pwnedStatusElement.innerHTML.replace(/<[^>]*>?/gm, '')} // Remove HTML tags from status

AI Feedback:
${ai.innerHTML.replace(/<[^>]*>?/gm, '')}

Always use a password manager and unique passwords for every site.
===============================
    `.trim();

    const blob = new Blob([auditText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "password_security_audit.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
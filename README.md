<div align="center">
  <h1>🛡️ AI Password Strength Checker</h1>
  <p><b>A fully client-side, privacy-first web application that combines Regex Validation, Entropy Analysis, Real-World Breach Detection, and an in-browser Neural Network to evaluate password security.</b></p>
  <br/>
  <img src="Screenshot%202026-07-31%20at%2011.11.13%E2%80%AFPM.png" alt="App Overview" width="550"/>
</div>

---

## 📸 Application Screenshots

| Weak Password | Fair Password |
|:---:|:---:|
| <img src="Screenshot%202026-07-31%20at%2011.11.14%E2%80%AFPM.png" width="380"/> | <img src="Screenshot%202026-07-31%20at%2011.11.21%E2%80%AFPM.png" width="380"/> |

| Strong Password | Very Strong Password |
|:---:|:---:|
| <img src="Screenshot%202026-07-31%20at%2011.11.42%E2%80%AFPM.png" width="380"/> | <img src="Screenshot%202026-07-31%20at%2011.11.47%E2%80%AFPM.png" width="380"/> |

| Breach Detection | Export Audit |
|:---:|:---:|
| <img src="Screenshot%202026-07-31%20at%2011.11.59%E2%80%AFPM.png" width="380"/> | <img src="Screenshot%202026-07-31%20at%2011.12.25%E2%80%AFPM.png" width="380"/> |

| AI Training (First Launch) | AI Ready (Loaded from Cache) |
|:---:|:---:|
| <img src="Screenshot%202026-07-31%20at%2011.12.38%E2%80%AFPM.png" width="380"/> | <img src="Screenshot%202026-07-31%20at%2011.12.41%E2%80%AFPM.png" width="380"/> |

<div align="center">
  <img src="Screenshot%202026-07-31%20at%2011.12.53%E2%80%AFPM.png" alt="Full UI" width="550"/>
</div>

---

## 🎯 Project Purpose

This project was built as a **Computer Science Lab Final Project** to demonstrate the application of real-world cybersecurity concepts in a browser-based tool. The goal was to go beyond simple "uppercase/number" checking and implement a multi-layered, professionally-graded security analysis system — without ever sending the user's password to any server.

---

## ✨ Features

| Feature | Technology | What It Does |
|---|---|---|
| **Real-Time Checklist** | JavaScript Regex | Validates 5 rules (length, uppercase, lowercase, number, symbol) instantly as you type |
| **Dynamic Progress Bar** | CSS Transitions | Color changes Red → Orange → Gold → Blue → Green based on score |
| **Entropy Analysis & Crack Time** | zxcvbn (Dropbox) | Calculates how long it would take a computer to brute-force the password |
| **Breach Detection** | HaveIBeenPwned API + SHA-1 | Checks if the password appeared in known data breaches using k-Anonymity |
| **In-Browser AI Prediction** | TensorFlow.js | A Neural Network trained on 1,000 labeled passwords predicts hack probability locally |
| **Secure Password Generator** | Web Crypto API (CSPRNG) | Generates cryptographically unpredictable 14-character passwords |
| **Copy to Clipboard** | Clipboard API | One-click copy of the generated password |
| **Export Security Audit** | Blob API | Downloads a `.txt` report of the full security analysis |

---

## 🧠 Architecture: How It Works (A to Z)

### Layer 1 — Regex Validation (Foundation)
When the user types, JavaScript instantly checks the password against 5 Regular Expressions to drive the visual checklist. This is the fastest and most reliable method for validating required character types.

### Layer 2 — Entropy Analysis via `zxcvbn`
The project integrates `zxcvbn`, an open-source algorithm by Dropbox used in production systems. Unlike Regex, it understands **human psychology and behavior**:
- Detects keyboard spatial patterns (e.g., `qwerty`, `asdfgh`)
- Detects dictionary words, common names, dates, and l33tspeak
- Calculates **Information Entropy** (bits of randomness) and converts it to a real-world crack time (e.g., *"less than a second"* vs *"centuries"*)

### Layer 3 — Breach Detection using k-Anonymity (Cryptography)
This demonstrates a real-world cryptographic privacy protocol:
1. The password is hashed locally using **SHA-1** via `window.crypto.subtle` — the password never leaves the device.
2. Only the **first 5 characters** of the 40-character hash are sent to the HaveIBeenPwned API. This is called **k-Anonymity**.
3. The API returns all matching hash suffixes. JavaScript then locally checks for a match and reports how many times the password was found in real data breaches.

**The full password is never transmitted over the internet.**

### Layer 4 — On-Device Neural Network (TensorFlow.js)
The true AI component. The entire Machine Learning pipeline runs inside the user's browser:

1. **Dataset:** `password_dataset.csv` contains 1,000 labeled samples — 500 bad (common/predictable) and 500 cryptographically secure passwords.

2. **Neural Network Architecture:**
```
Input (20 characters)
  → Embedding Layer  (vocab size: 256, output dim: 16)
  → Flatten Layer
  → Dense Layer      (16 neurons, ReLU activation)
  → Output Layer     (1 neuron, Sigmoid activation → probability 0.0 to 1.0)
```

3. **Model Caching (localStorage):** After training once (20 epochs, ~1-2 seconds on M2), the model is saved to the browser's `localStorage`. On every subsequent page load, it loads from cache in under 1 second — **no retraining ever happens again**.

4. **Inference:** The typed password is tokenized (each character → ASCII integer, padded to 20 characters) and passed through the model, which returns the probability of being hacked.

### Layer 5 — Cryptographically Secure Password Generator
The "Generate Password" feature uses `window.crypto.getRandomValues()` — a **CSPRNG (Cryptographically Secure Pseudorandom Number Generator)** — instead of the insecure `Math.random()`. This produces passwords that are mathematically unpredictable.

---

## 🚀 How to Run Locally

### Requirements
- Python 3 (for the local development server)
- A modern browser (Chrome, Brave, Firefox, Safari)
- Internet connection (for zxcvbn CDN, TensorFlow.js CDN, and HaveIBeenPwned API)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/mr-captrox/ai-password-strength-checker.git

# 2. Navigate into the project folder
cd ai-password-strength-checker

# 3. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 4. Start the local web server from the project ROOT (not inside /cs)
python3 -m http.server 8000

# 5. Open your browser and go to:
http://localhost:8000/cs/index.html
```

> ⚠️ **Important:** You MUST run the server from the project **root folder**, not from inside the `cs/` folder. This is required so TensorFlow.js can access the `password_dataset.csv` file one level up, and so that the HaveIBeenPwned API works (CORS policy).

---

## 📂 Project File Structure

```
ai-password-strength-checker/
│
├── cs/
│   ├── index.html              # Main application UI structure
│   ├── style.css               # All styling, colors, animations
│   └── script.js               # All logic: Regex, zxcvbn, HIBP API, TensorFlow.js
│
├── password_dataset.csv        # 1,000 labeled passwords for AI training (500 bad, 500 good)
├── train_model.py              # Reference Python training script (not required to run)
├── README.md                   # This file
└── .gitignore                  # Ignores venv/ and system files
```

---

## ⚠️ Limitations

This project is a **Proof of Concept (PoC)** for educational purposes. The following limitations are acknowledged:

| Limitation | Explanation |
|---|---|
| **Small AI Dataset** | The Neural Network is trained on only 1,000 passwords. A production model would need millions of samples to generalize well and avoid bias. |
| **Risk of Overfitting** | With only 1,000 samples, the AI may "memorize" the training data rather than truly learning general patterns. |
| **SHA-1 is Cryptographically Deprecated** | SHA-1 is used here because the HaveIBeenPwned API requires it. In any other security context, SHA-1 is broken and should be replaced with SHA-256 or SHA-3. |
| **No Backend or Database** | This is a fully frontend application. There is no server, database, or user authentication. |
| **HIBP Requires Internet** | The breach detection feature requires an active internet connection to query the API. |
| **AI Prediction is Probabilistic** | The TF.js score is a probability estimate based only on what was learned from the 1,000-sample training dataset. It is not a definitive security verdict. |
| **localStorage is Browser-Specific** | The cached AI model is stored per browser/device. Opening in a new browser will trigger one-time retraining. |
| **CDN Dependency** | zxcvbn and TensorFlow.js are loaded via CDN. The app requires internet access for these to function. |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 / JavaScript (ES6+) | Core frontend stack |
| TensorFlow.js | In-browser Neural Network training and inference |
| zxcvbn (Dropbox) | Open-source entropy analysis and crack time estimation |
| HaveIBeenPwned API | Real-world global breach detection database |
| Web Crypto API (`crypto.subtle`, `getRandomValues`) | SHA-1 hashing and CSPRNG password generation |
| Clipboard API | Copy-to-clipboard functionality |
| Blob API | Client-side file export (Security Audit download) |
| FontAwesome | UI icons (CDN) |
| Python 3 `http.server` | Local development web server |

---

## 👨‍💻 Author

**Sourav Abhi** | Computer Science Lab Final Project

<div align="center">
  <h1>🛡️ AI Password Strength Checker</h1>
  <p><b>A fully client-side, privacy-first web application that combines Regex validation, Entropy Analysis, Real-World Breach Detection, and an in-browser Neural Network to evaluate password security.</b></p>
  <br/>
  <img src="Screenshot 2026-07-31 at 11.11.13 PM.png" alt="App Overview" width="550"/>
</div>

---

## 📸 Application Screenshots

| Weak Password | Fair Password |
|:---:|:---:|
| <img src="Screenshot 2026-07-31 at 11.11.14 PM.png" width="380"/> | <img src="Screenshot 2026-07-31 at 11.11.21 PM.png" width="380"/> |

| Strong Password | Very Strong Password |
|:---:|:---:|
| <img src="Screenshot 2026-07-31 at 11.11.42 PM.png" width="380"/> | <img src="Screenshot 2026-07-31 at 11.11.47 PM.png" width="380"/> |

| Breach Detection | Export Audit |
|:---:|:---:|
| <img src="Screenshot 2026-07-31 at 11.11.59 PM.png" width="380"/> | <img src="Screenshot 2026-07-31 at 11.12.25 PM.png" width="380"/> |

| AI Training (First Launch) | AI Ready (Cached) |
|:---:|:---:|
| <img src="Screenshot 2026-07-31 at 11.12.38 PM.png" width="380"/> | <img src="Screenshot 2026-07-31 at 11.12.41 PM.png" width="380"/> |

<div align="center">
  <img src="Screenshot 2026-07-31 at 11.12.53 PM.png" alt="Full UI" width="550"/>
</div>

---

## 🎯 Project Purpose

This project was built as a **Computer Science Lab Final Project** to demonstrate the application of real-world cybersecurity concepts in a browser-based tool. The goal was to go beyond simple "uppercase/number" checking and implement a multi-layered, professionally-graded security analysis system.

---

## ✨ Features

| Feature | Technology Used | What It Does |
|---|---|---|
| **Real-Time Checklist** | JavaScript Regex | Validates 5 rules (length, uppercase, lowercase, number, symbol) as you type |
| **Dynamic Progress Bar** | CSS Transitions | Color changes from Red → Orange → Gold → Blue → Green |
| **Entropy Analysis & Crack Time** | zxcvbn (Dropbox) | Calculates how long it would take a computer to brute-force the password |
| **Breach Detection** | HaveIBeenPwned API + SHA-1 | Checks if the password appeared in known data breaches using k-Anonymity |
| **In-Browser AI Prediction** | TensorFlow.js | A Neural Network trained on 1,000 labeled passwords predicts hack probability |
| **Secure Password Generator** | Web Crypto API (CSPRNG) | Generates cryptographically unpredictable 14-character passwords |
| **Copy to Clipboard** | Clipboard API | One-click copy of the generated password |
| **Export Security Audit** | Blob API | Downloads a `.txt` file containing the full security report |

---

## 🧠 Architecture: How It Works (A to Z)

### Layer 1 — Regex Validation (Foundation)
When the user types, the JavaScript instantly checks the password against 5 Regular Expressions to drive the visual checklist. This is the fastest and most reliable method for checking required character types.

### Layer 2 — Entropy Analysis via `zxcvbn`
The project integrates `zxcvbn`, an open-source algorithm by Dropbox used in production systems. Unlike basic Regex, it understands **human psychology**:
- It detects keyboard spatial patterns (e.g., `qwerty`, `asdfgh`)
- It detects dictionary words, common names, and dates
- It calculates **Information Entropy** (bits of randomness) and converts it to a real-world crack time (e.g., *"less than a second"* vs *"centuries"*)

### Layer 3 — Breach Detection (k-Anonymity Cryptography)
This is the most security-critical feature and demonstrates a real-world cryptographic protocol:
1. The password is hashed locally using **SHA-1** (via `window.crypto.subtle`) — the password itself never leaves the device.
2. Only the **first 5 characters** of the 40-character hash are sent to the HaveIBeenPwned API. This is called **k-Anonymity**.
3. The API returns hundreds of hash suffixes that share those 5 characters. JavaScript then checks locally if the full hash matches, and reports how many times it was found in breaches.

This means: **the full password is never transmitted anywhere.**

### Layer 4 — On-Device Neural Network (TensorFlow.js)
This is the true AI component. The entire machine learning pipeline runs inside the user's browser:

1. **The Dataset:** `password_dataset.csv` contains 1,000 labeled samples — 500 bad passwords (common, predictable patterns) and 500 cryptographically generated secure passwords.

2. **The Neural Network Architecture:**
   ```
   Input → Embedding Layer (256 vocab, 16 dimensions)
          → Flatten Layer
          → Dense Layer (16 neurons, ReLU activation)
          → Output Layer (1 neuron, Sigmoid activation)
   ```
   The **Sigmoid** output produces a score between 0.0 and 1.0, which we convert to a probability percentage.

3. **Model Persistence:** After training once (20 Epochs), the model is saved to the browser's `localStorage`. On every subsequent page load, the model is loaded from cache in under 1 second — **no retraining ever happens again**.

4. **Inference:** When a password is typed, it is tokenized (each character converted to its ASCII integer value) and padded to 20 characters. This is fed into the model which instantly returns its prediction.

---

## 🚀 How to Run Locally

### Requirements
- Python 3 (for the local server)
- A modern browser (Chrome, Brave, Firefox, Safari)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/mr-captrox/ai-password-strength-checker.git

# 2. Navigate into the project folder
cd ai-password-strength-checker

# 3. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 4. Start the local web server from the project root
python3 -m http.server 8000

# 5. Open your browser and visit:
# http://localhost:8000/cs/index.html
```

> ⚠️ **Important:** You must use a local server (`http://localhost`) and not just open the file directly. This is required for the AI to fetch the `password_dataset.csv` file and for the HaveIBeenPwned API to work (CORS policy).

---

## 📂 Project File Structure

```
ai-password-strength-checker/
│
├── cs/
│   ├── index.html          # Main application UI
│   ├── style.css           # All styling and animations
│   └── script.js           # All logic (Regex, zxcvbn, HIBP, TensorFlow.js)
│
├── password_dataset.csv    # 1,000 labeled passwords for AI training
├── train_model.py          # (Reference) Python version of the training script
├── README.md               # This file
└── .gitignore              # Ignores venv/ and .DS_Store
```

---

## ⚠️ Limitations

This project is a **Proof of Concept (PoC)** for educational purposes. It has the following known limitations:

| Limitation | Explanation |
|---|---|
| **Small AI Dataset** | The Neural Network is trained on only 1,000 passwords. A production-grade model would require millions of samples to generalize properly. |
| **Risk of Overfitting** | With only 1,000 samples, the AI may "memorize" specific passwords rather than truly learning patterns. |
| **SHA-1 is Deprecated** | SHA-1 is used for HIBP breach detection because HIBP's API uses it. In other security contexts, SHA-1 is considered cryptographically broken and should not be used. |
| **No Backend** | This is a fully frontend application. There is no server, no database, and no user authentication. |
| **HIBP Requires Internet** | The breach detection feature requires an active internet connection. Offline, it will fail gracefully. |
| **AI Prediction is Probabilistic** | The TF.js AI score is a probability estimate, not a guarantee. It reflects what the model learned from the dataset it was trained on. |
| **localStorage is Browser-Specific** | The cached AI model is stored per browser. If you switch browsers, it will retrain once. |

---

## 🛠️ Technologies Used

- **HTML5 / CSS3 / JavaScript (ES6+)** — Core frontend stack
- **TensorFlow.js** — In-browser Neural Network training and inference
- **zxcvbn** — Open-source entropy analysis algorithm by Dropbox
- **HaveIBeenPwned API** — Real-world breach detection database
- **Web Crypto API** — SHA-1 hashing and CSPRNG for password generation
- **FontAwesome** — UI Icons
- **Python 3** — Local development web server

---

## 👨‍💻 Author

**Sourav Abhi** | Computer Science Lab Final Project

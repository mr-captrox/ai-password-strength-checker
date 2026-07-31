import csv
import secrets
import string
import urllib.request

def generate_dataset():
    print("Fetching bad passwords...")
    print("Generating bad passwords...")
    base_bad = [
        "123456", "password", "12345678", "qwerty", "12345", 
        "123456789", "football", "1234", "1234567", "admin", 
        "111111", "qwertyuiop", "123123", "monkey", "sunshine",
        "letmein", "password123", "admin123", "dragon", "1234567890"
    ]
    bad_passwords = []
    # Generate variations to reach 500
    while len(bad_passwords) < 500:
        for b in base_bad:
            bad_passwords.append(b)
            bad_passwords.append(b + "123")
            bad_passwords.append(b + "!")
            bad_passwords.append(b.upper())
            bad_passwords.append("my" + b)
            if len(bad_passwords) >= 500: break
    
    print("Generating good passwords...")
    # 2. Generate 500 mathematically secure passwords using the Crypto module
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    good_passwords = []
    for _ in range(500):
        length = secrets.choice(range(12, 18)) # 12 to 17 characters long
        pwd = ''.join(secrets.choice(alphabet) for _ in range(length))
        good_passwords.append(pwd)
        
    print("Writing to CSV...")
    # 3. Write to CSV file
    with open('password_dataset.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['password', 'label']) # label: 0 = Bad, 1 = Good
        
        # Write Bad Passwords (Label 0)
        for pwd in bad_passwords:
            writer.writerow([pwd, 0])
            
        # Write Good Passwords (Label 1)
        for pwd in good_passwords:
            writer.writerow([pwd, 1])
            
    print("Success! 'password_dataset.csv' created with 1000 labeled samples.")

if __name__ == "__main__":
    generate_dataset()

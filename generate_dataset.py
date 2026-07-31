import csv
import secrets
import string
import urllib.request

def generate_dataset():
    print("Fetching bad passwords...")
    # 1. Fetch 500 real bad passwords from the famous SecLists repository
    url = "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-500.txt"
    try:
        response = urllib.request.urlopen(url)
        bad_passwords = response.read().decode('utf-8').splitlines()[:500]
    except Exception as e:
        print("Network error, generating fallback bad passwords...")
        bad_passwords = [f"password{i}" for i in range(500)]
    
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

# Administrative CMS Setup & Security Guide
## दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)

This document describes the secure, production-grade procedure for provisioning administrators without storing sensitive credentials in source code.

---

## 1. Secure Admin Onboarding Procedure

### Step 1: Create the User in Supabase Authentication
1. Log in to your [Supabase Dashboard](https://app.supabase.com).
2. Select your project: **`jukynvinqvsemjootcqf`**.
3. In the sidebar, navigate to **Authentication** &rarr; **Users**.
4. Click **Add user** &rarr; **Create user**.
5. Enter the administrative email address (e.g., `jagatsameeksha2014@gmail.com`) and choose a strong, unique password.
6. Toggle **Auto Confirm User?** to **ON** (so the user is verified immediately).
7. Click **Create user**.
8. Copy the generated **User UID** (a UUID such as `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 2: Assign Administrator Role in PostgreSQL
1. In the Supabase sidebar, open the **SQL Editor**.
2. Run the following command, replacing `<USER_UID>` with the copied User UID:

```sql
UPDATE public.profiles
SET
  role = 'admin',
  display_name = 'अरुण रमाकांत तिवारी (मुख्य संपादक)',
  updated_at = timezone('utc', now())
WHERE id = '<USER_UID>';
```

3. Confirm the role was assigned:
```sql
SELECT id, display_name, role FROM public.profiles WHERE id = '<USER_UID>';
```

---

## 2. Public Self-Registration Policy

> [!IMPORTANT]
> If your news portal does not have public reader accounts, disable public email registration to prevent arbitrary visitors from signing up:
> 1. In Supabase Dashboard, navigate to **Authentication** &rarr; **Providers** &rarr; **Email**.
> 2. Turn off **Allow new users to sign up**.
> 3. Save changes.
> 
> When this setting is disabled, only administrators can invite or create staff accounts directly from the dashboard.

---

## 3. Leaked Credentials Remediation & Password Rotation

> [!WARNING]
> Because early development commits previously referenced a demonstration password (`admin123`), any accounts created with this password must be rotated immediately:
> 1. In **Authentication** &rarr; **Users**, find `jagatsameeksha2014@gmail.com`.
> 2. Click the three dots menu &rarr; **Send password reset** or **Reset password** with a strong, randomized 16+ character passphrase.
> 3. Alternatively, delete the account and re-create it following Step 1 above.

---

## 4. Purging Git History of Leaked Credentials

To permanently remove past commit references to demo credentials from your repository history, run either of the following utilities on a fresh mirror clone:

### Using `git-filter-repo` (Recommended):
```bash
# 1. Install git-filter-repo
pip install git-filter-repo

# 2. Make a fresh mirror clone
git clone --mirror https://github.com/Dhoni354720/e-Newspaper_arun.git repo-cleanup
cd repo-cleanup

# 3. Replace all occurrences of the leaked demo password
git filter-repo --replace-text <(echo "admin123==>REDACTED_PASSWORD")

# 4. Force push the sanitized history to remote
git push origin --force --all
git push origin --force --tags
```

### Using BFG Repo-Cleaner:
```bash
# 1. Create a passwords.txt file containing the leaked strings
echo "admin123" > passwords.txt

# 2. Run BFG
bfg --replace-text passwords.txt repo-cleanup.git

# 3. Clean reflog and force push
cd repo-cleanup.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force --all
```

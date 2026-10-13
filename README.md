# MessagingApp

MessagingApp provides a front-end application to converse with other users bidirectionally in real-time.
This API:https://github.com/JKanaiya/MessagingApi provides the functionality to facilitate this interaction.

## Features

- Displays the chatrooms that the user is a part of.
- Persistent Login/Signup.
- Login with a guest account.
- Chat with a user from the existing list of users.
- Change the user's profile image and user name.

## Usage

### Setup

1. Clone the repo
```bash
git clone https://github.com/JKanaiya/MessagingApp.git
cd MessagingApp
```
2. Install dependencies
```bash
pnpm i
```
3. Create and configure .env
```bash
echo "VITE_BACKEND_URL=<your_backend_url_here>
VITE_SUPABASE_URL=<your_supabase_project_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your_supabase_publishable_key>" >> .env
```
4. Run the development server
```bash
npm run dev
```

License
-------

The project is licensed under the BSD license.

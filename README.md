# user-authentication-nodejs
This is a simple functionality of authenticating user created with NodeJS,ExpressJS and MongoDB

User Authentication is an important functionality in any application. In this project,I have used NodeJS to build a functionality for authentication

# Overview
This application provides basic features such as User Registration and User Login. Existing user can sign in using their email and password. New user can register with firstname,lastname,email and new password.

After Successful login/registration, it displays a page with a welcome message with the name of the user that logged in/registered. The use can logout using a button provided

# Usage
First install all necessary packages
```
npm install
```
Then start the server using
```
npm start
```
# Endpoints
The following endpoints are available

Register/Signup(POST)
```
https://<domain-name>/users/signup
```
SignIn
```
https://<domain-name>/users/login
```
# Example Usernames
Email: johndoe@gmail.com
Password: john1234

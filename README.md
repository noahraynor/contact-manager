# Contact Manager

## Overview
Contact Manager is a web application that allows users to manage their contacts.  Contacts can be added, edited, and deleted.  Tags (keywords) can be added or deleted from the application.  Tags can be added and removed from individual contacts.  Contcacts can be filtered by a search text input or by clicking on a tag.  

## Files
- `RequestManager.js` creates a `RequestManager` object that handles sending requests to the server and parsing the responses
- `UserInterface.js` creates a `UserInterface` object that handles DOM manipulation and binds events to `Contact Manager` methods
- `app.js` creates a `ContactManager` object that handles the program logic, handles storage of contacts and tags, and validates input.

## Features
- Add contact -> Click the “Add Contact” button and submit the subsequent form to create a new contact.
- Edit contact -> Click the “Edit” button under a given contact’s options and submit the subsequent form to update that contact
- Delete contact -> Click the “Delete” button under a given contact’s options to delete a contact. Confirmation is required.
- Search contacts -> Click on the search bar and type a query to search contact for a match. The search results live update as the user searches. 
- Tag Filter -> Click on any of the tags on the right side of the View Contacts page to filter by a specific tag.
- Manage tags -> Click on the "Manage Tags" navigation link to view the manage tags page.  Tags can be added and deleted here.

## Input validations
- Full name: Accepts 1-15 characters
- Phone number: Accepts 10 numerical characters
- Email: Accepts input that follows an email pattern "NoahRaynor@gmail.com"
- Tags: Accepts 1-15 alphabetic characters and must be unique

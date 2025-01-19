export class RequestManager {
  constructor() {
  }

  async fetchContacts() {
    try {
      let response = await fetch('http://localhost:3000/api/contacts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let contacts = await response.json();
      console.log("Response from server:", contacts);
      return contacts;
    }

    catch (error) {
      console.error("Error during GET request:", error);
      throw error; // Rethrow the error for further handling
    }  
  }

  async addContact(contactObj) {
    try {
      let apiURL = 'http://localhost:3000/api/contacts/';

      let response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactObj)
      });
     
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      console.log("Response from server:", responseData);
      return responseData;
    } 

    catch (error) {
      console.error("Error during POST request:", error);
      throw error; // Rethrow the error for further handling
    }
  }

  async deleteContact(id) {
    let apiURL = `http://localhost:3000/api/contacts/${id}`;
    let response = await fetch(apiURL, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return;
    })
    .then(data => console.log('Contact deleted successfully'))
    .catch(error => console.log('There was a problem with the fetch operation: ', error));
  }
}
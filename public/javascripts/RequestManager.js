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
      return contacts;
    }

    catch (error) {
      throw new Error(`fetchContacts error: ${error.message}`);
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
      return responseData;
    } 

    catch (error) {
      throw new Error(`addContact error: ${error.message}`);
    }
  }

  async deleteContact(id) {
    try {
        let apiURL = `http://localhost:3000/api/contacts/${id}`;
        let response = await fetch(apiURL, {
          method: 'DELETE',
        })
        
        if (response.status !== 204) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    catch(error) {
      throw new Error(`deleteContact error: ${error.message}`);
    }
  }

  async fetchContact(id) {
    try {
      let apiURL = `http://localhost:3000/api/contacts/${id}`;
      let response = await fetch(apiURL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let contact = await response.json();
      return contact;
    }

    catch (error) {
      throw new Error(`fetchContact error: ${error.message}`);
    }  
  }

  async editContact(id, contactObj) {
    try {
      let apiURL = `http://localhost:3000/api/contacts/${id}`;

      let response = await fetch(apiURL, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactObj)
      });
     
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      return responseData;
    } 

    catch (error) {
      throw new Error(`editContact error: ${error.message}`);
    }
  }
  
}
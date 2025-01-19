import { RequestManager } from './RequestManager.js';
import { UserInterface } from './UserInterface.js';

class ContactManager {
  constructor() {
    this.contacts = [];
    this.tags = [];

    this.interface = new UserInterface();

    this.interface.onSearchInput(this.handleSearchInput.bind(this));
    this.interface.onContactSubmit(this.handleContactSubmit.bind(this));
    this.interface.onTagFilter(this.handleTagFilter.bind(this));
    this.interface.onPageChange(this.handlePageChange.bind(this));
    this.interface.onDeleteButton(this.handleDeleteButton.bind(this));

    this.interface.addEventListeners();

    this.request = new RequestManager();
  }

  init() {
    this.renderContactsAndTags();
  }

  renderContactsAndTags() {
    this.request.fetchContacts()
    .then((response) => {
      this.contacts = response;
      this.interface.displayContacts(this.contacts);
      this.tags = this.getUniqueTags();
      this.interface.displayTags(this.tags);
    });
  }

  getUniqueTags() {
    let result = [];
    this.contacts.forEach(contact => { 
      if(contact.tags) {
        contact.tags.split(',').forEach(tag => {
          if (!result.includes(tag.toUpperCase())) {
            result.push(tag.toUpperCase());
          }
        });
      }
    });
    return result;
  }

  handleSearchInput() {
    let text = document.querySelector('#search').value.trim();
    let filteredContacts = this.contacts.filter(contact => {
      return contact['full_name'].toUpperCase().includes(text.toUpperCase());
    });
    this.interface.displayContacts(filteredContacts);
  }

  handleContactSubmit(event) {
    event.preventDefault();
    let addContactForm = document.querySelector('#contact-form');
    let formData = new FormData(addContactForm);
    let newContactObj = {};
    formData.forEach((value, key) => {
      newContactObj[key] = value;
    });

    let tagP = document.querySelector('#tag_add_contact');
    let tagsText = tagP.textContent.split(' ').map(tag => tag.toLowerCase()).join(',');

    newContactObj.tags = tagsText.length > 0 ? tagsText : null;

    this.request.addContact(newContactObj)
      .then(() => {
        this.renderContactsAndTags();
        this.interface.setPage('view');
      });
  }

  handleTagFilter(event) {
    if (event.target.tagName === 'BUTTON') {
      let tagToFind = event.target.textContent.toLowerCase();
      let filteredContacts = this.contacts.filter(contact => {
        if(contact.tags) {
          let tags = contact.tags.split(',');
          return tags.includes(tagToFind);
        }
      });
      this.interface.displayContacts(filteredContacts);
    }
  }

  handlePageChange(event) {
    if (event.target.tagName === 'BUTTON') {
      let page = event.target.dataset.page;
      this.interface.setPage(page);

      if(page === 'view') {
        this.renderContactsAndTags();
      }
    }
  }

  handleDeleteButton(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Delete') {
      let contactID = event.target.closest('div').dataset.id;
      this.request.deleteContact(contactID);
    //     .then(() => {
    //       this.renderContactsAndTags();
    //       this.interface.setPage('view');
    //     });
    }
  }

  handleEditButton(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Edit') {
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new ContactManager().init();
});
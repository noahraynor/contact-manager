import { RequestManager } from './RequestManager.js';
import { UserInterface } from './UserInterface.js';

class ContactManager {
  constructor() {
    this.contacts = [];
    this.tags = [];

    this.interface = new UserInterface();
    this.request = new RequestManager();
  }

  async init() {
    try {
      this.setupEventListeners();
      await this.renderViewPage();
      this.tags = this.getInitialTags();
      this.interface.displayViewPageTags(this.tags);
      this.renderAddContactPage();
      this.renderManageTagsPage();
    }
    catch(error) {
      console.error(error);
    }
  }

  //bind this ContactManager instance to event listener callbacks
  setupEventListeners() {
        this.interface.onSearchInput(this.handleSearchInput.bind(this));
        this.interface.onContactSubmit(this.handleContactSubmit.bind(this));
        this.interface.onTagFilter(this.handleTagFilter.bind(this));
        this.interface.onPageChange(this.handlePageChange.bind(this));
        this.interface.onDeleteButton(this.handleDeleteButton.bind(this));
        this.interface.onEditButton(this.handleEditButton.bind(this));
        this.interface.onAddContactTagClick(this.handleAddContactTagClick.bind(this));
        this.interface.onDeleteTagAddContact(this.handleDeleteTagAddContact.bind(this));
        this.interface.onAddContactCancel(this.handleAddContactCancel.bind(this));
        this.interface.onDeleteTagEditContact(this.handleDeleteTagEditContact.bind(this));
        this.interface.onSubmitEditContact(this.handleSubmitEditContact.bind(this));
        this.interface.onEditContactTagClick(this.handleEditContactTagClick.bind(this));
        this.interface.onAddNewTag(this.handleAddNewTag.bind(this));
        this.interface.onDeleteSingleTag(this.handleDeleteSingleTag.bind(this));
    
        this.interface.init();
  }

  async renderViewPage() {
    try {
      let contactsResponse = await this.request.fetchContacts()
      this.contacts = contactsResponse;
      this.interface.displayContacts(this.contacts);
      this.interface.displayViewPageTags(this.tags);
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  renderAddContactPage() {
    this.interface.displayAddPageTags(this.tags);
  }

  async renderEditContactPage(id) {
    let contact = await this.request.fetchContact(id);
    this.interface.fillEditPage(contact);
    this.interface.displayEditPageTags(this.tags);
  }

  renderManageTagsPage() {
    this.interface.displayManagePageTags(this.tags);
  }

  // returns an array of unique tags in all caps
  // seeds initial tags when webapp is launched
  getInitialTags() {
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
    let addContactForm = document.querySelector('#add_contact_form');
    let formData = new FormData(addContactForm);
    let newContactObj = {};
    formData.forEach((value, key) => {
      newContactObj[key] = value;
    });

    let tagP = document.querySelector('#tag_add_contact');
    let tagsText = tagP.textContent.split(' ').map(tag => tag.toLowerCase()).join(',');

    newContactObj.tags = tagsText.length > 0 ? tagsText : null;

    this.interface.clearAddContactErrors();

    let errors = this.validateFormData(newContactObj);

    if(!errors) {
      this.request.addContact(newContactObj)
        .then(() => {
          this.interface.resetAddContactForm();
          this.renderViewPage();
        })
        .then(() => {
          this.interface.setPage('view');
        })
        .catch(error => {
          console.error(error);
        });
      }
    else {
      this.interface.showAddContactErrors(errors);
    }
  }

  validateFormData(formData) {
    let errors = [];
    let name = formData.full_name;
    let email = formData.email;
    let phone_number = formData.phone_number;

    if(name.length < 1) {
      errors.push('Name required.');
    }
    else if(name.length > 15) {
      errors.push('Name must be less than 15 characters.');
    }
    if(email.length < 1) {
      errors.push('Email required.');
    }
    else if(!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
      errors.push('Email format invalid.');
    }
    if(phone_number.length < 1) {
      errors.push('Phone number required.');
    }
    else if(!/^[0-9]{10}$/.test(phone_number)) {
      errors.push('Phone number must be 10 numerical digits.');
    }
    if(errors.length > 0) {
      return errors;
    }
    else {
      return undefined;
    }
  }

  validateNewTagText(text) {
    let errors = [];
    if(text.length < 1) {
      errors.push('Tag name required.');
    }
    if(text.length > 15) {
      errors.push('Maximum tag length is 15 characters.');
    }
    if(!/^[a-z]*$/i.test(text)) {
      errors.push('Tags must be one word of only alphabetic characters.')
    }
    if(this.tags.includes(text.toUpperCase())) {
      errors.push('This is already a saved tag.');
    }
    if(errors.length > 0) {
      return errors;
    }
    else {
      return undefined;
    }
  }

  handleAddContactCancel() {
    this.interface.resetAddContactForm();
    this.interface.clearAddContactErrors();
    this.interface.setPage('view');
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
        this.renderViewPage();
      }
    }
  }

  handleDeleteButton(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Delete') {
      if(confirm("Are you sure you want to delete this contact?")) {
        let contactID = event.target.closest('div').dataset.id;
        this.request.deleteContact(contactID)
          .then(() => {
            this.renderViewPage()
          })
          .then(() => {
            this.interface.setPage('view');
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }

  handleEditButton(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Edit') {
      let id = event.target.closest('div').dataset.id;
      this.renderEditContactPage(id)
        .then(contact => {
          this.interface.setPage('edit');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  handleAddContactTagClick(event) {
    if (event.target.tagName === 'BUTTON') {
      let newTagText = (event.target.textContent);
      let tagContainer = document.querySelector('#tag_add_contact');
      let curText = tagContainer.textContent;
      if (!curText.includes(newTagText)) {
        if (curText.length > 0) newTagText = ' ' + newTagText;
        tagContainer.textContent += newTagText;
      }
    }
  }

  handleEditContactTagClick(event) {
    if (event.target.tagName === 'BUTTON') {
      let newTagText = (event.target.textContent);
      let tagContainer = document.querySelector('#edit_contact_tags');
      let curText = tagContainer.textContent;
      if (!curText.includes(newTagText)) {
        if (curText.length > 0) newTagText = ' ' + newTagText;
        tagContainer.textContent += newTagText;
      }
    }
  }

  handleDeleteTagAddContact(event) {
    event.preventDefault();
    let tagContainer = document.querySelector('#tag_add_contact');
    let curText = tagContainer.textContent;
    if(curText.length > 0) {
      let newText = curText.split(' ').slice(0, -1).join(' ');
      tagContainer.textContent = newText;
    }
  }

  handleDeleteTagEditContact(event) {
    event.preventDefault();
    let tagContainer = document.querySelector('#edit_contact_tags');
    let curText = tagContainer.textContent;
    if(curText.length > 0) {
      let newText = curText.split(' ').slice(0, -1).join(' ');
      tagContainer.textContent = newText;
    }
  }

  handleSubmitEditContact(event) {
    event.preventDefault();

    let id = event.target.dataset.id;
    let editContactForm = document.querySelector('#edit_contact_form');
    let formData = new FormData(editContactForm);
    let revContactObj = {};
    formData.forEach((value, key) => {
      revContactObj[key] = value;
    });

    let tagP = document.querySelector('#edit_contact_tags');
    let tagsText = tagP.textContent.split(' ').map(tag => tag.toLowerCase()).join(',');

    revContactObj.tags = tagsText.length > 0 ? tagsText : null;

    this.interface.clearEditContactErrors();

    let errors = this.validateFormData(revContactObj);

    if(!errors) {
      this.request.editContact(id, revContactObj)
        .then(() => {
          this.interface.resetEditContactForm();
          this.renderViewPage();
        })
        .then(() => {
          this.interface.setPage('view');
        });
    }
    else {
      this.interface.showEditContactErrors(errors);
    }
  }

  handleAddNewTag() {
    let newTagText = document.querySelector('#new_tag_input').value;
    let errors = this.validateNewTagText(newTagText);
    this.interface.clearManageTagsErrors();

    if(!errors) {
      this.tags.push(newTagText.toUpperCase());
      document.querySelector('#new_tag_input').value = '';
      this.renderAddContactPage();
      this.renderManageTagsPage();
      this.interface.clearManageTagsErrors()
    }
    else {
      this.interface.showManageTagsErrors(errors);
    }
  }

  handleDeleteSingleTag(event) {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete_last_tag')) {
      let tagText = event.target.previousElementSibling.textContent.toUpperCase();
      if (!this.tagUsed(tagText)) {
        this.deleteTag(tagText);
        this.renderAddContactPage();
        this.renderManageTagsPage();
        this.interface.displayViewPageTags(this.tags);
      }
      else {
        alert('Cannot delete tag that is currently attached to a contact.');
      }
    }
  }

  tagUsed(tagText) {
    return this.contacts.some(contact => {
      if (contact.tags) {
        return contact.tags.split(',').includes(tagText.toLowerCase());
      }
      else {
        return false;
      }
    });
  }

  deleteTag(tagText) {
    let tagIndex = this.tags.indexOf(tagText);
    this.tags.splice(tagIndex, 1);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new ContactManager().init();
});
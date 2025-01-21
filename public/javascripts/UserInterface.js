export class UserInterface {
  constructor() {
  }

  init() {
    this.setupHandlebars();
    this.addEventListeners();
  }

  setupHandlebars() {
    let contactsTemplate = document.querySelector('#contacts_hb').innerHTML;
    this.contactsTemplateFunc = Handlebars.compile(contactsTemplate);
    
    let contactPartialTemplate = document.querySelector('#contact_hb').innerHTML;
    Handlebars.registerPartial('contact', contactPartialTemplate);

    let tagsTemplate = document.querySelector('#tags_hb').innerHTML;
    this.tagsTemplateFunc = Handlebars.compile(tagsTemplate);

    let manageTagsTemplate = document.querySelector('#tags_hb_manage').innerHTML;
    this.manageTagsTemplateFunc = Handlebars.compile(manageTagsTemplate);
  }

  addEventListeners() {
    let nav = document.querySelector('nav');
    nav.addEventListener('click', this.pageChangeCallback);

    let searchInput = document.querySelector('#search');
    searchInput.addEventListener('input', this.searchCallback)

    let homeTagButtons = document.querySelector('#home_tags');
    homeTagButtons.addEventListener('click', this.tagFilterCallback);

    let contactSubmit = document.querySelector('#contact_submit');
    contactSubmit.addEventListener('click', this.contactSubmitCallback);

    let contacts = document.querySelector('#contacts');
    contacts.addEventListener('click', this.deleteCallback);
    contacts.addEventListener('click', this.editCallback);

    let addContactTagButtons = document.querySelector('#add_contact_tags');
    addContactTagButtons.addEventListener('click', this.addContactTagClick);

    let editContactTagButtons = document.querySelector('#edit_contact_tags_right');
    editContactTagButtons.addEventListener('click', this.editContactTagClick);

    let deleteTagAddContactButton = document.querySelector('#add_contact_delete_tag');
    deleteTagAddContactButton.addEventListener('click', this.deleteTagAddContact);

    let addContactCancelButton = document.querySelector('#add_contact_cancel');
    addContactCancelButton.addEventListener('click', this.addContactCancel);

    let deleteTagEditContactButton = document.querySelector('#edit_tag_delete');
    deleteTagEditContactButton.addEventListener('click', this.deleteTagEditContact);

    let editSubmitButton = document.querySelector('#edit_submit');
    editSubmitButton.addEventListener('click', this.submitEditContact);

    let addNewTagButton = document.querySelector('#add_new_tag');
    addNewTagButton.addEventListener('click', this.addNewTag);

    let tagsBox = document.querySelector('#manage_contact_tags');
    tagsBox.addEventListener('click', this.deleteSingleTag);
  }

  setPage(pageToView) {
    let pages = {};
    pages.view = document.querySelector('#home');
    pages.add = document.querySelector('#add_contact');
    pages.edit = document.querySelector('#edit_contact');
    pages.manage = document.querySelector('#manage_tags');

    Object.keys(pages).forEach(page => {
      pages[page].classList.add('hidden');
    });

    pages[pageToView].classList.remove('hidden');
  }

  displayContacts(contactList) {
    let formattedContactList = this.formatContacts(contactList); //format the tags
    let contactsHTML = this.contactsTemplateFunc({ contacts: formattedContactList });
    let contactsContainer = document.querySelector('#contacts');
    contactsContainer.innerHTML = contactsHTML;
  }

  formatContacts(contactList) {
    let contactListCopy = JSON.parse(JSON.stringify(contactList));
    return contactListCopy.map(contact => {
      let contactCopy
      if(contact.tags) {
        contact.tags = contact.tags.split(',').map(tag => tag.toUpperCase()).join(' ');
      }
      return contact;
    });
  }

  displayViewPageTags(tags) {
    let tagsHTML = this.tagsTemplateFunc({ tags: tags })
    let homeTags = document.querySelector('#home_tags');
    homeTags.innerHTML = tagsHTML;
  }

  displayAddPageTags(tags) {
    let tagsHTML = this.tagsTemplateFunc({ tags: tags })
    let addContactTags = document.querySelector('#add_contact_tags');
    addContactTags.innerHTML = tagsHTML;
  }

  displayEditPageTags(tags) {
    let tagsHTML = this.tagsTemplateFunc({ tags: tags })
    let editContactTags = document.querySelector('#edit_contact_tags_right');
    editContactTags.innerHTML = tagsHTML;
  }

  displayManagePageTags(tags) {
    let manageTagsHTML = this.manageTagsTemplateFunc({ tags: tags })
    let manageContactTags = document.querySelector('#manage_contact_tags');
    manageContactTags.innerHTML = manageTagsHTML;
  }

  resetAddContactForm() {
    let tagP = document.querySelector('#tag_add_contact');
    tagP.textContent = '';

    let addContactForm = document.querySelector('#add_contact_form');
    addContactForm.reset();

    this.clearAddContactErrors();
  }

  resetEditContactForm() {
    let tagP = document.querySelector('#edit_contact_tags');
    tagP.textContent = '';

    let editContactForm = document.querySelector('#edit_contact_form');
    editContactForm.reset();

    this.clearEditContactErrors();
  }

  showAddContactErrors(errors) {
    let errors_container = document.querySelector('#errors_container_add');
    errors_container.classList.remove('hidden');
    errors.forEach(error => {
      let p = document.createElement('p');
      p.classList.add('error_message');
      p.textContent = error;
      errors_container.appendChild(p);
    });
  }

  showEditContactErrors(errors) {
    let errors_container = document.querySelector('#errors_container_edit');
    errors_container.classList.remove('hidden');
    errors.forEach(error => {
      let p = document.createElement('p');
      p.classList.add('error_message');
      p.textContent = error;
      errors_container.appendChild(p);
    });
  }

  showManageTagsErrors(errors) {
    let errors_container = document.querySelector('#errors_container_manage');
    errors_container.classList.remove('hidden');
    errors.forEach(error => {
      let p = document.createElement('p');
      p.classList.add('error_message');
      p.textContent = error;
      errors_container.appendChild(p);
    });
  }

  clearAddContactErrors() {
    let errors_container = document.querySelector('#errors_container_add');
    errors_container.innerHTML = '';
    errors_container.classList.add('hidden');
  }

  clearEditContactErrors() {
    let errors_container = document.querySelector('#errors_container_edit');
    errors_container.innerHTML = '';
    errors_container.classList.add('hidden');
  }

  clearManageTagsErrors() {
    let errors_container = document.querySelector('#errors_container_manage');
    errors_container.innerHTML = '';
    errors_container.classList.add('hidden');
  }

  fillEditPage(contact) {
    let submitButton = document.querySelector('#edit_submit');
    submitButton.dataset.id = contact.id;

    let nameInput = document.querySelector('#edit_name');
    nameInput.value = contact.full_name;

    let emailInput = document.querySelector('#edit_email');
    emailInput.value = contact.email;

    let phoneInput = document.querySelector('#edit_phone');
    phoneInput.value = contact.phone_number;

    let tagInput = document.querySelector('#edit_contact_tags');
    if(contact.tags.length > 0) {
      tagInput.textContent = contact.tags.split(',').map(tag => tag.toUpperCase()).join(' ');
    }
  }

  onSearchInput(callback) {
    this.searchCallback = callback;
  }

  onContactSubmit(callback) {
    this.contactSubmitCallback = callback;
  }

  onTagFilter(callback) {
    this.tagFilterCallback = callback;
  }

  onPageChange(callback) {
    this.pageChangeCallback = callback;
  }

  onDeleteButton(callback) {
    this.deleteCallback = callback;
  }

  onEditButton(callback) {
    this.editCallback = callback;
  }

  onAddContactTagClick(callback) {
    this.addContactTagClick = callback;
  }

  onEditContactTagClick(callback) {
    this.editContactTagClick = callback;
  }

  onDeleteTagAddContact(callback) {
    this.deleteTagAddContact = callback;
  }

  onAddContactCancel(callback) {
    this.addContactCancel = callback;
  }

  onDeleteTagEditContact(callback) {
    this.deleteTagEditContact = callback;
  }

  onSubmitEditContact(callback) {
    this.submitEditContact = callback;
  }

  onAddNewTag(callback) {
    this.addNewTag = callback;
  }

  onDeleteSingleTag(callback) {
    this.deleteSingleTag = callback;
  }
}
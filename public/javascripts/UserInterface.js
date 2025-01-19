export class UserInterface {
  constructor(app) {
    this.currentPage = 'view';
    this.setupHandlebars();
  }

  setupHandlebars() {
    let contactsTemplate = document.querySelector('#contacts_hb').innerHTML;
    this.contactsTemplateFunc = Handlebars.compile(contactsTemplate);
    
    let contactPartialTemplate = document.querySelector('#contact_hb').innerHTML;
    Handlebars.registerPartial('contact', contactPartialTemplate);

    let tagsTemplate = document.querySelector('#tags_hb').innerHTML;
    this.tagsTemplateFunc = Handlebars.compile(tagsTemplate);
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
    let contactsHTML = this.contactsTemplateFunc({ contacts: contactList });
    let contactsContainer = document.querySelector('#contacts');
    contactsContainer.innerHTML = contactsHTML;
  }

  displayTags(tags) {
    let tagsHTML = this.tagsTemplateFunc({ tags: tags })
    let homeTags = document.querySelector('#home_tags');
    homeTags.innerHTML = tagsHTML;
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
}
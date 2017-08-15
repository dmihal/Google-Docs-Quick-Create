// Option defaults
const defaults = {
  apps_domain: '',
  acct_count: 1,
  acct_selected: 1
}

var options,
    // These keys should match the i18n keys and icon filenames
    doc_types = ['document', 'spreadsheet', 'presentation', 'drawing', 'form'],
    // We'll build the URL with these components
    url_comps = {
      base: 'https://docs.google.com',
      gsuite: '/a/??',
      acct: '/u/??',
      suffix: '/create'
    },
    links_wrap = document.querySelector('#links'),
    acct_select = document.querySelector('#acct_select')


/**
 * Rebuilds and replaces the link list in the DOM
 */
function update_links() {
  // Replace placholders with user config
  let url_gsuite = options.apps_domain ? url_comps.gsuite.replace('??', options.apps_domain) : '',
      url_acct = url_comps.acct.replace('??', options.acct_selected),
      links = ''

  // Build the link list
  doc_types.forEach((doc_type) => {
    let url,
        url_doc_type = doc_type
    // A few of the URLs require the doc_type to plural because Google is weird
    if ( 'spreadsheet drawing form'.includes(url_doc_type) )
      url_doc_type += 's'
    // Build URL
    url = `${url_comps.base}${url_gsuite}/${url_doc_type}${url_acct}${url_comps.suffix}`

    // I18n for link labels
    let label = chrome.i18n.getMessage('new_' + doc_type)

    // Create link UI
    links += `
      <li>
        <a href="${url}" target="_blank" data-doc-type="${doc_type}">
          <img src="${doc_type}-32.png" width="32" height="32">
          <label>${label}</label>
        </a>
      </li>
    `
  })
  links_wrap.innerHTML = links
  // Focus first link
  links_wrap.querySelector('li:first-child a').focus()

  // Update the Google Drive link
  document.querySelector('#drive_link').href = `https://drive.google.com${url_acct}/`
}

/**
 * Allows pressing num keys to switch account
 * Allows pressing letters to create new docs (D for document, F for form, etc.)
 */
function enable_hotkeys() {
  document.addEventListener('keydown', (e) => {
    let key = String.fromCharCode(e.which),
        int = parseInt(key)

    // Click user account button matching number pressed
    if (options.acct_count > 1 && int && int >= 1 && int <= options.acct_count)
      acct_select.querySelector(`button:nth-child(${int})`).click()

    // Click link matching letter pressed
    if ( 'D S P A F'.includes(key) ) {
      let selector = (key === 'A' ? '[data-doc-type=drawing]' : `[data-doc-type^=${key.toLowerCase()}]`)
      links_wrap.querySelector(selector).click()
    }

    // Move up/down links with arrow keys
    if (e.which === 38) // Up arrow
      links_wrap.querySelector('a:focus').parentElement.previousElementSibling.firstElementChild.focus()
    else if (e.which === 40) // Down arrow
      links_wrap.querySelector('a:focus').parentElement.nextElementSibling.firstElementChild.focus()
  })
}

/**
 * Updates UI and saves currently selected account index
 * Triggered by clicking a numbered button
 */
function select_acct() {
  this.parentElement.querySelector('.active').classList.remove('active')
  this.classList.add('active')

  options.acct_selected = parseInt(this.textContent) - 1
  update_links()
  chrome.storage.sync.set({ acct_selected: options.acct_selected })
}

/**
 * Adds account selection UI and related event listeners
 */
function enable_acct_select() {
  // Create account select UI
  let accts_html = ''
  for (let i = 0; i < options.acct_count; i++) {
    let active = (i === options.acct_selected ? 'active' : '')
    accts_html += `<button class="${active}" tabindex="-1">${i + 1}</button>`
  }
  acct_select.innerHTML = accts_html

  // Select account when a button is clicked
  document.querySelectorAll('#acct_select button').forEach((btn) => {
    btn.addEventListener( 'click', (e) => select_acct.bind(e.target)() )
  })
}

// Fetch user configuration
chrome.storage.sync.get(defaults, (items) => {
  // Save options globally to use elsewhere
  options = items

  // Create initial link UI
  update_links()

  enable_hotkeys()

  // If the user has more than one account, enable account selection
  if (options.acct_count > 1)
    enable_acct_select()
  // If the user specified a G Suite domain, show it in the status box
  if (options.apps_domain)
    document.querySelector('#drive_link label').innerText = `G Suite: ${options.apps_domain}`;
})

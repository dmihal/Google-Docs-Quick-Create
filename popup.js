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
        <a href="${url}" target="_blank">
          <img src="${doc_type}-32.png" width="32" height="32">
          <label>${label}</label>
        </a>
      </li>
    `
  })
  links_wrap.innerHTML = links
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
    accts_html += `<button class="${active}">${i + 1}</button>`
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

  // If the user has more than one account, enable account selection
  if (options.acct_count > 1)
    enable_acct_select()
  // If the user specified a G Suite domain, show it in the status box
  if (options.apps_domain)
    document.querySelector('#status').innerText = `G Suite: ${options.apps_domain}`;
})

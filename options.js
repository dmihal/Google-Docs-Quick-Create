let radios = document.querySelectorAll('input[name=acct_type]'),
    gsuite_radio = document.querySelector('input[name=acct_type][value=apps]'),
    gsuite_domain_field = document.querySelector('#gsuite_domain')

/**
 * Saves G Suite domain in Chrome storage,
 * or sets to null if G Suite is disabled
 */
function set_gsuite_domain() {
  let is_gsuite = gsuite_radio.checked && gsuite_domain_field.validity.valid
  let domain = is_gsuite ? gsuite_domain_field.value : null

  chrome.storage.sync.set({'apps_domain': domain})
}
gsuite_domain_field.addEventListener('change', set_gsuite_domain)


// Add event listener to radio buttons
radios.forEach((radio) => {
  radio.addEventListener('change', () => {
    // Toggle domain field
    gsuite_domain_field.disabled = !gsuite_radio.checked

    set_gsuite_domain()
  })
})

// Load options state
chrome.storage.sync.get('apps_domain', (values) => {
  if (values.apps_domain) {
    gsuite_radio.checked = true
    gsuite_domain_field.disabled = false
    gsuite_domain_field.value = values.apps_domain
  }
})

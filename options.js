// Option defaults
const defaults = {
  apps_domain: '',
  acct_count: 1,
  acct_selected: 1
}

var options,
    inputs = document.querySelectorAll('input'),
    gsuite_radio = document.querySelector('input[name=acct_type][value=apps]'),
    gsuite_domain_field = document.querySelector('#gsuite_domain'),
    acct_count_field = document.querySelector('#acct_count')


// Option defaults
function update_options() {
  // Did the user specify a G Suite domain?
  let is_gsuite = gsuite_radio.checked && gsuite_domain_field.validity.valid
  options.apps_domain = is_gsuite ? gsuite_domain_field.value : null
  // If the accout count is invalid, set it to 1
  options.acct_count = acct_count_field.validity.valid ? acct_count_field.value : 1

  // Reset the account selected if it's greater than the new account count
  if (options.acct_selected >= options.acct_count)
    options.acct_selected = 0

  // Save options
  chrome.storage.sync.set(options)
}

// Load options state
chrome.storage.sync.get(defaults, (items) => {
  options = items
  acct_count_field.value = options.acct_count

  if (options.apps_domain) {
    gsuite_radio.checked = true
    gsuite_domain_field.disabled = false
    gsuite_domain_field.value = options.apps_domain
  }

  // Update options when an input is changed
  inputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      // Enable domain field if the G Suite option is selected
      if (e.target.type === 'radio')
        gsuite_domain_field.disabled = !gsuite_radio.checked

      update_options()
    })
  })
})

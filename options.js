window.addEventListener('load', function(){
  var radios = document.querySelectorAll('.mdl-js-radio');
  var domain_field = document.querySelector('#txt_domain');
  var apps_radio = null;

  MaterialRadio.prototype.isChecked = function(){
    return this.btnElement_.checked
  };

  // Add event listeners to radio buttons
  for (var i = 0; i < radios.length; i++) {
    var radio = radios[i].MaterialRadio.btnElement_;
    radio.addEventListener('change', function(e){
      domain_field.disabled = !apps_radio.isChecked();
      form_changed_event();
    });
    if (radio.value == 'apps'){
      apps_radio = radios[i].MaterialRadio;
    }
  };

  // Set up event listener to store domain
  var form_changed_event = function(){
    var isApps = apps_radio.isChecked() && domain_field.validity.valid;
    var domain = isApps ? domain_field.value : null;
    chrome.storage.sync.set({'apps_domain': domain}, function() {
      // Settings saved
    });
  };
  domain_field.addEventListener('change', form_changed_event);

  // Prefill form values
  chrome.storage.sync.get('apps_domain', function(values){
    if (values.apps_domain){
      apps_radio.check();
      apps_radio.onChange_();
      domain_field.disabled = false;
      domain_field.value = values.apps_domain;
    }
  });
});

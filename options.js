(function(){
  var radios = document.querySelectorAll('input[name=acct_type]');
  var apps_radio = null;
  for (var i = 0; i < radios.length; i++) {
    var radio = radios[i];
    radio.addEventListener('change', function(e){
      document.querySelector('#txt_domain').disabled = !apps_radio.checked;
    });
    if (radio.value == 'apps'){
      apps_radio = radio;
    }
  };
})();

(function(){
  var apps_urls = {
    doc: "https://docs.google.com/a/??/document/create",
    sheet: "https://docs.google.com/a/??/spreadsheet/ccc?new",
    prez: "https://docs.google.com/a/??/presentation/create",
    draw: "https://docs.google.com/a/??/drawings/create",
    form: "https://docs.google.com/a/??/forms/create"
  };

  chrome.storage.sync.get('apps_domain', function(values){
    if (values.apps_domain){
      for (var link_id in apps_urls){
        var url = apps_urls[link_id].replace("??", values.apps_domain);
        document.getElementById(link_id).firstElementChild.href = url;
      }
      document.getElementById('status').innerText = `Using the ${values.apps_domain} domain`;
    }
  });

  for (var link_id in apps_urls) {
    var localLabel = chrome.i18n.getMessage("new_" + link_id);
    document.querySelector(`#${link_id} .label`).innerText = localLabel;
  }
})();

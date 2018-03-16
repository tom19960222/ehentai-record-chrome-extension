console.log(document.URL);

var parseResponse = function(resp){
  var metadata = JSON.parse(EHapiRequest.responseText);
  metadata = metadata.gmetadata[0];
  return metadata;
}

var match = document.URL.match(/https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
if (match && match.length === 4){
  console.log(`Gallery_id=${match[2]}, Gallery_token=${match[3]}`);

  var EHapiRequest = new XMLHttpRequest();
  var data = {
    'method': 'gdata',
    'gidlist': [
        [match[2], match[3]]
    ],
    'namespace': 1
  }
  var apiUrl = match[1] === 'exhentai' ? 'https://exhentai.org/api.php' : 'https://api.e-hentai.org/api.php'

  EHapiRequest.open('POST', apiUrl, true);
  EHapiRequest.setRequestHeader("Content-type", "application/json");
  EHapiRequest.onreadystatechange = function() { //Call a function when the state changes.
    if(EHapiRequest.readyState == 4 && EHapiRequest.status == 200) {
      var metadata = parseResponse(EHapiRequest.responseText);
      console.log(metadata);

      var serverApiRequest = new XMLHttpRequest();
      var recordData = {
        metadata: metadata,
        user: 'tom19960222@gmail.com',
        time: parseInt(new Date().valueOf() / 1000)
      }
      serverApiRequest.open('POST', 'https://eh-record.hsexpert.net/record', true);
      serverApiRequest.setRequestHeader("Content-type", "application/json");
      serverApiRequest.onreadystatechange = function() {
        if(serverApiRequest.readyState == 4 && serverApiRequest.status == 201){
          console.log('Send record done.');
        }
      }
      serverApiRequest.send(JSON.stringify(recordData));
    }
  }
  EHapiRequest.send(JSON.stringify(data));
}

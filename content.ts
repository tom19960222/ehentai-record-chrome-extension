console.log(document.URL);

class ServerRequest {
  metadata: object;
  user: string;
  time: number;

  constructor (data: ServerRequest) {
    this.metadata = data.metadata;
    this.user = data.user;
    this.time = data.time;
  }
}

const parseResponse = (resp: string) => {
  var metadata = JSON.parse(resp);
  metadata = metadata.gmetadata[0];
  return metadata;
}

const queryEHentaiAPIServer = (apiService: string, galleryId: string, galleryToken: string) => {
  return new Promise((resolve, reject) => {
    const EHapiRequest = new XMLHttpRequest();
    const data = {
      'method': 'gdata',
      'gidlist': [
          [galleryId, galleryToken]
      ],
      'namespace': 1
    }
    const apiUrl = apiService === 'exhentai' ? 'https://exhentai.org/api.php' : 'https://api.e-hentai.org/api.php'
  
    EHapiRequest.open('POST', apiUrl, true);
    EHapiRequest.setRequestHeader("Content-type", "application/json");
    EHapiRequest.onreadystatechange = function() { //Call a function when the state changes.
      if(EHapiRequest.readyState === XMLHttpRequest.DONE && EHapiRequest.status == 200) {
        const metadata = parseResponse(EHapiRequest.responseText);
        console.log(metadata);
        return resolve(metadata);
      }
    }
    EHapiRequest.send(JSON.stringify(data));
  })
}

const sendDataToServer = (metadata: object) => {
  const SERVER_URL = 'https://eh-record.hsexpert.net/record';

  return new Promise((resolve, reject) => {
    const serverApiRequest = new XMLHttpRequest();
    const recordData = new ServerRequest({
      metadata: metadata,
      user: 'tom19960222@gmail.com',
      time: (new Date().valueOf() / 1000)
    });
    serverApiRequest.open('POST', SERVER_URL, true);
    serverApiRequest.setRequestHeader('Content-type', 'application/json');
    serverApiRequest.onreadystatechange = function() {
      if(serverApiRequest.readyState === XMLHttpRequest.DONE && serverApiRequest.status == 201){
        console.log('Send record done.');
        return resolve();
      }
    }
    serverApiRequest.send(JSON.stringify(recordData));
  })
}

const main = async () => {
  const match = document.URL.match(/https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
  const mpvPageMatch = document.URL.match(/https:\/\/(exhentai|e-hentai).org\/mpv\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
  if (match && match.length === 4){
    console.log(`Gallery_id=${match[2]}, Gallery_token=${match[3]}`);
    const metadata = await queryEHentaiAPIServer(match[1], match[2], match[3]);
    await sendDataToServer(metadata);
  }
  if(mpvPageMatch && mpvPageMatch.length === 4){
    mpvPageReadTracker()
  }
}

const mpvPageReadTracker = () => {
  const readPages = new Set();
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  
  var elementList = document.querySelectorAll('.mi0');
  
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {console.log(mutation);
      if (mutation.type == "attributes") {
        if(mutation.target.style.visibility === 'hidden') return;
        const matchResult = mutation.target.id.match(/image_([0-9]+)/);
        if(matchResult.length > 1){
          if(!(readPages.has(matchResult[1]))) {
            readPages.add(matchResult[1]);
            console.log(`You are reading page ${matchResult[1]}`);
          }
        }
          
      }
    });
  });
  
  for(const element of elementList){
    observer.observe(element, {
      attributes: true //configure it to listen to attribute changes
    });
  }
}

main().then(() => {});


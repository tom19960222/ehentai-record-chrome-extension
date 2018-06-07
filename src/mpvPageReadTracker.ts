export const mpvPageReadTracker = () => {
  const readPages = new Set(); 
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  
  var elementList = document.querySelectorAll('.mi0');
  
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {console.log(mutation);
      if (mutation.type === "attributes") {
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
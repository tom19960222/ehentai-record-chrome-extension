import axios from 'axios';

export class RecommandGenerator {
  href: string;
  img: string;
  text: string;
  private recommandURL: string;

  constructor(){
    this.recommandURL = 'https://eh-record.hsexpert.net/recommand';

    const originalItgElement = document.querySelector('.itg');
    const originalItgElementParent = originalItgElement.parentElement;
    const newItgElement = this.generateItg();

    axios.get(this.recommandURL)
      .then(response => {
        const recommandDataList = response.data;
        for(const recommandData of recommandDataList){
          newItgElement.appendChild(this.generateId1(recommandData.href, recommandData.img, recommandData.text));  
        }

        originalItgElementParent.insertBefore(newItgElement, originalItgElement);
      });
  }
  
  private generateItg = () => {
    const itgElement = document.createElement('div');
    itgElement.className = 'itg';
    itgElement.style.height = '330px';
    return itgElement;
  }
  
  private generateId1 = (href: string, img: string, text: string) => {
    const id1Element = document.createElement('div');
    id1Element.className = 'id1';
    id1Element.style.height = '315px';
    const id2Element = this.generateId2(href, text);
    const id3Element = this.generateId3(href, img);
    id1Element.appendChild(id2Element);
    id1Element.appendChild(id3Element);
    return id1Element;
  }
  
  private generateAElement = (href: string, text?: string) => {
    const element = document.createElement('a');
    element.href = href;
    if(text) element.text = text;
    return element;
  }
  
  private generateId2 = (href: string, text: string) => {
    const id2Element = document.createElement('div');
    id2Element.className = 'id2';
    id2Element.appendChild(this.generateAElement(href, text));
    return id2Element;
  }
  
  private generateId3 = (href: string, img: string) => {
    const id3Element = document.createElement('div');
    id3Element.style.height = '280px';
    id3Element.className = 'id3';
    const aElement = this.generateAElement(href);
    const imgElement = document.createElement('img');
    imgElement.src = img;
    imgElement.style.position = 'relative';
    imgElement.style.top = '-1px';
    aElement.appendChild(imgElement);
    id3Element.appendChild(aElement);
    return id3Element;
  }
}


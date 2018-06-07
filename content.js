(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Metadata {
    constructor(data) {
        Object.assign(this, data);
    }
}
class MetadataServerRequest {
    constructor(data) {
        this.metadata = data.metadata;
        this.user = data.user;
        this.time = data.time;
    }
}
var PageTypeEnum;
(function (PageTypeEnum) {
    PageTypeEnum["BookList"] = "book_list";
    PageTypeEnum["BookDetail"] = "book_detail";
    PageTypeEnum["BookSingleImagePage"] = "book_single_image_page";
    PageTypeEnum["MultiPageViewer"] = "multi_page_viewer";
})(PageTypeEnum || (PageTypeEnum = {}));
class EventServerRequest {
}
class ServerRequestAction {
    constructor() {
        this.queryMetadataFromEHentaiAPIServer = (apiService, galleryId, galleryToken) => {
            return new Promise((resolve, reject) => {
                const self = this;
                const EHapiRequest = new XMLHttpRequest();
                const data = {
                    'method': 'gdata',
                    'gidlist': [
                        [galleryId, galleryToken]
                    ],
                    'namespace': 1
                };
                const apiUrl = apiService === 'exhentai' ? 'https://exhentai.org/api.php' : 'https://api.e-hentai.org/api.php';
                EHapiRequest.open('POST', apiUrl, true);
                EHapiRequest.setRequestHeader("Content-type", "application/json");
                EHapiRequest.onreadystatechange = function () {
                    if (EHapiRequest.readyState === 4 && EHapiRequest.status === 200) {
                        const metadata = self.parseResponse(EHapiRequest.responseText);
                        return resolve(metadata);
                    }
                };
                EHapiRequest.send(JSON.stringify(data));
            });
        };
        this.sendMetadataToServer = (metadata) => {
            const SERVER_URL = 'https://eh-record.hsexpert.net/record';
            return new Promise((resolve, reject) => {
                const serverApiRequest = new XMLHttpRequest();
                const recordData = new MetadataServerRequest({
                    metadata: metadata,
                    user: 'tom19960222@gmail.com',
                    time: (new Date().valueOf() / 1000)
                });
                serverApiRequest.open('POST', SERVER_URL, true);
                serverApiRequest.setRequestHeader('Content-type', 'application/json');
                serverApiRequest.onreadystatechange = function () {
                    if (serverApiRequest.readyState === XMLHttpRequest.DONE && serverApiRequest.status == 201) {
                        console.log('Send record done.');
                        return resolve();
                    }
                };
                serverApiRequest.send(JSON.stringify(recordData));
            });
        };
    }
    parseResponse(resp) {
        let metadata = JSON.parse(resp);
        metadata = metadata.gmetadata[0];
        return metadata;
    }
}
exports.ServerRequestAction = ServerRequestAction;

},{}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerRequestAction_1 = require("./ServerRequestAction");
const mpvPageReadTracker_1 = require("./mpvPageReadTracker");
class Main {
    constructor(document) {
        this.document = document;
    }
    extractURLInformation(URL) {
        const galleryMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
        const mpvPageMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/mpv\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
        const singlePageMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/s\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)-([0-9]+)\/?/);
        if (galleryMatch && galleryMatch.length === 4)
            return {
                position: 'gallery',
                galleryId: galleryMatch[2],
                galleryToken: galleryMatch[3],
                site: galleryMatch[1],
            };
        if (mpvPageMatch && mpvPageMatch.length === 4)
            return {
                position: 'mpv',
                galleryId: mpvPageMatch[2],
                galleryToken: mpvPageMatch[3],
                site: mpvPageMatch[1],
            };
        if (singlePageMatch && singlePageMatch.length === 5)
            return {
                position: 'single',
                galleryId: singlePageMatch[3],
                galleryToken: singlePageMatch[2],
                site: singlePageMatch[1],
                page: parseInt(singlePageMatch[4])
            };
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('document.URL', this.document.URL);
            const urlInfo = this.extractURLInformation(this.document.URL);
            if (!urlInfo)
                return;
            switch (urlInfo.position) {
                case 'gallery':
                    const serverRequest = new ServerRequestAction_1.ServerRequestAction();
                    console.log(`Gallery_id=${urlInfo.galleryId}, Gallery_token=${urlInfo.galleryToken}`);
                    const metadata = yield serverRequest.queryMetadataFromEHentaiAPIServer(urlInfo.site, urlInfo.galleryId, urlInfo.galleryToken);
                    yield serverRequest.sendMetadataToServer(metadata);
                    break;
                case 'mpv':
                    mpvPageReadTracker_1.mpvPageReadTracker();
                    break;
            }
        });
    }
}
exports.Main = Main;
console.log('Started');
new Main(window.document).start().then(() => { });

},{"./ServerRequestAction":1,"./mpvPageReadTracker":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpvPageReadTracker = () => {
    const readPages = new Set();
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var elementList = document.querySelectorAll('.mi0');
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log(mutation);
            if (mutation.type === "attributes") {
                if (mutation.target.style.visibility === 'hidden')
                    return;
                const matchResult = mutation.target.id.match(/image_([0-9]+)/);
                if (matchResult.length > 1) {
                    if (!(readPages.has(matchResult[1]))) {
                        readPages.add(matchResult[1]);
                        console.log(`You are reading page ${matchResult[1]}`);
                    }
                }
            }
        });
    });
    for (const element of elementList) {
        observer.observe(element, {
            attributes: true
        });
    }
};

},{}]},{},[2]);

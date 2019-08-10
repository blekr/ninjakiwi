// const _ = require('lodash');
import _ from 'lodash';
class Abcd {
  print() {
    console.log('----print')
  }
}
new Abcd().print();
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });


'use strict';

var submitClickHandler;

const TYPES = [
  // text
  {
    mime: /text\/plain/,
    handler: function(options) {
      addMessage(options, function(messageElement) {
        const textElement = document.createElement('span');
        textElement.innerText = options.text;
        messageElement.appendChild(textElement);
      });
    }
  },
  // image
  {
    mime: /image\//,
    handler: function(options) {
      addMessage(options, function(messageElement) {
        const serviceWorkerPath = fileFromServiceWorker(options.file);

        // To load or download the data, create an element with a url
        // that points to "files/<filename>"

        // TODO: fix race condition
        setTimeout(function() {
          const img = document.createElement('img');
          img.src = serviceWorkerPath;

          const anchor = document.createElement('a');
          anchor.href = serviceWorkerPath;

          anchor.appendChild(img);

          anchor.onclick = function(e) {
            var click = new MouseEvent('click');
            anchor.onclick = null;
            anchor.dispatchEvent(click);
            e.preventDefault();
          };

          messageElement.appendChild(anchor);
        }, 250);
      });
    }
  },
  // other
  {
    mime: /.*/,
    handler: function(options) {
      addMessage(options, function(messageElement) {
        const serviceWorkerPath = fileFromServiceWorker(options.file);

        // TODO: fix race condition
        setTimeout(function() {
          const anchor = document.createElement('a');

          var icon = document.createElement('i');
          icon.classList.add('fa');
          icon.classList.add('fa-file');
          anchor.appendChild(icon);

          anchor.href = serviceWorkerPath;
          anchor.onclick = function(e) {
            var click = new MouseEvent('click');
            anchor.onclick = null;
            anchor.dispatchEvent(click);
            e.preventDefault();
          };

          const textElement = document.createElement('span');
          textElement.innerText = ' ' + options.file.filename;
          anchor.appendChild(textElement);
          messageElement.appendChild(anchor);
        }, 250);
      });
    }
  }
];

function formSubmitHandler(event) {
  event.preventDefault();
  input.value = '';
}

function addMessage(options, callback) {
  const messageElement = document.createElement('div');
  const peerIdElement = document.createElement('div');
  console.log(options.peerId);

  messageElement.classList.add('message');
  if (options.peerId === peer.id) {
    // peerIdElement.innerText = 'me:';
    messageElement.classList.add('my');
  } else {
    messageElement.appendChild(peerIdElement);
    peerIdElement.innerText = String(options.peerId);
  }

  peerIdElement.classList.add('peer-id');

  callback(messageElement);
  messages.insertBefore(messageElement, messages.firstChild);
}

function highlightUrl(event) {
  shareUrlInput.select();
}
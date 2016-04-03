var HOLD_TIME = 500;
var DIST_THRESHOLD = 15;

(function() {
    var self = this;
    self.cId = 0;
    self.cElem = null;
    self.cUrl = null;
    self.cTimeout = null;
    self.cX = null;
    self.cY = null;

    self.clearClick = function() {
        clearTimeout(self.cTimeout);
        if (self.cElem) {
            self.cElem.removeEventListener('mousemove', self.mouseMove);
            self.cElem.removeEventListener('mouseout', self.clearClick);
            self.cElem.removeEventListener('mouseup', self.clearClick);
            self.cElem = null;
        };

        self.cUrl = null;
        self.cTimeout = null;
        self.cX = null;
        self.cY = null;
    }

    self.getElemWithUrl = function(elem) {
        while((!elem.href 
            || elem.href.indexOf('#') > -1
            || elem.href.indexOf('javascript:') > -1) 
            && elem.parentNode) {
            elem = elem.parentNode;
        };
        if (!elem.href) {
            return null;
        };
        return elem;
    }

    self.mouseDown = function(e) {
        if (e.button != 0 || !(elem = self.getElemWithUrl(e.target))) {
            self.clearClick();
            return;
        };
        ++self.cId;
        self.cX = e.pageX;
        self.cY = e.pageY;
        self.cElem = elem;
        self.cUrl = elem.href;
        self.cTimeout = setTimeout(function() { self.requestNewTab(cId); }, HOLD_TIME);

        self.cElem.addEventListener('mousemove', self.mouseMove);
        self.cElem.addEventListener('mouseout', self.clearClick);
        self.cElem.addEventListener('mouseup', self.clearClick);
    }

    self.mouseMove = function(e) {
        var dist = Math.sqrt(
            Math.pow(e.pageX - self.cX, 2) + 
            Math.pow(e.pageY - self.cY, 2));

        if (dist >= DIST_THRESHOLD) {
            self.clearClick();
        }
    }

    self.requestNewTab = function(id) {
        if(self.cId == id && self.cElem != null) {
            chrome.extension.sendRequest({   
                    action: "open_new_tab",
                    url: self.cUrl,
                    foreground: true,
                },
                function(response) {}
            );
            self.clearClick();
        }
    }

    document.addEventListener('mousedown', self.mouseDown);
})();
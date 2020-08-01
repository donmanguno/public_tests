if(typeof window.lpTag === 'undefined'){
    window.lpTag = {
        site : '57746814',
        _v : '1.2',
        protocol : location.protocol,
        events : {
            bind : function (app, ev, fn) {
                lpTag.defer(function () {
                    lpTag.events.bind(app, ev, fn);
                });
            },
            trigger : function (app, ev, json) {
                lpTag.defer(function () {
                    lpTag.events.trigger(app, ev, json);
                });
            }
        },
        defer : function (fn) {
            this._defL = this._defL || [];
            this._defL.push(fn);
        },
        load : function (src, chr, id) {
            var t = this; setTimeout(function () {t._load(src, chr, id);},0);
        },
        _load : function (src, chr, id) {
            var url = src;
            if (!src) {
                url = this.protocol + '//'+((this.ovr&&this.ovr.domain)?this.ovr.domain:'lptag.liveperson.net') + '/tag/tag.js?site=' + this.site;
            }
            var s = document.createElement('script');
            s.setAttribute('charset', chr?chr : 'UTF-8');
            if (id) {s.setAttribute('id', id);}
            s.setAttribute('src', url);
            document.getElementsByTagName('head').item(0).appendChild(s);
        },
        init : function () {
            this._timing = this._timing || {};
            this._timing.start = (new Date()).getTime();
            var that = this;

            if (window.attachEvent) {window.attachEvent('onload', function () { that._domReady('domReady');});}
            else {
                window.addEventListener('DOMContentLoaded', function () { that._domReady('contReady');}, false);
                window.addEventListener('load', function () { that._domReady('domReady');}, false);
            }

            if (typeof(window._lptStop)=='undefined') {this.load();}
        },
        _domReady : function (n) {
            if (!this.isDom) {
                this.isDom = true;
                this.events.trigger('LPT','DOM_READY', {t:n});
            }
            this._timing[n] = (new Date()).getTime();
        }
    };
    lpTag.init();
}

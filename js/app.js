(() => {
    "use strict";
    const modules_flsModules = {};
    window.addEventListener("DOMContentLoaded", function () {
        [].forEach.call(document.querySelectorAll('.tel'), function (input) {
            var keyCode;
            function mask(event) {
                event.keyCode && (keyCode = event.keyCode);
                var pos = this.selectionStart;
                if (pos < 3) event.preventDefault();
                var matrix = "+7 (___) ___ ____",
                    i = 0,
                    def = matrix.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, ""),
                    new_value = matrix.replace(/[_\d]/g, function (a) {
                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                    });
                i = new_value.indexOf("_");
                if (i != -1) {
                    i < 5 && (i = 3);
                    new_value = new_value.slice(0, i)
                }
                var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                    function (a) {
                        return "\\d{1," + a.length + "}"
                    }).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
                if (event.type == "blur" && this.value.length < 5) this.value = ""
            }

            input.addEventListener("input", mask, false);
            input.addEventListener("focus", mask, false);
            input.addEventListener("blur", mask, false);
            input.addEventListener("keydown", mask, false)

        });


    });

    let isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function () {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function () {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function () {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function (item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function (item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function (item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function (item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function () { },
                    afterOpen: function () { },
                    beforeClose: function () { },
                    afterClose: function () { }
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function (e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function (e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function () {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function () {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) { }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                headerItemHeight = document.querySelector(headerItem).offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() { },
        removeEventListener() { },
        activeElement: {
            blur() { },
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() { }
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() { },
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() { },
            pushState() { },
            go() { },
            back() { }
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() { },
        removeEventListener() { },
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() { },
        Date() { },
        screen: {},
        setTimeout() { },
        clearTimeout() { },
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [selector];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [el, index]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [selector] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([this[returnIndex]]);
        }
        return dom7_esm_$([this[index]]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([this[0].nextElementSibling]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([this[0].nextElementSibling]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([el.previousElementSibling]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([el.previousElementSibling]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) { }
            try {
                delete object[key];
            } catch (e) { }
        }));
    }
    function utils_nextTick(callback, delay = 0) {
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis = "x") {
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend(...args) {
        const to = Object(args[0]);
        const noExtend = ["__proto__", "constructor", "prototype"];
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll({ swiper, targetPosition, side }) {
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) { }
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice({ userAgent } = {}) {
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [0, 1, "13_0_0"];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides = {}) {
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize({ swiper, on, emit }) {
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const { width, height } = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((({ contentBoxSize, contentRect, target }) => {
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer({ swiper, extendParams, on, emit }) {
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = (target, options = {}) => {
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler(...args) {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit(...args) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [event, ...data]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const { $wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL } = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const { clientWidth, offsetWidth } = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [0];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate = this && this.translate || 0) {
        const swiper = this;
        const params = swiper.params;
        const { slides, rtlTranslate: rtl, snapGrid } = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let { progress, isBeginning, isEnd } = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const { slides, params, $wrapperEl, activeIndex, realIndex } = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const { slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex } = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis = (this.isHorizontal() ? "x" : "y")) {
        const swiper = this;
        const { params, rtlTranslate: rtl, translate, $wrapperEl } = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const { rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress } = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
        const swiper = this;
        const { params, wrapperEl } = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit({ swiper, runCallbacks, direction, step }) {
        const { activeIndex, previousIndex } = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks = true, direction) {
        const swiper = this;
        const { params } = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks = true, direction) {
        const swiper = this;
        const { params } = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const { params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled } = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const { animating, enabled, params } = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const { params, animating, snapGrid, slidesGrid, rtlTranslate, enabled } = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = .5) {
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const { params, $wrapperEl } = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const { params, $wrapperEl } = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const { activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl } = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const { $wrapperEl, params, slides } = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base = this) {
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const { params, touches, enabled } = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        const eventPath = event.composedPath ? event.composedPath() : event.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) $targetEl = dom(eventPath[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const { params, touches, rtlTranslate: rtl, enabled } = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const { params, el } = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const { wrapperEl, rtlTranslate, enabled } = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() { }
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const { params, touchEvents, el, wrapperEl, device, support } = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const { params, support } = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const { activeIndex, initialized, loopedSlides = 0, params, $el } = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        ["navigation", "pagination", "scrollbar"].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base = "window", containerEl) {
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const { point, value } = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const { classNames, params, rtl, $el, device, support } = swiper;
        const suffixes = prepareClasses(["initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
                "free-mode": swiper.params.freeMode && params.freeMode.enabled
            }, {
                autoheight: params.autoHeight
            }, {
                rtl
            }, {
                grid: params.grid && params.grid.rows > 1
            }, {
                "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
            }, {
                android: device.android
            }, {
                ios: device.ios
            }, {
                "css-mode": params.cssMode
            }, {
                centered: params.cssMode && params.centeredSlides
            }, {
                "watch-progress": params.watchSlidesProgress
            }], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([...classNames].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const { $el, classNames } = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const { isLocked: wasLocked, params } = swiper;
        const { slidesOffsetBefore } = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj = {}) {
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor(...args) {
            let el;
            let params;
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else[el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [...swiper.__modules__];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
                    const desktop = ["pointerdown", "pointermove", "pointerup"];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view = "current", exact = false) {
            const swiper = this;
            const { params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex } = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const { snapGrid, params } = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate = true) {
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance = true, cleanStyles = true) {
            const swiper = this;
            const { params, $el, $wrapperEl, slides } = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([Resize, Observer]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation({ swiper, extendParams, on, emit }) {
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const { $nextEl, $prevEl } = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const { $nextEl, $prevEl } = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const { $nextEl, $prevEl } = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const { $nextEl, $prevEl } = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function initSliders() {
        if (document.querySelector(".projects")) new core(".projects", {
            modules: [Navigation],
            observer: true,
            observeParents: false,
            slidesPerView: "auto",
            spaceBetween: 24,
            speed: 1e3,
            loop: true,
            loopedSlides: 1,
            watchOverflow: true,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            effect: "fade",
            autoplay: {
                delay: 2e3,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    allowTouchMove: true,
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                768: {},
                992: {
                    allowTouchMove: false,
                    spaceBetween: 20
                },
                1268: {
                    allowTouchMove: false,
                    spaceBetween: 24
                },
                1550: {
                    allowTouchMove: false,
                    spaceBetween: 24
                }
            },
            on: {}
        });
        if (document.querySelector(".gallerySlider")) new core(".gallerySlider", {
            modules: [Navigation],
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 20,
            speed: 1e3,
            loop: true,
            loopedSlides: 1,
            watchOverflow: false,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            effect: "fade",
            autoplay: {
                delay: 2e3,
                disableOnInteraction: false
            },
            pagination: {
                el: ".controls-slider-main__dotts",
                clickable: true
            },
            navigation: {
                prevEl: ".swiper-gallery-button-prev",
                nextEl: ".swiper-gallery-button-next"
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
        if (document.querySelector(".review")) new core(".review", {
            modules: [Navigation],
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 24,
            speed: 1e3,
            loop: true,
            loopedSlides: 2,
            watchOverflow: true,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            effect: "fade",
            autoplay: {
                delay: 2e3,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function (e) {
        initSliders();
    }));
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function (e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function () {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function (item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function (item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function (arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const animItems = document.querySelectorAll("._anim-items");
    if (animItems.length > 0) {
        window.addEventListener("scroll", animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) animItemPoint = window.innerHeight - window.innerHeight / animStart;
                if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) animItem.classList.add("_active"); else if (!animItem.classList.contains("_anim-no-hide")) animItem.classList.remove("_active");
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout((() => {
            animOnScroll();
        }), 300);
    }
    const animActive = document.querySelectorAll("._anim-active");
    if (animActive.length > 0) {
        window.addEventListener("scroll", animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animActive.length; index++) {
                const animItem = animActive[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 2;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) animItemPoint = window.innerHeight - window.innerHeight / animStart;
                if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) animItem.classList.add("_active"); else if (!animItem.classList.contains("_anim-no-hide")) animItem.classList.remove("_active");
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
    }
    let intervalId;
    document.querySelectorAll(".tabs__item").forEach((e => {
        e.addEventListener("click", (e => {
            const menu = e.currentTarget.dataset.path;
            document.querySelectorAll(".tabs__image").forEach((e => {
                if (!document.querySelector(`[data-target=${menu}]`).classList.contains("active")) {
                    e.classList.remove("active");
                    intervalId = setTimeout((() => {
                        document.querySelector(`[data-target=${menu}]`).classList.add("active");
                    }), 0);
                }
            }));
            document.querySelectorAll(".tabs__item").forEach((e => {
                if (!document.querySelector(`[data-path=${menu}]`).classList.contains("active")) {
                    e.classList.remove("active");
                    intervalId = setTimeout((() => {
                        document.querySelector(`[data-path=${menu}]`).classList.add("active");
                    }), 0);
                }
            }));
        }));
    }));
    function createReviewsSlide() {
        const dataSlide = [{
            photo: '<img src="img/feedbackAutorIcon/Photo1.png" alt="">',
            name: "Авралеева И. В.",
            role: "Управляющая персоналом",
            content: "...Особенно хотелось бы отметить высокое качество продукции, которое на протяжении всего периода эксплуатации зарекомендовало себя с лучшей стороны",
            company: "ООО “Паркс”, г. Тольятти",
            link: "#"
        }, {
            photo: '<img src="img/feedbackAutorIcon/Photo2.png" alt="">',
            name: "Комарова М.А.",
            role: "Управляющая парком",
            content: "“...Продукция была доставлена вовремя. Менеджеры монтажники проявили доброжелательность в решении наших вопросов, поэтому мы планируем дальше сотрудничать с Вами.<br><br>Также благодарим Вас за оказание информационной поддержки и помощь в открытии парка.”",
            company: "ООО “Батутный центр”, г. Саранск",
            link: "#"
        }, {
            photo: '<img src="img/feedbackAutorIcon/Photo3.png" alt="">',
            name: "Петров Г. В.",
            role: "Управляющая парком",
            content: "“...Продукция была доставлена вовремя. Менеджеры монтажники проявили доброжелательность в решении наших вопросов, поэтому мы планируем дальше сотрудничать с Вами.<br><br>Также благодарим Вас за оказание информационной поддержки и помощь в открытии парка.”",
            company: "ООО “Батутный центр”, г. Таганрог",
            link: "#"
        }];
        let slide = "";
        let reviewsWrapperOfSlider = document.getElementById("reviewsWrapperSlider");
        dataSlide.forEach((data => {
            slide += `\n\t\t<div class="slide swiper-slide">\n\t\t\t<div class="slide__head">\n\t\t\t\t\t\t\t<div class="slide__photo">${data.photo}</div>\n\t\t\t\t\t\t\t<div class="slide__autor">\n\t\t\t\t\t\t\t\t<div class="slide__name">${data.name}</div>\n\t\t\t\t\t\t\t\t<div class="slide__role">${data.role}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="slide__content">\n\t\t\t\t\t\t${data.content}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="slide__footer">\n\t\t\t\t\t\t\t<div class="slide__company">${data.company}</div>\n\t\t\t\t\t\t\t<a href="${data.link}" data-popup="#doc" class="slide__btn"><img src="img/Document.svg" alt=""></a>\n\t\t\t\t\t\t</div>\n\t\t</div>\n\t\t`;
        }));
        reviewsWrapperOfSlider.insertAdjacentHTML("afterbegin", slide);
    }
    createReviewsSlide();
    function createUsProjectSlide() {
        const dataSlide = [{
            photo: '<img src="img/usProjectCard/Olympus.png" alt="">',
            title: 'ТРЦ "Олимп"',
            place: "Сочи",
            square: "2202"
        }, {
            photo: '<img src="img/usProjectCard/Sofia.png" alt="">',
            title: 'ТРЦ "София"',
            place: "Москва",
            square: "3700"
        }, {
            photo: '<img src="img/usProjectCard/City-park.png" alt="">',
            title: 'ТРЦ "Сити-Парк"',
            place: "Саранск",
            square: "3700"
        }, {
            photo: '<img src="img/usProjectCard/Planet.png" alt="">',
            title: 'ТРЦ "Планета"',
            place: "Красноярск",
            square: "3200"
        }];
        let slide = "";
        let projectWrapperOfSlider = document.getElementById("projectWrapperSlider");
        dataSlide.forEach((data => {
            slide += `\t\n\t\t\t \n\t\t\t\t\t \n\t\t\t\t\t\t\t<div class="usProject-point swiper-slide">\n\t\t\t\t\t\t\t\t<div class="usProject-point__head">\n\t\t\t\t\t\t\t\t\t<div class="usProject-point__photo">${data.photo}</div>\n\t\t\t\t\t\t\t\t\t<a class="usProject-point__btn" data-popup="#gallery"   href="#"><svg width="61" height="53" viewBox="0 0 61 53" fill="none"\n\t\t\t\t\t\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\t\t\t\td="M36.7694 0L60.2812 26.2335L34.1847 52.1206L28.5814 46.4107L45.2834 30.0202L0 30.0202V22.0202L45.7622 22.0202L30.812 5.33937L36.7694 0Z"\n\t\t\t\t\t\t\t\t\t\t\t\tfill="white" />\n\t\t\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="usProject-point__content">\n\n\t\t\t\t\t\t\t\t\t<div class="usProject-point__title">${data.title}</div>\n\t\t\t\t\t\t\t\t\t<div class="usProject-point__location">\n\t\t\t\t\t\t\t\t\t\t<div class="usProject-point__place">\n\t\t\t\t\t\t\t\t\t\t\t<svg width="30" height="32" viewBox="0 0 30 32" fill="none"\n\t\t\t\t\t\t\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\t\t\t\t\td="M14.9999 19.0758C17.7232 19.0758 19.9309 16.9119 19.9309 14.2425C19.9309 11.5731 17.7232 9.40918 14.9999 9.40918C12.2765 9.40918 10.0688 11.5731 10.0688 14.2425C10.0688 16.9119 12.2765 19.0758 14.9999 19.0758Z"\n\t\t\t\t\t\t\t\t\t\t\t\t\tstroke="#61C9C2" stroke-width="3" />\n\t\t\t\t\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\t\t\t\t\td="M24.1926 22.9254L17.2977 29.5821C16.6884 30.1699 15.8622 30.5 15.0008 30.5C14.1394 30.5 13.3133 30.1699 12.7039 29.5821L5.80738 22.9254C3.98936 21.1701 2.7513 18.9338 2.24975 16.4992C1.74819 14.0646 2.00568 11.541 2.98964 9.24771C3.97359 6.95437 5.63984 4.99424 7.77766 3.61516C9.91548 2.23608 12.4289 1.5 15 1.5C17.5711 1.5 20.0845 2.23608 22.2223 3.61516C24.3602 4.99424 26.0264 6.95437 27.0104 9.24771C27.9943 11.541 28.2518 14.0646 27.7503 16.4992C27.2487 18.9338 26.0106 21.1701 24.1926 22.9254V22.9254Z"\n\t\t\t\t\t\t\t\t\t\t\t\t\tstroke="#61C9C2" stroke-width="3" />\n\t\t\t\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t\t\t\t\t${data.place}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class="usProject-point__square">${data.square} м<sup>2</sup></div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t \n\t\t`;
        }));
        projectWrapperOfSlider.insertAdjacentHTML("afterbegin", slide);
    }
    createUsProjectSlide();
    const dataProjectContent = [{
        title: "Ванана парк. Москва.",
        informationItem: {
            cityName: "Москва",
            square: "3700",
            capacity: "30",
            Implementation: "6 месяцев"
        },
        description: "Выше реализованные, уже открытые наши парки – их нужно круто показать в разделе реализованные проекты. Т.е мы показываем, что мы уже имеем крутой опыт открывать , производить, устанавливать и главное, эксплуатировать, развлекательные центры."
    }];
    let dataProjectContentInner = "";
    let projectContentInner = document.getElementById("projectContent");
    dataProjectContent.forEach((data => {
        dataProjectContentInner += `\n\t\t<div class="project-content__wrap">\n\t\t<button data-close type="button" class="popup__close gallery-close"><img src="img/Close-sea-blue.svg" alt=""></button>\n\t\t\t\t\t<div class="project-content__container">\n\t\t\t\t\t\t<div class="project-content__title">${data.title}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="gallery__slider gallerySlider">\n\t\t\t\t<div class="gallery__wrapper swiper-wrapper">\n\t\t\t\t\t<div class="gallery__slide swiper-slide">\n\t\t\t\t\t\t<img src="img/usProjectCard/444.png" alt="">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="gallery__slide swiper-slide">\n\t\t\t\t\t\t<img src="img/usProjectCard/444.png" alt="">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="gallery__slide swiper-slide">\n\t\t\t\t\t\t<img src="img/usProjectCard/444.png" alt="">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="gallery__slide swiper-slide">\n\t\t\t\t\t\t<img src="img/usProjectCard/444.png" alt="">\n\t\t\t\t\t</div>\n\n\n\t\t\t\t</div>\n\t\t\t\t<button type="button" class="swiper-gallery-button-prev"><img src="img/circle-left.svg" alt="">\n\t\t\t\t</button>\n\t\t\t\t<button type="button" class="swiper-gallery-button-next"> <img src="img/circle-right.svg" alt=""></button>\n\t\t\t</div>\n\t\t\t\t\t<div class="project-content__container">\n\t\t\t\t\t\t<div class="project-content__information information-content-card">\n\t\t\t\t\t\t\t<div class="information-content-card__item">\n\t\t\t\t\t\t\t\t<div class="information-content-card__characteristic">Город</div>\n\t\t\t\t\t\t\t\t<div class="information-content-card__meaning">${data.informationItem.cityName}</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="information-content-card__item">\n\t\t\t\t\t\t\t\t<div class="information-content-card__characteristic">Вместимость</div>\n\t\t\t\t\t\t\t\t<div class="information-content-card__meaning">${data.informationItem.capacity} чел</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="information-content-card__item">\n\t\t\t\t\t\t\t\t<div class="information-content-card__characteristic">Площадь</div>\n\t\t\t\t\t\t\t\t<div class="information-content-card__meaning">${data.informationItem.square} м<sup>2</sup></div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="information-content-card__item">\n\t\t\t\t\t\t\t\t<div class="information-content-card__characteristic">Реализация</div>\n\t\t\t\t\t\t\t\t<div class="information-content-card__meaning">${data.informationItem.Implementation}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="project-content__description description-content-card">\n\t\t\t\t\t\t\t<div class="description-content-card__title">Описание проекта</div>\n\t\t\t\t\t\t\t<div class="description-content-card__text">${data.description}</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="project-content__attractions attractions-content-card">\n\t\t\t\t\t\t\t<div class="attractions-content-card__title">Основные аттракционы</div>\n\t\t\t\t\t\t\t<div class="attractions-content-card__wrap" id="attractionWrap">\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t`;
    }));
    projectContentInner.insertAdjacentHTML("afterbegin", dataProjectContentInner);
    const dataAttractionContent = [{
        image: '<img src="img/mainAttractions/bigMaze.png" alt="">',
        nameAttraction: "Большой лабиринт",
        sizeAttraction: "20,4*14,4*5,5 м"
    }, {
        image: '<img src="img/mainAttractions/colorfulNets.png" alt="">',
        nameAttraction: "Красочные сети",
        sizeAttraction: "7*5,4*3,5 м"
    }, {
        image: '<img src="img/mainAttractions/sandbox.png" alt="">',
        nameAttraction: "Песочница",
        sizeAttraction: "4*3*1,5 м"
    }, {
        image: '<img src="img/mainAttractions/smallMaze.png" alt="">',
        nameAttraction: "Малый лабиринт ",
        sizeAttraction: "6*6,4*2,95 м"
    }, {
        image: '<img src="img/mainAttractions/Абакан - батутная арена 1.png" alt="">',
        nameAttraction: "Батутная арена",
        sizeAttraction: "24*11,3*2,8 м"
    }, {
        image: '<img src="img/mainAttractions/colorfulNets.png" alt="">',
        nameAttraction: "Аттракцион Лепестки",
        sizeAttraction: "Высота 5,6 м"
    }, {
        image: '<img src="img/mainAttractions/babyZone.png" alt="">',
        nameAttraction: "Малышковая зона",
        sizeAttraction: "40 м<sup>2</sup>"
    }, {
        image: '<img src="img/mainAttractions/dryPool.png" alt="">',
        nameAttraction: "Сухой бассейн",
        sizeAttraction: "15 м<sup>2</sup>"
    }];
    let dataAttractionContentInner = "";
    let attractionWrap = document.getElementById("attractionWrap");
    dataAttractionContent.forEach((information => {
        dataAttractionContentInner += `\n\t\t\t\t\t\t\t\t<div class="attractions-content-card__item">\n\t\t\t\t\t\t\t\t\t<div class="attractions-content-card__image">\n\t\t\t\t\t\t\t\t\t\t${information.image}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="attractions-content-card__text">\n\t\t\t\t\t\t\t\t\t\t<div class="attractions-content-card__name-attraction">\n\t\t\t\t\t\t\t\t\t\t\t${information.nameAttraction}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class="attractions-content-card__size-attraction">\n\t\t\t\t\t\t\t\t\t\t\t${information.sizeAttraction}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t`;
    }));
    attractionWrap.insertAdjacentHTML("afterbegin", dataAttractionContentInner);
    function stairsIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 137,
            w: 122,
            h: 80,
            nm: "Stairs",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "stairs Outlines 2",
                parent: 2,
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 1,
                        k: [{
                            i: {
                                x: .429,
                                y: 1
                            },
                            o: {
                                x: .568,
                                y: 0
                            },
                            t: 11,
                            s: [29.5, 32.5, 0],
                            to: [2.812, -6.562, 0],
                            ti: [-2.812, 6.562, 0]
                        }, {
                            i: {
                                x: .619,
                                y: .619
                            },
                            o: {
                                x: .333,
                                y: .333
                            },
                            t: 33,
                            s: [46.375, -6.875, 0],
                            to: [0, 0, 0],
                            ti: [0, 0, 0]
                        }, {
                            i: {
                                x: .462,
                                y: 1
                            },
                            o: {
                                x: .498,
                                y: 0
                            },
                            t: 106,
                            s: [46.375, -6.875, 0],
                            to: [-2.812, 6.562, 0],
                            ti: [2.812, -6.562, 0]
                        }, {
                            t: 123,
                            s: [29.5, 32.5, 0]
                        }],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 32.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-29.284, 15.702], [-21.93, 18.85], [-17.214, 7.835], [6.186, 17.93], [1.463, 28.964], [8.817, 32.111], [29.284, -15.695], [29.284, -15.704], [21.934, -18.852], [17.204, -7.803], [-6.196, -17.896], [-1.458, -28.964], [-8.813, -32.111]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ind: 1,
                        ty: "sh",
                        ix: 2,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-14.065, .482], [-9.345, -10.542], [14.055, -.449], [9.336, 10.576]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 2",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "mm",
                        mm: 1,
                        nm: "Merge Paths 1",
                        mn: "ADBE Vector Filter - Merge",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.716, 32.879],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 4,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "stairs Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.407],
                                y: [1]
                            },
                            o: {
                                x: [.625],
                                y: [0]
                            },
                            t: 0,
                            s: [0]
                        }, {
                            i: {
                                x: [.626],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 14,
                            s: [51]
                        }, {
                            i: {
                                x: [.399],
                                y: [1]
                            },
                            o: {
                                x: [.548],
                                y: [0]
                            },
                            t: 118,
                            s: [51]
                        }, {
                            t: 131,
                            s: [0]
                        }],
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [21, 57.76, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [20, 56.25, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-29.284, 15.702], [-21.93, 18.85], [-17.214, 7.835], [6.186, 17.93], [1.463, 28.964], [8.817, 32.111], [29.284, -15.695], [29.284, -15.704], [21.934, -18.852], [17.204, -7.803], [-6.196, -17.896], [-1.458, -28.964], [-8.813, -32.111]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ind: 1,
                        ty: "sh",
                        ix: 2,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-14.065, .482], [-9.345, -10.542], [14.055, -.449], [9.336, 10.576]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 2",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "mm",
                        mm: 1,
                        nm: "Merge Paths 1",
                        mn: "ADBE Vector Filter - Merge",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.716, 32.879],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 4,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-stairs"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    stairsIconAnimation();
    function smileIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 122,
            w: 70,
            h: 70,
            nm: "Smile",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                parent: 2,
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [29.5, 29.5, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 29.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 1,
                            k: [{
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 10,
                                s: [{
                                    i: [[-5.247, 0], [0, -5.247], [5.247, 0], [0, 5.247]],
                                    o: [[5.247, 0], [0, 5.247], [-5.247, 0], [0, -5.247]],
                                    v: [[0, -9.5], [9.5, 0], [0, 9.5], [-9.5, 0]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 11,
                                s: [{
                                    i: [[-10.722, -.122], [0, -5.247], [5.247, 0], [0, 5.247]],
                                    o: [[11.473, .131], [0, 5.247], [-5.247, 0], [0, -5.247]],
                                    v: [[-.132, 9.703], [9.5, 0], [0, 9.5], [-9.5, 0]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 36,
                                s: [{
                                    i: [[-10.722, -.122], [0, -5.247], [5.247, 0], [0, 5.247]],
                                    o: [[11.473, .131], [0, 5.247], [-5.247, 0], [0, -5.247]],
                                    v: [[-.132, 9.703], [9.5, 0], [0, 9.5], [-9.5, 0]],
                                    c: true
                                }]
                            }, {
                                t: 37,
                                s: [{
                                    i: [[-5.247, 0], [0, -5.247], [5.247, 0], [0, 5.247]],
                                    o: [[5.247, 0], [0, 5.247], [-5.247, 0], [0, -5.247]],
                                    v: [[0, -9.5], [9.5, 0], [0, 9.5], [-9.5, 0]],
                                    c: true
                                }]
                            }],
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [45.5, 19.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.411],
                                y: [1]
                            },
                            o: {
                                x: [.491],
                                y: [0]
                            },
                            t: 0,
                            s: [0]
                        }, {
                            i: {
                                x: [.411],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 11,
                            s: [23]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 36,
                            s: [23]
                        }, {
                            t: 48,
                            s: [0]
                        }],
                        ix: 10
                    },
                    p: {
                        a: 1,
                        k: [{
                            i: {
                                x: .833,
                                y: .833
                            },
                            o: {
                                x: .167,
                                y: .167
                            },
                            t: 0,
                            s: [34.975, 34.25, 0],
                            to: [0, -.417, 0],
                            ti: [0, 0, 0]
                        }, {
                            i: {
                                x: .833,
                                y: .833
                            },
                            o: {
                                x: .167,
                                y: .167
                            },
                            t: 5,
                            s: [34.975, 31.75, 0],
                            to: [0, 0, 0],
                            ti: [0, -.417, 0]
                        }, {
                            i: {
                                x: .833,
                                y: .833
                            },
                            o: {
                                x: .167,
                                y: .167
                            },
                            t: 11,
                            s: [34.975, 34.25, 0],
                            to: [0, 0, 0],
                            ti: [0, 0, 0]
                        }, {
                            i: {
                                x: .833,
                                y: .833
                            },
                            o: {
                                x: .167,
                                y: .167
                            },
                            t: 36,
                            s: [34.975, 34.25, 0],
                            to: [0, -.417, 0],
                            ti: [0, 0, 0]
                        }, {
                            i: {
                                x: .833,
                                y: .833
                            },
                            o: {
                                x: .167,
                                y: .167
                            },
                            t: 41,
                            s: [34.975, 31.75, 0],
                            to: [0, 0, 0],
                            ti: [0, -.417, 0]
                        }, {
                            t: 48,
                            s: [34.975, 34.25, 0]
                        }],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 29.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-5.247, 0], [0, -5.247], [5.247, 0], [0, 5.247]],
                                o: [[5.247, 0], [0, 5.247], [-5.247, 0], [0, -5.247]],
                                v: [[0, -9.5], [9.5, 0], [0, 9.5], [-9.5, 0]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [13.5, 19.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [3.615, -1.934], [4.1, -.044], [3.658, 1.853], [2.388, 3.333]],
                                o: [[-2.314, 3.385], [-3.616, 1.933], [-4.1, .046], [-3.657, -1.853], [0, 0]],
                                v: [[20.889, -5.576], [11.864, 2.519], [.12, 5.53], [-11.687, 2.779], [-20.889, -5.114]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.662, 49.468],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 2",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 2,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-smile"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    smileIconAnimation();
    function circleIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 96,
            w: 70,
            h: 70,
            nm: "Point",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [35, 35, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 29.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 0,
                            s: [0, 0, 100]
                        }, {
                            t: 8,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-6.139, 0], [0, -6.138], [6.139, 0], [0, 6.139]],
                                o: [[6.139, 0], [0, 6.139], [-6.139, 0], [0, -6.138]],
                                v: [[0, -11.115], [11.115, 0], [0, 11.115], [-11.115, 0]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.5, 29.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [35, 35, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 29.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 4,
                            s: [0, 0, 100]
                        }, {
                            t: 21,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-14.083, 0], [0, -14.083], [14.083, 0], [0, 14.083]],
                                o: [[14.083, 0], [0, 14.083], [-14.083, 0], [0, -14.083]],
                                v: [[0, -25.5], [25.5, 0], [0, 25.5], [-25.5, 0]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.5, 29.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-circle"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    circleIconAnimation();
    function starIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 122,
            w: 70,
            h: 70,
            nm: "Star",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [35, 35, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [27, 27, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.432, .432, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.567, .567, .333],
                                y: [0, 0, 0]
                            },
                            t: 0,
                            s: [117, 117, 100]
                        }, {
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 28,
                            s: [90, 90, 100]
                        }, {
                            i: {
                                x: [.833, .833, .833],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 58,
                            s: [117, 117, 100]
                        }, {
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 87,
                            s: [100, 100, 100]
                        }, {
                            t: 115,
                            s: [117, 117, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-3.682, -27], [-3.682, -3.682], [-27, -3.682], [-27, 4.318], [-3.682, 4.318], [-3.682, 27], [4.318, 27], [4.318, 4.318], [27, 4.318], [27, -3.682], [4.318, -3.682], [4.318, -27]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [27, 27],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [34.775, 35, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [27, 27, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.432, .432, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.567, .567, .333],
                                y: [0, 0, 0]
                            },
                            t: 6,
                            s: [117, 117, 100]
                        }, {
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 34,
                            s: [90, 90, 100]
                        }, {
                            i: {
                                x: [.432, .432, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 64,
                            s: [117, 117, 100]
                        }, {
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 93,
                            s: [90, 90, 100]
                        }, {
                            t: 121,
                            s: [117, 117, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[.225, 5.656], [16.264, 21.695], [21.921, 16.038], [5.882, -.001], [21.92, -16.039], [16.264, -21.696], [.225, -5.657], [-16.263, -22.145], [-21.92, -16.489], [-5.432, -.001], [-21.921, 16.488], [-16.264, 22.145]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [27.225, 27],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-star"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    starIconAnimation();
    function heartIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 37,
            w: 60,
            h: 60,
            nm: "Heart",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "heart Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [30, 30, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [26.5, 25, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.442, .442, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.537, .537, .333],
                                y: [0, 0, 0]
                            },
                            t: 0,
                            s: [100, 100, 100]
                        }, {
                            i: {
                                x: [.466, .466, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.515, .515, .333],
                                y: [0, 0, 0]
                            },
                            t: 17,
                            s: [90, 90, 100]
                        }, {
                            t: 36,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [.65, 1.598], [-.046, 1.724], [-.733, 1.561], [-1.297, 1.136], [-1.644, .52], [-1.715, -.183], [-1.497, -.855], [-1.029, -1.385], [-1.496, .847], [-1.71, .177], [-1.639, -.522], [-1.292, -1.133], [-.732, -1.556], [-.048, -1.718], [.643, -1.594], [0, 0], [0, 0]],
                                o: [[-1.236, -1.203], [-.65, -1.597], [.045, -1.724], [.733, -1.56], [1.298, -1.135], [1.645, -.521], [1.715, .183], [1.498, .856], [1.033, -1.374], [1.497, -.846], [1.71, -.178], [1.638, .521], [1.293, 1.133], [.732, 1.555], [.049, 1.718], [-.643, 1.595], [0, 0], [0, 0]],
                                v: [[-18.721, 1.499], [-21.581, -2.747], [-22.497, -7.781], [-21.316, -12.762], [-18.238, -16.852], [-13.777, -19.361], [-8.682, -19.874], [-3.812, -18.299], [.02, -14.904], [3.855, -18.27], [8.717, -19.822], [13.794, -19.299], [18.238, -16.792], [21.309, -12.715], [22.493, -7.753], [21.594, -2.73], [18.76, 1.514], [.02, 20.057]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ind: 1,
                        ty: "sh",
                        ix: 2,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0]],
                                o: [[0, 0], [0, 0]],
                                v: [[.02, 20.057], [-18.721, 1.499]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 2",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "mm",
                        mm: 1,
                        nm: "Merge Paths 1",
                        mn: "ADBE Vector Filter - Merge",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [26.501, 23.944],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 4,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-heart"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    heartIconAnimation();
    function fileIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 200,
            w: 60,
            h: 60,
            nm: "File",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                parent: 2,
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [23.5, 28, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [23.5, 28, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 1,
                            k: [{
                                i: {
                                    x: .667,
                                    y: 1
                                },
                                o: {
                                    x: .333,
                                    y: 0
                                },
                                t: 9,
                                s: [{
                                    i: [[0, 0], [-.614, -.961], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[.13, -8.644], [4.281, -1.406], [8.864, 6.393]],
                                    c: false
                                }]
                            }, {
                                i: {
                                    x: .667,
                                    y: 1
                                },
                                o: {
                                    x: .167,
                                    y: 0
                                },
                                t: 15,
                                s: [{
                                    i: [[0, 0], [-.818, -.243], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[-3.37, -10.144], [-8.094, 6.094], [7.364, 10.143]],
                                    c: false
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: 1
                                },
                                o: {
                                    x: .167,
                                    y: 0
                                },
                                t: 24,
                                s: [{
                                    i: [[0, 0], [-.818, -.243], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[-3.37, -10.144], [-8.094, 6.094], [7.364, 10.143]],
                                    c: false
                                }]
                            }, {
                                i: {
                                    x: .667,
                                    y: 1
                                },
                                o: {
                                    x: .167,
                                    y: 0
                                },
                                t: 28,
                                s: [{
                                    i: [[0, 0], [-.818, -.243], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[-3.37, -10.144], [-5.344, 3.969], [7.364, 10.143]],
                                    c: false
                                }]
                            }, {
                                i: {
                                    x: .667,
                                    y: 1
                                },
                                o: {
                                    x: .167,
                                    y: 0
                                },
                                t: 31,
                                s: [{
                                    i: [[0, 0], [-.818, -.243], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[-3.37, -10.144], [-8.094, 6.094], [7.364, 10.143]],
                                    c: false
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: 1
                                },
                                o: {
                                    x: .167,
                                    y: 0
                                },
                                t: 73,
                                s: [{
                                    i: [[0, 0], [-.818, -.243], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[-3.37, -10.144], [-8.094, 6.094], [7.364, 10.143]],
                                    c: false
                                }]
                            }, {
                                t: 76,
                                s: [{
                                    i: [[0, 0], [-.614, -.961], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[.13, -8.644], [4.281, -1.406], [8.864, 6.393]],
                                    c: false
                                }]
                            }],
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [33.958, 17.741],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 0,
                            s: [-15]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 11,
                            s: [0]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 73,
                            s: [0]
                        }, {
                            t: 85,
                            s: [-15]
                        }],
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [30, 29.5, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [23.5, 28, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[1.168, .349], [0, 0], [.573, 1.093], [-.357, 1.199], [0, 0], [-1.079, .601], [-1.168, -.349], [0, 0], [0, 0], [0, 0], [1.079, -.601]],
                                o: [[0, 0], [-1.168, -.349], [-.573, -1.094], [0, 0], [.357, -1.199], [1.078, -.602], [0, 0], [0, 0], [0, 0], [-.356, 1.198], [-1.078, .602]],
                                v: [[6.139, 23.615], [-15.884, 17.051], [-18.604, 14.799], [-18.942, 11.219], [-9.512, -20.41], [-7.269, -23.219], [-3.76, -23.615], [11.656, -19.02], [19.299, -4.441], [11.89, 20.41], [9.648, 23.219]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [23.294, 28.076],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-file"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    fileIconAnimation();
    function batutIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 38,
            w: 70,
            h: 54,
            nm: "Batut",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "batut Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [35, 27, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [29.5, 22.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 1,
                            k: [{
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 0,
                                s: [{
                                    i: [[-1.691, 0], [0, 0], [0, 0], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[0, 0], [0, 0], [1.69, 0], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [.375, -18.5], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 13,
                                s: [{
                                    i: [[-3.625, .25], [-12.75, .5], [-4.625, .25], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[3.625, -.25], [12.75, -.5], [4.625, -.25], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [-.25, -12.25], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 27,
                                s: [{
                                    i: [[-1.691, 0], [0, 0], [0, 0], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[0, 0], [0, 0], [1.69, 0], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [.375, -18.5], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 37,
                                s: [{
                                    i: [[-1.691, 0], [0, 0], [0, 0], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[0, 0], [0, 0], [1.69, 0], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [.375, -18.5], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 52,
                                s: [{
                                    i: [[-3.625, .25], [-12.75, .5], [-4.625, .25], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[3.625, -.25], [12.75, -.5], [4.625, -.25], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [-.25, -12.25], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                i: {
                                    x: .833,
                                    y: .833
                                },
                                o: {
                                    x: .167,
                                    y: .167
                                },
                                t: 66,
                                s: [{
                                    i: [[-1.691, 0], [0, 0], [0, 0], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[0, 0], [0, 0], [1.69, 0], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [.375, -18.5], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }, {
                                t: 83,
                                s: [{
                                    i: [[-1.691, 0], [0, 0], [0, 0], [-1.195, -1.156], [0, -1.636], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [2.39, 2.313], [3.382, 0], [2.391, -2.313], [0, -3.271], [0, 0], [.598, -.578], [.845, 0], [0, 0], [.597, .578], [0, .817], [0, 0], [-1.195, 1.157]],
                                    o: [[0, 0], [0, 0], [1.69, 0], [1.195, 1.157], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.846, 0], [-.598, -.578], [0, 0], [0, -3.271], [-2.392, -2.313], [-3.381, 0], [-2.391, 2.313], [0, 0], [0, .817], [-.597, .578], [0, 0], [-.845, 0], [-.598, -.578], [0, 0], [0, -1.636], [1.195, -1.156]],
                                    v: [[-19.125, -18.5], [.375, -18.5], [19.125, -18.5], [23.633, -16.694], [25.5, -12.333], [25.5, 15.417], [24.566, 17.597], [22.313, 18.5], [15.938, 18.5], [13.684, 17.597], [12.75, 15.417], [12.75, 9.25], [9.016, .529], [0, -3.083], [-9.016, .529], [-12.75, 9.25], [-12.75, 15.417], [-13.684, 17.597], [-15.937, 18.5], [-22.313, 18.5], [-24.566, 17.597], [-25.5, 15.417], [-25.5, -12.333], [-23.633, -16.694]],
                                    c: true
                                }]
                            }],
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [29.5, 22.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-batut"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    batutIconAnimation();
    function arrowIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 24,
            ip: 0,
            op: 99,
            w: 70,
            h: 45,
            nm: "Arrow",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [62, 7.75, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [59.75, 4.75, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667, .667, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.333, .333, .333],
                                y: [0, 0, 0]
                            },
                            t: 2,
                            s: [0, 0, 100]
                        }, {
                            t: 13,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0]],
                                v: [[-10.5, -10.5], [10.5, -10.5], [10.5, 10.5]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [49.5, 14.5],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [34.25, 23.5, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [32, 20.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-28.5, 16.75], [-9.5, -2.25], [2.5, 9.25], [28.5, -16.75]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 8,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [31.5, 20.75],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "tm",
                    s: {
                        a: 0,
                        k: 0,
                        ix: 1
                    },
                    e: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 0,
                            s: [0]
                        }, {
                            t: 19,
                            s: [100]
                        }],
                        ix: 2
                    },
                    o: {
                        a: 0,
                        k: 0,
                        ix: 3
                    },
                    m: 1,
                    ix: 2,
                    nm: "Trim Paths 1",
                    mn: "ADBE Vector Filter - Trim",
                    hd: false
                }],
                ip: 0,
                op: 5761,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-arr"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    arrowIconAnimation();
    function purposeIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 7,
            ip: 0,
            op: 12,
            w: 566,
            h: 500,
            nm: "icon_1",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.455],
                                    y: [1]
                                },
                                o: {
                                    x: [.571],
                                    y: [0]
                                },
                                t: 0,
                                s: [335]
                            }, {
                                t: 4,
                                s: [283]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.455],
                                    y: [1]
                                },
                                o: {
                                    x: [.571],
                                    y: [0]
                                },
                                t: 0,
                                s: [202]
                            }, {
                                t: 4,
                                s: [250]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0]],
                                o: [[0, 0], [0, 0]],
                                v: [[71.758, -71.871], [-71.757, 71.871]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.952999997606, .925, .493999974868, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 20,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [327.424, 204.09],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0]],
                                v: [[29.56, 29.607], [29.56, -29.607], [-29.56, -29.607]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.952999997606, .925, .493999974868, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 20,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [333.318, 199.84],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 2",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 2,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0]],
                                v: [[29.561, 29.607], [29.561, -29.607], [-29.56, -29.607]],
                                c: false
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "st",
                        c: {
                            a: 0,
                            k: [.952999997606, .925, .493999974868, 1],
                            ix: 3
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 4
                        },
                        w: {
                            a: 0,
                            k: 20,
                            ix: 5
                        },
                        lc: 1,
                        lj: 1,
                        ml: 4,
                        bm: 0,
                        nm: "Stroke 1",
                        mn: "ADBE Vector Graphic - Stroke",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [373.88, 159.214],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 3",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 3,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.419, .419, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 0,
                            s: [100, 100, 100]
                        }, {
                            i: {
                                x: [.833, .833, .833],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 2,
                            s: [100, 100, 100]
                        }, {
                            i: {
                                x: [.419, .419, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 5,
                            s: [108, 108, 100]
                        }, {
                            i: {
                                x: [.833, .833, .833],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 7,
                            s: [100, 100, 100]
                        }, {
                            i: {
                                x: [.419, .419, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.167, .167, .167],
                                y: [0, 0, 0]
                            },
                            t: 9,
                            s: [108, 108, 100]
                        }, {
                            t: 11,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-14.31, -.961], [.922, -14.665], [14.31, .961], [-.922, 14.666]],
                                o: [[14.31, .96], [-.922, 14.629], [-14.311, -.96], [.922, -14.629]],
                                v: [[1.679, -26.523], [25.91, 1.773], [-1.677, 26.523], [-25.909, -1.773]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [259.679, 270.379],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-25.301, -1.736], [1.623, -25.895], [25.338, 1.7], [-1.623, 25.895]],
                                o: [[25.301, 1.737], [-1.623, 25.895], [-25.301, -1.736], [1.66, -25.932]],
                                v: [[2.951, -46.878], [45.844, 3.14], [-2.951, 46.914], [-45.844, -3.103]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [1, 1, 1, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [259.698, 270.379],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 2",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 2,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-39.279, -2.697], [2.545, -40.191], [39.317, 2.696], [-2.545, 40.191]],
                                o: [[39.279, 2.697], [-2.545, 40.191], [-39.316, -2.697], [2.508, -40.229]],
                                v: [[4.574, -72.791], [71.146, 4.858], [-4.61, 72.792], [-71.145, -4.857]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [259.698, 270.397],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 3",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 3,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-51.008, -3.509], [3.283, -52.198], [51.006, 3.472], [-3.282, 52.196]],
                                o: [[51.006, 3.472], [-3.283, 52.196], [-51.045, -3.509], [3.283, -52.198]],
                                v: [[5.938, -94.494], [92.389, 6.318], [-5.938, 94.531], [-92.39, -6.316]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [1, 1, 1, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [259.699, 270.379],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 4",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 4,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-69.817, -4.765], [4.5, -71.407], [69.818, 4.765], [-4.5, 71.405]],
                                o: [[69.818, 4.765], [-4.5, 71.405], [-69.817, -4.765], [4.499, -71.444]],
                                v: [[8.151, -129.329], [126.431, 8.608], [-8.151, 129.329], [-126.431, -8.606]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [259.699, 270.379],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 5",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 5,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-bigPurpose"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    purposeIconAnimation();
    function rocketIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 15,
            ip: 0,
            op: 18,
            w: 566,
            h: 500,
            nm: "icon_2",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 0,
                            s: [0]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 2,
                            s: [11]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 4,
                            s: [0]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 6,
                            s: [11]
                        }, {
                            t: 8,
                            s: [0]
                        }],
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.408],
                                    y: [1]
                                },
                                o: {
                                    x: [.591],
                                    y: [0]
                                },
                                t: 0,
                                s: [192]
                            }, {
                                t: 15,
                                s: [350]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.995],
                                    y: [1]
                                },
                                o: {
                                    x: [.005],
                                    y: [0]
                                },
                                t: 0,
                                s: [256]
                            }, {
                                t: 15,
                                s: [256]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-11.668, -44.846], [-9.903, 45.267], [11.668, 44.844], [9.902, -45.268]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [1, 1, 1, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [250.747, 257.548],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-11.668, -44.845], [-9.904, 45.267], [11.668, 44.844], [9.902, -45.267]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [1, 1, 1, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [271.452, 257.118],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 2",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 2,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-.349, -17.549], [-17.483, .327], [0, 0]],
                                o: [[.349, 17.548], [0, 0], [-17.483, .328]],
                                v: [[-15.955, .459], [16.305, 31.627], [15.061, -31.954]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [1, 1, 1, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [209.619, 257.283],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 3",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 3,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-29.442, .589], [-1.025, -52.449], [51.402, -2.467], [18.269, 21.849], [14.471, -.284], [.436, 23.179], [-23.072, .459], [-9.101, 11.633]],
                                o: [[52.166, -1.048], [1.027, 51.707], [-30.774, 1.484], [-9.32, -11.153], [-23.071, .458], [-.459, -23.202], [14.71, -.305], [16.895, -21.565]],
                                v: [[26.999, -95.098], [123.318, -2.051], [33.415, 94.661], [-43.479, 60.895], [-81.303, 44.025], [-123.886, 2.882], [-82.94, -39.943], [-45.378, -58.865]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.952999997606, .925, .493999974868, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [366.052, 254.816],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 4",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 4,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [-3.121, 5.654]],
                                o: [[0, 0], [0, 0], [0, 0], [5.849, -.131], [0, 0]],
                                v: [[68.568, -28.122], [37.268, -34.89], [-68.567, 34.889], [21.663, 33.1], [36.046, 23.867]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [214.588, 330.084],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 5",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 5,
                    mn: "ADBE Vector Group",
                    hd: false
                }, {
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [-3.361, -5.544]],
                                o: [[0, 0], [0, 0], [0, 0], [5.85, -.13], [0, 0]],
                                v: [[69.757, 26.988], [38.72, 33.71], [-69.757, -31.769], [20.451, -33.581], [35.184, -24.915]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [211.63, 184.852],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 6",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 6,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [344, 250, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.425, .425, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.681, .681, .333],
                                y: [0, 0, 0]
                            },
                            t: 6,
                            s: [0, 0, 100]
                        }, {
                            t: 17,
                            s: [100, 100, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[62.391, -8.545], [-33.973, -38.251], [-17.559, -11.71], [-62.674, 4.158], [-26.618, 12.759], [-32.467, 38.251], [62.674, 4.704]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.910000011968, .372999991623, .383999992819, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [122.341, 260.306],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-bigRocket"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    rocketIconAnimation();
    function puzzlesIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 15,
            ip: 0,
            op: 21,
            w: 566,
            h: 500,
            nm: "icon_3",
            ddd: 0,
            assets: [],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Слой 1 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 0,
                                s: [187]
                            }, {
                                t: 15,
                                s: [283]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 0,
                                s: [272]
                            }, {
                                t: 15,
                                s: [254]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-.4, .401], [0, 0], [0, 0], [-.1, .1], [-.101, .2], [-.1, .101], [-.1, .101], [-.1, .1], [0, 0], [-.1, .2], [-.4, .602], [0, 0], [0, 0], [0, .1], [-.1, 0], [0, 0], [0, .1], [-.1, .501], [0, .1], [-.1, .1], [0, .1], [0, 0], [0, 0], [-.1, .502], [0, 0], [0, .201], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.1, .401], [0, 0], [0, .301], [0, 0], [.1, .1], [0, 0], [.1, .201], [0, 0], [0, 0], [.1, .3], [.1, .1], [0, 0], [0, 0], [3, 1.805], [5.402, -1.404], [.6, -.2], [0, 0], [.5, -.2], [0, 0], [0, 0], [0, 0], [0, 0], [1.1, -1.103], [0, 0], [1, -1.705], [.3, -3.009], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1.3, .803], [5.401, -1.504], [2.801, -4.915], [-10.002, -5.817], [-1.401, -.502], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.2, .1], [0, 0], [.1, .101], [0, 0], [.1, .101], [0, 0], [.3, .1], [0, 0], [.3, .201], [.1, .1], [0, 0], [.2, .1], [.201, .2], [0, 0], [0, 0], [.2, .1], [0, 0], [0, 0], [.1, .101], [0, 0], [.2, .101], [0, 0], [.1, .2], [0, 0], [0, .101], [0, 0], [0, 0], [0, 0], [0, 0], [.2, .302], [.4, .803], [0, 0], [.1, .201], [.4, 1.003], [.1, .402], [0, 0], [.1, 1.001], [0, 0], [0, 0], [0, .702], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, .3], [0, .401], [-.1, .301], [0, 0], [0, .2], [-.1, .401], [0, 0], [0, .1], [0, 0], [-.2, .201], [0, 0], [-.301, .302], [-.1, .2], [-.4, .702], [-.2, .301], [0, .101], [0, 0], [0, 0], [-.1, 0], [0, 0], [-.1, .201], [-.201, .1], [-.2, .201], [-.4, .301], [0, 0], [0, .1], [-.1, .101], [0, 0], [-.5, .401], [0, 0], [0, 0], [0, 0], [-.1, 0], [0, 0], [-.4, .201], [-.2, 0], [0, 0], [0, 0], [0, 0], [-.801, .201], [0, 0], [-.1, 0], [-1, .101], [0, 0], [-.401, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-1, -.1], [0, 0], [0, 0], [-.1, -.101], [-.2, 0], [0, 0], [-.2, 0], [0, 0], [-1.2, -.403], [0, 0], [-.3, -.201], [-.3, -.1], [0, 0], [-.2, -.1], [-.9, -.502], [0, 0], [0, 0], [0, 0], [-.8, -.602], [0, 0], [-.2, -.201], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [0, 0], [.4, -.301], [0, 0], [0, 0], [.1, -.101], [.1, -.1], [.2, -.201], [.1, -.1], [.1, -.1], [0, 0], [.1, -.2], [.3, -.401], [0, 0], [0, -.1], [0, -.101], [0, 0], [0, 0], [0, -.1], [.2, -.502], [0, -.101], [0, -.101], [0, -.101], [0, 0], [0, 0], [.1, -.501], [0, 0], [0, -.201], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, -.401], [0, 0], [0, -.301], [0, 0], [0, -.1], [0, 0], [-.1, -.101], [0, -.1], [0, 0], [-.1, -.301], [-.1, -.201], [0, 0], [0, 0], [-1.8, -3.009], [-4.801, -2.809], [-.6, .201], [0, 0], [-.6, .201], [0, 0], [0, 0], [0, 0], [0, 0], [-1.3, .803], [0, 0], [-1.401, 1.304], [-1.5, 2.608], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-1.1, -1.003], [-4.801, -2.808], [-5.401, 1.404], [-5.801, 9.929], [1.2, .701], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-.2, -.102], [0, 0], [-.1, -.1], [0, 0], [-.1, -.099], [0, 0], [-.3, -.099], [0, 0], [-.3, -.201], [-.2, -.1], [0, 0], [-.2, -.101], [-.2, -.102], [0, 0], [0, 0], [-.2, -.1], [0, 0], [0, 0], [-.2, -.101], [0, 0], [-.1, -.101], [0, 0], [-.2, -.2], [0, 0], [0, -.1], [0, 0], [0, 0], [0, 0], [0, 0], [-.2, -.301], [-.4, -.701], [0, 0], [-.1, -.201], [-.4, -.802], [-.2, -.501], [0, 0], [-.3, -1.103], [0, 0], [0, 0], [-.1, -.602], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, -.301], [0, -.2], [0, -.201], [0, 0], [0, -.201], [0, -.201], [0, 0], [0, -.201], [0, 0], [.1, -.202], [0, 0], [.2, -.3], [.1, -.199], [.5, -.903], [.2, -.301], [.1, -.1], [0, 0], [0, 0], [0, 0], [0, 0], [.1, -.101], [.2, -.201], [.2, -.202], [.3, -.301], [0, 0], [0, 0], [.2, -.102], [0, 0], [.4, -.401], [0, 0], [0, 0], [0, 0], [.1, 0], [0, 0], [.2, -.1], [.1, 0], [0, 0], [0, 0], [0, 0], [.7, -.2], [0, 0], [.1, 0], [.8, -.2], [0, 0], [.4, -.1], [0, 0], [0, 0], [0, 0], [0, 0], [1.1, 0], [0, 0], [0, 0], [.1, 0], [.2, 0], [0, 0], [.2, 0], [0, 0], [1.2, .301], [0, 0], [.3, .101], [.3, .1], [0, 0], [.2, .1], [.7, .3], [.1, 0], [0, 0], [0, 0], [1, .601], [0, 0], [.2, .1], [0, 0], [0, 0], [0, 0]],
                                v: [[82.767, -16.999], [78.866, -19.105], [42.359, -40.468], [41.659, -40.869], [50.361, -46.185], [51.561, -47.188], [51.76, -47.388], [52.76, -48.391], [53.061, -48.692], [53.361, -49.093], [53.762, -49.595], [54.062, -49.896], [54.361, -50.297], [54.562, -50.598], [54.962, -51.099], [55.962, -52.604], [56.161, -53.005], [56.262, -53.205], [56.361, -53.406], [56.462, -53.506], [57.161, -55.011], [57.262, -55.211], [57.762, -56.615], [57.861, -56.916], [58.062, -57.317], [58.161, -57.618], [58.161, -57.719], [58.161, -57.819], [58.562, -59.424], [58.562, -59.624], [58.663, -60.126], [58.762, -61.129], [58.762, -61.429], [58.762, -61.831], [58.762, -62.533], [58.762, -64.037], [58.663, -65.14], [58.562, -65.943], [58.463, -66.946], [57.962, -69.052], [57.861, -69.252], [57.562, -70.255], [57.361, -70.757], [57.262, -70.957], [57.062, -71.459], [56.661, -72.361], [56.361, -72.863], [56.262, -72.963], [55.962, -73.665], [48.661, -80.886], [32.956, -82.993], [31.057, -82.391], [30.857, -82.291], [29.157, -81.589], [29.057, -81.589], [28.956, -81.488], [28.757, -81.288], [28.056, -80.987], [24.355, -78.279], [24.056, -77.978], [20.454, -73.465], [17.654, -64.839], [16.754, -55.412], [16.554, -55.512], [-21.153, -77.677], [-39.357, -46.486], [-44.858, -51.4], [-48.459, -54.008], [-64.262, -56.114], [-76.965, -46.385], [-69.363, -17.802], [-65.362, -15.996], [-58.361, -13.589], [-78.065, 21.112], [23.055, 84.397], [26.156, 79.082], [35.458, 63.436], [35.258, 63.436], [34.058, 62.835], [33.458, 62.534], [33.157, 62.433], [32.757, 62.232], [32.657, 62.232], [32.257, 62.032], [31.657, 61.73], [30.857, 61.33], [30.757, 61.23], [29.857, 60.728], [29.357, 60.428], [29.257, 60.428], [28.757, 60.127], [28.156, 59.726], [27.656, 59.726], [26.156, 58.221], [25.656, 57.82], [25.355, 57.619], [24.756, 57.018], [24.355, 56.616], [23.055, 55.313], [22.655, 54.911], [22.055, 54.209], [21.655, 53.708], [20.855, 52.705], [20.755, 52.504], [20.555, 52.304], [20.355, 52.003], [20.155, 51.802], [19.855, 51.301], [19.255, 50.397], [17.954, 48.091], [17.654, 47.59], [17.354, 46.988], [16.254, 44.28], [15.754, 42.775], [15.354, 41.572], [14.754, 38.564], [14.754, 38.363], [14.654, 37.962], [14.454, 36.056], [14.454, 35.655], [14.454, 35.154], [14.454, 34.351], [14.454, 33.648], [14.454, 32.345], [14.454, 31.643], [14.554, 30.139], [14.554, 29.738], [14.654, 28.935], [14.754, 28.033], [14.954, 27.23], [14.954, 27.13], [15.054, 26.629], [15.254, 25.726], [15.454, 24.924], [15.554, 24.422], [17.554, 19.307], [17.954, 18.605], [18.054, 18.404], [18.655, 17.4], [18.954, 16.8], [20.454, 14.393], [21.055, 13.59], [21.255, 13.289], [21.855, 12.487], [22.155, 12.186], [22.255, 12.086], [22.655, 11.584], [22.954, 11.183], [23.456, 10.682], [23.956, 10.18], [24.956, 9.278], [25.355, 8.977], [25.456, 8.877], [25.855, 8.475], [26.355, 8.074], [27.756, 6.971], [27.855, 6.871], [29.857, 5.467], [31.956, 4.363], [32.157, 4.263], [33.358, 3.661], [34.357, 3.26], [34.758, 3.16], [34.858, 3.16], [36.058, 2.658], [36.258, 2.658], [38.459, 1.956], [38.659, 1.956], [38.959, 1.855], [41.758, 1.354], [42.359, 1.254], [43.56, 1.154], [44.16, 1.154], [44.66, 1.154], [45.66, 1.154], [46.46, 1.154], [49.661, 1.254], [50.76, 1.354], [51.161, 1.354], [51.561, 1.455], [52.26, 1.555], [52.361, 1.555], [53.061, 1.655], [53.562, 1.756], [57.161, 2.759], [57.962, 3.059], [58.863, 3.461], [59.863, 3.862], [59.963, 3.962], [60.562, 4.263], [62.963, 5.467], [63.163, 5.566], [63.864, 5.868], [64.163, 6.169], [66.864, 8.074], [67.163, 8.375], [67.764, 8.877], [67.864, 8.977], [80.167, -12.386]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.952999997606, .925, .493999974868, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [187.796, 272.202],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Слой 4 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 5,
                                s: [367]
                            }, {
                                t: 20,
                                s: [291]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 5,
                                s: [238]
                            }, {
                                t: 20,
                                s: [246]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[-1.5, -.902], [-2.301, -8.424], [4.401, -7.622], [4.501, -2.808], [0, 0], [0, 0], [.501, -.201], [9.402, 5.416], [0, 0], [.1, .1], [1, .803], [0, 0], [.2, .201], [0, 0], [0, 0], [0, 0], [1.399, -1.805], [.099, -.2], [.3, -.402], [.2, -.4], [.099, 0], [-2.901, -6.118], [0, 0], [-.099, -.1], [0, 0], [0, 0], [-.5, -.603], [0, 0], [-.5, -.502], [-1.6, -1.003], [0, 0], [-.1, -.1], [0, 0], [-.3, -.099], [0, 0], [-.4, -.2], [-.5, -.101], [-4, 1.103], [0, 0], [-.1, 0], [0, 0], [-.9, .502], [-.2, .102], [0, 0], [-.3, .201], [-.2, .099], [0, 0], [-.2, .1], [-.1, .099], [-.2, .1], [0, 0], [-.3, .202], [-1, 1.605], [-.3, 3.009], [0, 0], [0, 0], [0, 0], [0, 0], [-6.901, 11.835], [11.302, 7.622], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[7.601, 4.413], [2.2, 8.425], [-2.6, 4.614], [0, 0], [0, 0], [-.5, .301], [-9.702, 4.613], [0, 0], [-.1, -.1], [-1.1, -.702], [0, 0], [-.201, -.201], [0, 0], [0, 0], [0, 0], [-1.3, .902], [-.201, .301], [-.301, .402], [-.099, .201], [0, 0], [-3.302, 5.918], [0, 0], [.101, .1], [0, 0], [0, 0], [.299, .502], [0, 0], [.4, .501], [1.199, 1.304], [0, 0], [.1, .102], [0, 0], [.2, .101], [0, 0], [.401, .2], [.4, .201], [3.701, 1.304], [0, 0], [.1, 0], [0, 0], [.9, -.299], [.2, -.1], [0, 0], [.4, -.202], [.1, -.1], [0, 0], [.3, -.2], [.2, -.1], [.2, -.101], [0, 0], [.3, -.301], [1.3, -1.303], [1.5, -2.608], [0, 0], [0, 0], [0, 0], [0, 0], [12.203, 6.118], [6.901, -11.834], [0, 0], [0, 0], [0, 0], [0, 0], [1.6, .703]],
                                v: [[-34.156, -57.068], [-18.954, -37.21], [-22.255, -12.336], [-33.156, -1.003], [-33.357, -.802], [-34.557, -.201], [-36.057, .501], [-66.464, -.702], [-66.863, -1.003], [-67.164, -1.203], [-70.264, -3.41], [-70.664, -3.71], [-71.264, -4.212], [-85.967, 21.061], [-45.859, 44.432], [-53.461, 49.846], [-57.76, 54.159], [-58.26, 54.861], [-59.161, 56.065], [-59.661, 56.867], [-59.76, 56.967], [-60.462, 76.122], [-60.362, 76.323], [-60.161, 76.724], [-60.062, 76.824], [-59.76, 77.427], [-58.562, 79.133], [-58.462, 79.232], [-57.26, 80.737], [-53.161, 84.146], [-53.061, 84.246], [-52.661, 84.547], [-52.361, 84.748], [-51.661, 85.149], [-51.061, 85.451], [-49.96, 85.951], [-48.56, 86.453], [-36.758, 86.755], [-36.258, 86.555], [-35.858, 86.453], [-35.656, 86.352], [-32.957, 85.25], [-32.357, 84.948], [-32.156, 84.849], [-30.957, 84.146], [-30.456, 83.846], [-30.156, 83.645], [-29.456, 83.143], [-29.056, 82.844], [-28.556, 82.441], [-28.355, 82.24], [-27.456, 81.438], [-23.954, 77.026], [-21.155, 68.401], [-20.254, 58.974], [22.555, 84.146], [37.857, 57.77], [42.858, 60.276], [76.766, 50.146], [68.865, 15.546], [64.163, 12.436], [85.967, -25.073], [-22.255, -87.857], [-38.858, -59.374]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.380000005984, .788000009574, .760999971278, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [372.033, 230.43],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 3,
                ty: 4,
                nm: "Слой 3 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 0,
                                s: [335]
                            }, {
                                t: 15,
                                s: [289]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 0,
                                s: [318]
                            }, {
                                t: 15,
                                s: [258]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, .1], [.4, .401], [0, 0], [.2, .099], [0, 0], [0, .1], [0, .1], [0, 0], [.1, .1], [.8, .401], [0, 0], [.5, .301], [.2, .1], [.2, .1], [.201, 0], [0, 0], [.9, .1], [0, 0], [.1, .101], [.1, .1], [.1, .101], [0, 0], [0, 0], [.8, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.4, -.1], [0, 0], [.1, 0], [.3, -.102], [.2, -.101], [.1, -.1], [0, 0], [.1, -.1], [0, 0], [.2, -.1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.1, -.099], [0, 0], [.2, -.1], [.1, -.1], [.2, -.201], [0, 0], [.1, -.1], [0, 0], [0, 0], [0, -.1], [.1, -.2], [.1, -.1], [0, 0], [.3, -.501], [0, 0], [.1, -.199], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, -.201], [0, 0], [0, 0], [0, 0], [0, 0], [0, -.301], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, -.402], [0, 0], [0, 0], [-.2, -.702], [0, 0], [-.1, -.201], [0, 0], [-.2, -.501], [0, 0], [0, -.102], [0, -.201], [-.2, -.501], [0, 0], [0, -.099], [0, 0], [0, 0], [-.1, -.101], [0, 0], [-.1, 0], [-.1, -.1], [0, 0], [-.1, -.201], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-.2, -.1], [0, 0], [-.1, 0], [-.2, -.101], [0, 0], [-.2, -.101], [0, 0], [0, 0], [0, 0], [-.1, -.1], [-.3, -.102], [0, 0], [-.1, 0], [0, 0], [-1.001, -.201], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-7.101, 12.136], [-13.403, -2.607], [0, 0], [0, 0], [0, 0], [0, 0], [9.702, -2.607], [8.702, 5.016], [0, 0], [3.101, 4.915], [0, 0], [0, 0], [.4, .803], [0, 0], [0, 0], [0, 0], [-3.7, 9.226], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                o: [[0, 0], [0, 0], [0, 0], [-.1, -.1], [-.2, -.301], [0, 0], [-.1, -.1], [0, 0], [-.1, -.102], [-.1, -.1], [0, 0], [-.1, -.101], [-.601, -.401], [0, 0], [-.4, -.202], [-.2, -.101], [-.2, -.1], [-.2, -.101], [0, 0], [-.8, -.301], [0, 0], [-.1, 0], [-.1, 0], [-.1, 0], [0, 0], [0, 0], [-.6, -.099], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-.6, .1], [0, 0], [-.1, 0], [-.5, .1], [-.3, .099], [-.1, 0], [0, 0], [0, 0], [0, 0], [-.2, .101], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-.1, .101], [0, 0], [-.1, .1], [-.1, .1], [-.2, .201], [0, 0], [-.1, .1], [0, 0], [0, 0], [-.1, .101], [-.1, .1], [-.1, .1], [0, 0], [-.3, .501], [0, 0], [-.1, .2], [0, .1], [0, 0], [0, 0], [0, 0], [0, 0], [-.1, .2], [0, 0], [0, 0], [0, 0], [0, 0], [0, .301], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, .201], [0, 0], [0, 0], [.1, .602], [0, 0], [.1, .201], [0, 0], [.2, .702], [0, 0], [0, .1], [.1, .199], [.301, .501], [0, 0], [0, .101], [0, 0], [0, 0], [.1, .1], [0, 0], [.1, .1], [.2, .201], [0, 0], [.1, .099], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.1, .1], [0, 0], [.1, .101], [.2, .1], [0, 0], [.2, .1], [.1, 0], [0, 0], [0, 0], [.2, .101], [.3, .1], [0, 0], [.1, 0], [0, 0], [.9, .3], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-8.802, -10.532], [7.101, -12.135], [0, 0], [0, 0], [0, 0], [0, 0], [-5.001, 8.726], [-9.702, 2.608], [0, 0], [-5.101, -3.009], [0, 0], [0, 0], [-.5, -.802], [0, 0], [0, 0], [0, 0], [-4.001, -9.328], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                v: [[-37.808, -48.592], [-40.808, -43.377], [-44.409, -48.592], [-47.21, -52.403], [-47.41, -52.704], [-48.41, -53.707], [-48.81, -54.108], [-49.21, -54.408], [-49.71, -54.909], [-49.91, -55.111], [-50.11, -55.311], [-50.51, -55.612], [-50.91, -55.913], [-52.911, -57.217], [-53.511, -57.617], [-54.811, -58.32], [-55.411, -58.621], [-55.911, -58.821], [-56.512, -59.022], [-56.912, -59.123], [-59.312, -59.724], [-59.712, -59.824], [-60.112, -59.925], [-60.512, -60.025], [-60.912, -60.126], [-61.212, -60.126], [-61.713, -60.226], [-63.713, -60.325], [-65.013, -60.325], [-65.213, -60.325], [-65.413, -60.325], [-65.913, -60.325], [-66.714, -60.226], [-68.214, -59.925], [-68.414, -59.824], [-68.714, -59.724], [-70.014, -59.322], [-70.814, -59.022], [-71.014, -58.922], [-71.615, -58.721], [-71.815, -58.621], [-72.315, -58.421], [-72.915, -58.12], [-73.015, -58.019], [-74.115, -57.016], [-74.715, -57.016], [-74.915, -56.916], [-75.915, -56.214], [-76.115, -56.014], [-76.716, -55.512], [-77.116, -55.211], [-77.316, -55.011], [-77.916, -54.408], [-78.116, -54.208], [-78.316, -54.008], [-78.816, -53.405], [-78.816, -53.306], [-78.916, -53.105], [-79.216, -52.704], [-79.416, -52.403], [-79.816, -51.801], [-80.816, -50.297], [-81.617, -48.792], [-81.917, -48.291], [-82.017, -48.09], [-82.017, -47.989], [-82.017, -47.89], [-82.117, -47.589], [-82.217, -47.388], [-82.417, -46.786], [-82.417, -46.686], [-82.617, -46.084], [-82.817, -45.182], [-83.017, -44.279], [-83.117, -43.477], [-83.317, -42.273], [-83.317, -41.972], [-83.417, -41.07], [-83.417, -40.669], [-83.417, -39.465], [-83.417, -38.763], [-83.417, -38.362], [-83.417, -38.161], [-83.417, -37.76], [-83.317, -36.857], [-83.317, -36.757], [-83.317, -36.456], [-82.917, -34.651], [-82.617, -33.548], [-82.417, -32.946], [-82.417, -32.846], [-81.717, -31.141], [-81.617, -31.04], [-81.517, -30.738], [-81.317, -30.238], [-80.516, -28.734], [-80.416, -28.633], [-80.316, -28.433], [-80.016, -28.132], [-79.616, -27.329], [-79.316, -26.928], [-79.116, -26.627], [-78.916, -26.427], [-78.516, -26.026], [-78.316, -25.824], [-78.016, -25.424], [-77.716, -25.123], [-77.516, -25.123], [-76.015, -23.618], [-75.915, -23.518], [-75.215, -23.017], [-74.715, -22.716], [-74.615, -22.716], [-74.215, -22.515], [-73.615, -22.214], [-72.915, -21.813], [-72.415, -21.512], [-72.215, -21.412], [-72.115, -21.412], [-71.114, -20.911], [-70.614, -20.71], [-69.814, -20.408], [-69.514, -20.309], [-69.214, -20.209], [-68.314, -19.907], [-65.513, -19.306], [-65.213, -19.306], [-55.011, -19.306], [-60.412, -10.179], [-73.915, 12.387], [-77.216, 17.903], [-26.105, 49.897], [25.405, 79.984], [38.708, 57.219], [35.507, 19.407], [69.914, 3.661], [83.417, -19.607], [65.913, -29.837], [65.913, -29.737], [65.813, -29.536], [42.908, -11.985], [14.303, -15.796], [14.203, -15.896], [1.6, -28.031], [1.5, -28.132], [.7, -29.436], [-.6, -31.843], [-.6, -31.943], [-1.1, -32.946], [-1.1, -33.046], [-1.601, -62.03], [-2.101, -62.332], [.1, -65.943], [.1, -66.745], [1.1, -67.748], [-19.804, -79.984]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.961000031116, .952999997606, .952999997606, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [298.268, 345.015],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 4,
                ty: 4,
                nm: "Слой 2 Outlines",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 3,
                                s: [257]
                            }, {
                                t: 18,
                                s: [289]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.518],
                                    y: [1]
                                },
                                o: {
                                    x: [.493],
                                    y: [0]
                                },
                                t: 3,
                                s: [180]
                            }, {
                                t: 18,
                                s: [246]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [283, 250, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                shapes: [{
                    ty: "gr",
                    it: [{
                        ind: 0,
                        ty: "sh",
                        ix: 1,
                        ks: {
                            a: 0,
                            k: {
                                i: [[0, 0], [0, 0], [.2, -.301], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [-1.7, -1.304], [0, 0], [-.4, -.301], [0, 0], [-4.601, 2.206], [0, 0], [-.2, .1], [0, 0], [-1.3, 2.306], [0, 0], [1, 3.911], [3.601, 2.106], [2.101, .2], [0, 0], [0, 0], [0, 0], [0, 0], [-1.8, 3.109], [1.4, 5.416], [4.901, 2.808], [5.402, -1.405], [2.8, -4.914], [.1, -3.511], [0, 0], [0, 0], [0, 0], [6.902, -11.835], [13.102, 1.905], [0, 0], [0, 0], [-.1, .201], [-.2, .501], [-.3, .501], [-.3, .401], [-.801, 1.103], [-.1, .201], [0, 0], [0, 0], [-.1, .201], [0, 0], [-.2, .1], [0, 0], [0, 0], [-.1, .1], [0, 0], [-.2, .201], [-.3, .2], [0, 0], [-.2, .1], [-.5, .301], [-.2, .1], [0, 0], [0, 0], [-.1, 0], [0, 0], [-.2, 0], [-.3, .2], [-.2, 0], [-.5, .201], [-.1, 0], [-.1, 0], [-.2, .1], [-.2, .1], [-.3, .1], [-7.501, -4.313], [-2.8, -4.513], [0, 0], [0, 0], [0, -.1], [0, -.2], [-.1, -.301], [0, 0], [0, -.1], [-.1, -.301], [0, 0], [0, 0], [.2, -4.313], [0, 0], [0, 0], [0, -.301], [0, 0], [0, 0], [0, 0], [0, 0], [.1, -.1], [0, 0], [.1, -.401], [.1, -.2], [0, 0], [0, -.1], [.1, -.301], [0, -.201], [0, -.1], [.8, -1.604], [.1, -.1], [.1, -.1], [.1, -.3], [.1, 0], [0, 0], [.1, -.101], [.2, -.401], [.1, -.201], [0, 0]],
                                o: [[0, 0], [-.2, .3], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [.6, .802], [0, 0], [.4, .301], [0, 0], [4.401, 2.507], [0, 0], [.101, -.101], [0, 0], [2.299, -1.404], [0, 0], [2, -3.611], [-1.1, -4.012], [-2.001, -1.204], [0, 0], [0, 0], [0, 0], [0, 0], [3, -1.806], [2.801, -4.814], [-1.401, -5.416], [-4.801, -2.808], [-5.401, 1.404], [-1.8, 3.009], [0, 0], [0, 0], [0, 0], [8.201, 10.531], [-6.901, 11.834], [0, 0], [0, 0], [.1, -.201], [.1, -.301], [.2, -.502], [.3, -.602], [.6, -1.003], [.1, -.201], [0, 0], [0, 0], [.1, -.201], [0, 0], [.1, -.101], [0, 0], [0, 0], [.2, -.2], [0, 0], [.2, -.201], [.2, -.2], [0, 0], [.2, -.1], [.5, -.301], [.1, -.1], [0, 0], [.1, 0], [.1, 0], [0, 0], [.2, -.101], [.2, -.1], [.1, -.101], [.5, -.2], [.2, -.1], [.2, -.1], [.2, -.1], [.2, -.101], [.3, -.1], [8.402, -2.206], [4.601, 2.708], [0, 0], [0, 0], [0, .1], [.1, .1], [.1, .301], [0, 0], [0, .1], [.1, .301], [0, 0], [0, 0], [1.5, 4.112], [0, 0], [0, 0], [0, .301], [0, 0], [0, 0], [0, 0], [0, 0], [0, .1], [0, 0], [-.1, .301], [-.1, .401], [0, 0], [0, .1], [0, .1], [0, .1], [0, .1], [-.5, 1.705], [-.1, .101], [0, .1], [-.1, .301], [0, 0], [0, 0], [-.1, .1], [-.2, .301], [-.1, .1], [0, 0], [0, 0]],
                                v: [[-3.05, 69.003], [-4.35, 70.708], [-5.05, 71.61], [16.553, 84.247], [44.159, 36.808], [46.759, 40.619], [49.56, 44.531], [54.061, 50.95], [57.661, 54.46], [57.861, 54.56], [59.163, 55.463], [59.663, 55.764], [74.065, 56.165], [74.264, 56.065], [74.665, 55.864], [74.965, 55.764], [80.366, 50.248], [80.566, 49.947], [82.066, 38.313], [74.764, 28.785], [68.363, 26.679], [51.06, 25.174], [76.465, -18.454], [40.659, -39.415], [49.361, -44.63], [56.661, -52.052], [58.862, -67.898], [49.16, -80.636], [33.357, -82.842], [20.654, -73.114], [17.853, -63.084], [17.353, -52.955], [-23.354, -76.825], [-34.956, -56.866], [-32.557, -20.058], [-65.662, -4.011], [-83.066, 25.977], [-60.261, 39.316], [-60.061, 38.814], [-59.561, 37.611], [-58.861, 36.207], [-57.962, 34.602], [-55.96, 31.493], [-55.66, 30.991], [-55.46, 30.69], [-55.26, 30.49], [-54.861, 29.988], [-54.66, 29.788], [-54.26, 29.387], [-54.26, 29.487], [-53.861, 28.985], [-53.46, 28.584], [-49.66, 25.074], [-48.96, 24.472], [-48.259, 23.971], [-48.16, 23.87], [-47.66, 23.57], [-46.259, 22.667], [-45.758, 22.366], [-45.658, 22.366], [-45.458, 22.266], [-45.258, 22.165], [-44.658, 21.865], [-44.158, 21.664], [-43.358, 21.263], [-42.858, 21.062], [-41.358, 20.46], [-40.857, 20.26], [-40.257, 20.059], [-39.757, 19.859], [-39.158, 19.658], [-38.257, 19.357], [-13.553, 22.667], [-2.35, 33.599], [-2.15, 33.799], [-1.55, 35.003], [-1.451, 35.304], [-1.251, 35.805], [-.85, 36.608], [-.35, 37.711], [-.249, 38.012], [.051, 38.814], [.25, 39.215], [.35, 39.617], [2.25, 52.254], [2.25, 52.655], [2.25, 53.156], [2.15, 54.159], [2.15, 54.56], [2.15, 54.661], [2.051, 55.563], [2.051, 55.764], [1.951, 56.165], [1.85, 56.767], [1.65, 57.77], [1.451, 58.672], [1.451, 58.873], [1.35, 59.274], [1.15, 59.876], [1.051, 60.277], [.951, 60.578], [-1.049, 65.492], [-1.251, 65.793], [-1.451, 66.094], [-1.85, 66.896], [-1.951, 66.997], [-2.251, 67.398], [-2.451, 67.699], [-3.05, 68.702], [-3.251, 69.103], [-3.251, 69.003]],
                                c: true
                            },
                            ix: 2
                        },
                        nm: "Path 1",
                        mn: "ADBE Vector Shape - Group",
                        hd: false
                    }, {
                        ty: "fl",
                        c: {
                            a: 0,
                            k: [.961000031116, .952999997606, .952999997606, 1],
                            ix: 4
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 5
                        },
                        r: 1,
                        bm: 0,
                        nm: "Fill 1",
                        mn: "ADBE Vector Graphic - Fill",
                        hd: false
                    }, {
                        ty: "tr",
                        p: {
                            a: 0,
                            k: [256.21, 158.519],
                            ix: 2
                        },
                        a: {
                            a: 0,
                            k: [0, 0],
                            ix: 1
                        },
                        s: {
                            a: 0,
                            k: [100, 100],
                            ix: 3
                        },
                        r: {
                            a: 0,
                            k: 0,
                            ix: 6
                        },
                        o: {
                            a: 0,
                            k: 100,
                            ix: 7
                        },
                        sk: {
                            a: 0,
                            k: 0,
                            ix: 4
                        },
                        sa: {
                            a: 0,
                            k: 0,
                            ix: 5
                        },
                        nm: "Transform"
                    }],
                    nm: "Group 1",
                    np: 2,
                    cix: 2,
                    bm: 0,
                    ix: 1,
                    mn: "ADBE Vector Group",
                    hd: false
                }],
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 5,
                ty: 3,
                nm: "Null 2",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 0,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [309, 52, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [0, 0, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-bigPuzzles"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }
    puzzlesIconAnimation();
    function medalIconAnimation() {
        var animationData = {
            v: "5.6.2",
            fr: 30,
            ip: 0,
            op: 974,
            w: 500,
            h: 700,
            nm: "icon_4",
            ddd: 0,
            assets: [{
                id: "image_0",
                w: 269,
                h: 255,
                u: "images-bigIcon-4/",
                p: "img_0.png",
                e: 0
            }, {
                id: "image_1",
                w: 564,
                h: 563,
                u: "images-bigIcon-4/",
                p: "img_1.png",
                e: 0
            }, {
                id: "image_2",
                w: 274,
                h: 379,
                u: "images-bigIcon-4/",
                p: "img_2.png",
                e: 0
            }, {
                id: "image_3",
                w: 274,
                h: 379,
                u: "images-bigIcon-4/",
                p: "img_3.png",
                e: 0
            }],
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 2,
                nm: "icon-4-3.png",
                cl: "png",
                parent: 2,
                refId: "image_0",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 5,
                            s: [0]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 8,
                            s: [-18]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 11,
                            s: [18]
                        }, {
                            i: {
                                x: [.667],
                                y: [1]
                            },
                            o: {
                                x: [.333],
                                y: [0]
                            },
                            t: 14,
                            s: [-18]
                        }, {
                            t: 18,
                            s: [0]
                        }],
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [282, 281.5, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [134.5, 127.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 2,
                ty: 2,
                nm: "icon-4-2.png",
                cl: "png",
                refId: "image_1",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        a: 0,
                        k: [328, 438, 0],
                        ix: 2
                    },
                    a: {
                        a: 0,
                        k: [282, 281.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 1,
                        k: [{
                            i: {
                                x: [.589, .589, .667],
                                y: [1, 1, 1]
                            },
                            o: {
                                x: [.407, .407, .333],
                                y: [0, 0, 0]
                            },
                            t: 0,
                            s: [25, 25, 100]
                        }, {
                            t: 14,
                            s: [50, 50, 100]
                        }],
                        ix: 6
                    }
                },
                ao: 0,
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 3,
                ty: 2,
                nm: "icon-4-1.png",
                cl: "png",
                parent: 2,
                refId: "image_2",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.443],
                                    y: [1]
                                },
                                o: {
                                    x: [.499],
                                    y: [0]
                                },
                                t: 0,
                                s: [238]
                            }, {
                                t: 8,
                                s: [158]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.443],
                                    y: [1]
                                },
                                o: {
                                    x: [.499],
                                    y: [0]
                                },
                                t: 0,
                                s: [497.5]
                            }, {
                                t: 8,
                                s: [597.5]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [137, 189.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }, {
                ddd: 0,
                ind: 4,
                ty: 2,
                nm: "icon-4.png",
                cl: "png",
                parent: 2,
                refId: "image_3",
                sr: 1,
                ks: {
                    o: {
                        a: 0,
                        k: 100,
                        ix: 11
                    },
                    r: {
                        a: 0,
                        k: 0,
                        ix: 10
                    },
                    p: {
                        s: true,
                        x: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.443],
                                    y: [1]
                                },
                                o: {
                                    x: [.167],
                                    y: [0]
                                },
                                t: 3,
                                s: [330]
                            }, {
                                t: 11,
                                s: [410]
                            }],
                            ix: 3
                        },
                        y: {
                            a: 1,
                            k: [{
                                i: {
                                    x: [.443],
                                    y: [1]
                                },
                                o: {
                                    x: [.167],
                                    y: [0]
                                },
                                t: 3,
                                s: [497.5]
                            }, {
                                t: 11,
                                s: [597.5]
                            }],
                            ix: 4
                        }
                    },
                    a: {
                        a: 0,
                        k: [137, 189.5, 0],
                        ix: 1
                    },
                    s: {
                        a: 0,
                        k: [100, 100, 100],
                        ix: 6
                    }
                },
                ao: 0,
                ip: 0,
                op: 974,
                st: 0,
                bm: 0
            }],
            markers: []
        };
        var params = {
            container: document.getElementById("lottie-bigMedal"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        };
        lottie.loadAnimation(params);
    }

    medalIconAnimation();
    window["FLS"] = true;
    addTouchClass();
    tabs();
    pageNavigation();
})();
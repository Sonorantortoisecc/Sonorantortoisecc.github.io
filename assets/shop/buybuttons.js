/* SCC Pro Shop — Shopify Buy Button with on-site cart drawer */
(function () {
  if (window.__sccProShopInit) return;
  window.__sccProShopInit = true;

  var DOMAIN = 'stqe3x-12.myshopify.com';
  var TOKEN = 'c7e643f9d9779158dcd702a936d789ef';
  var SCRIPT_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  var STORAGE_KEY = 'scc-proshop-cart-count';

  var PRODUCTS = [
    { id: '15493216600314', nodeId: 'product-component-rope-cap' },
    { id: '15493272011002', nodeId: 'product-component-paddle' },
    { id: '15493316673786', nodeId: 'product-component-towel' },
    { id: '15495942570234', nodeId: 'product-component-socks' },
    { id: '15496193376506', nodeId: 'product-component-trunks' },
    { id: '15496753709306', nodeId: 'product-component-mens-polo' },
    { id: '15496734310650', nodeId: 'product-component-womens-polo' }
  ];

  var brandBtn = {
    'font-family': 'DM Sans, system-ui, sans-serif',
    'font-size': '12px',
    'font-weight': '600',
    'letter-spacing': '0.02em',
    'background-color': '#1b2a44',
    color: '#fffdf8',
    'border-radius': '0',
    padding: '14px 22px',
    ':hover': { 'background-color': '#d9a596', color: '#1b2a44' },
    ':focus': { 'background-color': '#d9a596', color: '#1b2a44' }
  };

  var productOptions = {
    product: {
      buttonDestination: 'cart',
      contents: {
        img: false,
        imgWithCarousel: false,
        title: false,
        variantTitle: false,
        description: false,
        price: true,
        options: true,
        quantity: false,
        button: true,
        buttonWithQuantity: false
      },
      text: { button: 'Add to cart' },
      styles: {
        product: {
          'text-align': 'left',
          'margin-bottom': '0',
          '@media (min-width: 601px)': {
            'max-width': '100%',
            'margin-left': '0',
            'margin-bottom': '0'
          }
        },
        prices: { 'margin-bottom': '12px' },
        price: {
          'font-family': 'Cinzel, Georgia, serif',
          'font-size': '22px',
          'font-weight': '600',
          color: '#1b2a44'
        },
        compareAt: { 'font-family': 'DM Sans, system-ui, sans-serif', 'font-size': '14px' },
        unitPrice: { 'font-family': 'DM Sans, system-ui, sans-serif', 'font-size': '12px' },
        options: { 'margin-bottom': '14px' },
        button: brandBtn
      }
    },
    option: {
      styles: {
        label: {
          'font-family': 'DM Sans, system-ui, sans-serif',
          'font-size': '11px',
          'letter-spacing': '0.08em',
          'text-transform': 'uppercase',
          color: '#55596a'
        },
        select: {
          'font-family': 'DM Sans, system-ui, sans-serif',
          'font-size': '14px',
          color: '#1c2230',
          'border-color': '#d8ccb7',
          'border-radius': '0'
        },
        wrapper: { 'margin-bottom': '10px' }
      }
    },
    cart: {
      startOpen: false,
      popup: true,
      contents: {
        title: true,
        lineItems: true,
        footer: true,
        note: false,
        discounts: true
      },
      text: {
        title: 'Your cart',
        empty: 'Your cart is empty.',
        button: 'Checkout',
        total: 'Subtotal',
        notice: 'Shipping and taxes calculated at Shopify checkout.',
        close: 'Close cart'
      },
      styles: {
        button: brandBtn,
        footer: { 'background-color': '#fffdf8', 'border-color': '#d8ccb7' },
        header: { 'background-color': '#fffdf8', 'border-color': '#d8ccb7' },
        cart: { 'background-color': '#fffdf8' },
        lineItems: { 'font-family': 'DM Sans, system-ui, sans-serif' },
        subtotalText: { 'font-family': 'DM Sans, system-ui, sans-serif', color: '#1b2a44' },
        subtotalPrice: { 'font-family': 'Cinzel, Georgia, serif', color: '#1b2a44' },
        title: { 'font-family': 'Cinzel, Georgia, serif', color: '#1b2a44' },
        empty: { 'font-family': 'DM Sans, system-ui, sans-serif', color: '#55596a' },
        notice: { 'font-family': 'DM Sans, system-ui, sans-serif', 'font-size': '12px', color: '#55596a' },
        close: { color: '#1b2a44' }
      },
      events: {
        afterInit: function () { syncBadgeFromCart(); wireCheckoutButton(); formatLineItemPrices(); },
        addLineItem: function () { syncBadgeFromCart(); wireCheckoutButton(); formatLineItemPrices(); },
        updateLineItem: function () { syncBadgeFromCart(); },
        removeLineItem: function () { syncBadgeFromCart(); }
      }
    },
    lineItem: {
      contents: {
        image: true,
        variantTitle: true,
        quantity: true,
        price: true,
        priceWithDiscounts: false
      }
    },
    toggle: {
      styles: {
        toggle: {
          /* Keep toggle renderable so iframe button.click() opens the cart on iOS Safari.
             Visual hide is handled by .scc-cart-toggle-host / .shopify-buy-frame--toggle CSS. */
          'background-color': 'transparent'
        }
      }
    }
  };

  function writeCount(n) {
    n = Math.max(0, parseInt(n, 10) || 0);
    try { localStorage.setItem(STORAGE_KEY, String(n)); } catch (e) {}
    document.querySelectorAll('[data-scc-cart-count]').forEach(function (el) {
      el.textContent = n > 0 ? String(n) : '';
      el.hidden = n < 1;
    });
    document.querySelectorAll('[data-scc-cart-button]').forEach(function (btn) {
      btn.setAttribute('data-count', String(n));
      btn.setAttribute('aria-label', n > 0 ? 'Open cart, ' + n + ' items' : 'Open cart');
    });
  }

  function cartIdFromStorage() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /\.checkoutId$/.test(k)) return localStorage.getItem(k);
      }
    } catch (e) {}
    return null;
  }

  var badgeFetchBusy = false;
  function syncBadgeFromCart() {
    try {
      var iframe = document.querySelector('.shopify-buy-frame--cart iframe');
      if (iframe && iframe.contentDocument) {
        var qtyInputs = iframe.contentDocument.querySelectorAll(
          'input[aria-label*="quantity" i], input.shopify-buy__quantity, input[type="number"]'
        );
        if (qtyInputs.length) {
          var sum = 0;
          qtyInputs.forEach(function (inp) { sum += parseInt(inp.value, 10) || 0; });
          writeCount(sum);
          return;
        }
      }
    } catch (e) {}

    var cartId = cartIdFromStorage();
    if (!cartId) {
      var stored = 0;
      try { stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0; } catch (e2) {}
      writeCount(stored);
      return;
    }
    if (badgeFetchBusy) return;
    badgeFetchBusy = true;
    fetch('https://' + DOMAIN + '/api/2024-10/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN
      },
      body: JSON.stringify({
        query: 'query($id:ID!){ cart(id:$id){ totalQuantity } }',
        variables: { id: cartId }
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var q = data && data.data && data.data.cart && data.data.cart.totalQuantity;
        if (typeof q === 'number') writeCount(q);
      })
      .catch(function () {})
      .finally(function () { badgeFetchBusy = false; });
  }

  function fetchCheckoutUrl() {
    var cartId = cartIdFromStorage();
    if (!cartId) return Promise.resolve(null);
    return fetch('https://' + DOMAIN + '/api/2024-10/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN
      },
      body: JSON.stringify({
        query: 'query($id:ID!){ cart(id:$id){ checkoutUrl totalQuantity } }',
        variables: { id: cartId }
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var cart = data && data.data && data.data.cart;
        if (cart && typeof cart.totalQuantity === 'number') writeCount(cart.totalQuantity);
        return cart && cart.checkoutUrl;
      })
      .catch(function () { return null; });
  }

  function goToCheckout() {
    fetchCheckoutUrl().then(function (url) {
      if (url) window.location.assign(url);
    });
  }


  function formatLineItemPrices() {
    try {
      var iframe = document.querySelector('.shopify-buy-frame--cart iframe');
      if (!iframe || !iframe.contentDocument) return;
      var doc = iframe.contentDocument;
      if (!doc.getElementById('scc-line-price-style')) {
        var style = doc.createElement('style');
        style.id = 'scc-line-price-style';
        style.textContent =
          '.shopify-buy__cart-item__price{display:flex!important;flex-wrap:wrap;align-items:baseline;justify-content:flex-end;gap:8px;float:none!important;width:100%!important;max-width:100%!important;margin-top:6px;clear:both;}' +
          '.shopify-buy__quantity-container,.shopify-buy__cart-item__quantity-container{display:inline-flex!important;flex-wrap:nowrap!important;align-items:center;white-space:nowrap!important;float:none!important;}' +
          '.scc-unit-price{font-weight:400;opacity:.85;}' +
          '.scc-line-total{font-weight:600;}';
        (doc.head || doc.documentElement).appendChild(style);
      }
      doc.querySelectorAll('li.shopify-buy__cart-item').forEach(function (row) {
        var qtyInput = row.querySelector('input.shopify-buy__quantity, input[type="number"]');
        var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        var priceEl = row.querySelector('[data-element="lineItem.price"]');
        if (!priceEl) return;
        var lineTotal = NaN;
        var totalNode = priceEl.querySelector('.scc-line-total');
        if (totalNode) {
          var tm = (totalNode.textContent || '').replace(/,/g, '').match(/(\d+(?:\.\d{1,2})?)/);
          if (tm) lineTotal = parseFloat(tm[1]);
        } else {
          var text = (priceEl.textContent || '').trim();
          var m = text.replace(/,/g, '').match(/\$\s*(\d+(?:\.\d{1,2})?)/);
          if (m) lineTotal = parseFloat(m[1]);
        }
        if (!isFinite(lineTotal)) {
          var raw = parseFloat(priceEl.getAttribute('data-scc-line-total-raw') || '');
          if (isFinite(raw)) lineTotal = raw;
        }
        if (!isFinite(lineTotal)) return;
        priceEl.setAttribute('data-scc-line-total-raw', String(lineTotal));
        if (qty <= 1) {
          priceEl.textContent = '$' + lineTotal.toFixed(2);
          priceEl.removeAttribute('data-scc-formatted-qty');
          return;
        }
        var unit = lineTotal / qty;
        if (!isFinite(unit) || unit <= 0) return;
        var sig = qty + ':' + lineTotal.toFixed(2);
        if (priceEl.getAttribute('data-scc-formatted-qty') === sig && priceEl.querySelector('.scc-unit-price')) return;
        priceEl.setAttribute('data-scc-formatted-qty', sig);
        priceEl.innerHTML =
          '<span class="scc-unit-price">$' + unit.toFixed(2) + ' each</span>' +
          '<span class="scc-line-total">$' + lineTotal.toFixed(2) + '</span>';
      });
    } catch (e) {}
  }

  function wireCheckoutButton() {
    try {
      var iframe = document.querySelector('.shopify-buy-frame--cart iframe');
      if (!iframe || !iframe.contentDocument) return;
      var btn = iframe.contentDocument.querySelector('[data-element="cart.button"]');
      if (!btn || btn.getAttribute('data-scc-checkout') === '1') return;
      btn.setAttribute('data-scc-checkout', '1');
      btn.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToCheckout();
        },
        true
      );
    } catch (e) {}
  }

  function openCart() {
    function cartIframeSized() {
      var wrap = document.querySelector('.shopify-buy-frame--cart');
      var ifr = wrap && wrap.querySelector('iframe');
      return !!(ifr && ifr.getBoundingClientRect().width > 40);
    }
    function clickToggle() {
      var toggle = document.querySelector('.shopify-buy-frame--toggle');
      if (toggle) {
        toggle.style.setProperty('display', 'block', 'important');
        toggle.style.setProperty('visibility', 'visible', 'important');
        toggle.style.setProperty('opacity', '0.01', 'important');
        toggle.style.setProperty('pointer-events', 'auto', 'important');
        toggle.style.setProperty('width', '2px', 'important');
        toggle.style.setProperty('height', '2px', 'important');
      }
      var tIfr = document.querySelector('.shopify-buy-frame--toggle iframe');
      if (tIfr) {
        try {
          var doc = tIfr.contentDocument || (tIfr.contentWindow && tIfr.contentWindow.document);
          var inner = doc && (doc.querySelector('button') || doc.querySelector('[role="button"]') || doc.body);
          if (inner && typeof inner.click === 'function') inner.click();
        } catch (e) {}
      }
    }
    function forceShow() {
      var wrap = document.querySelector('.shopify-buy-frame--cart');
      if (!wrap) return;
      wrap.classList.add('is-active', 'is-visible', 'is-initialized');
      wrap.removeAttribute('hidden');
      wrap.style.setProperty('display', 'block', 'important');
      wrap.style.setProperty('visibility', 'visible', 'important');
      wrap.style.setProperty('opacity', '1', 'important');
      wrap.style.setProperty('z-index', '2147483647', 'important');
      wrap.style.setProperty('position', 'fixed', 'important');
      wrap.style.setProperty('top', '0', 'important');
      wrap.style.setProperty('right', '0', 'important');
      wrap.style.setProperty('bottom', '0', 'important');
      wrap.style.setProperty('left', 'auto', 'important');
      wrap.style.setProperty('width', '350px', 'important');
      wrap.style.setProperty('max-width', '100vw', 'important');
      wrap.style.setProperty('height', '100%', 'important');
      wrap.style.setProperty('transform', 'translateX(0)', 'important');
      var ifr = wrap.querySelector('iframe');
      if (ifr) {
        ifr.style.setProperty('display', 'block', 'important');
        ifr.style.setProperty('width', '350px', 'important');
        ifr.style.setProperty('max-width', '100vw', 'important');
        ifr.style.setProperty('height', '100%', 'important');
        ifr.style.setProperty('min-width', '280px', 'important');
        ifr.style.setProperty('min-height', '100%', 'important');
        ifr.style.setProperty('opacity', '1', 'important');
      }
      wireCheckoutButton();
      formatLineItemPrices();
    }

    if (cartIframeSized()) {
      forceShow();
      syncBadgeFromCart();
      return;
    }

    /* One toggle click to init Buy Button internals, then always force visible dimensions.
       Do not click toggle again — a second click closes the cart. */
    clickToggle();
    forceShow();
    setTimeout(forceShow, 50);
    setTimeout(function () {
      if (!cartIframeSized()) {
        clickToggle();
        forceShow();
      } else {
        forceShow();
      }
      syncBadgeFromCart();
    }, 250);
  }

  window.SCCProShop = window.SCCProShop || {};
  window.SCCProShop.openCart = openCart;
  window.SCCProShop.syncBadge = syncBadgeFromCart;
  window.SCCProShop.checkout = goToCheckout;

  var mounted = {
    cart: false,
    toggle: false,
    products: Object.create(null),
    timers: false
  };

  function ensureMounts() {
    if (!document.getElementById('scc-cart-mount')) {
      var cartMount = document.createElement('div');
      cartMount.id = 'scc-cart-mount';
      document.body.appendChild(cartMount);
    } else {
      document.getElementById('scc-cart-mount').removeAttribute('hidden');
    }
    if (!document.getElementById('scc-cart-toggle-mount')) {
      var toggleMount = document.createElement('div');
      toggleMount.id = 'scc-cart-toggle-mount';
      toggleMount.className = 'scc-cart-toggle-host';
      document.body.appendChild(toggleMount);
    }
  }

  function ensureHeaderButton() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var existing = header.querySelector('[data-scc-cart-button]');
    if (existing) {
      if (!existing.getAttribute('data-scc-cart-bound')) {
        bindCartButton(existing);
      }
      syncBadgeFromCart();
      return;
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scc-cart-button';
    btn.setAttribute('data-scc-cart-button', '');
    btn.setAttribute('aria-label', 'Open cart');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML =
      '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" style="pointer-events:none">' +
      '<path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1.3"/>' +
      '<circle cx="17" cy="20" r="1.3"/></svg>' +
      '<span class="scc-cart-count" data-scc-cart-count hidden></span>';
    bindCartButton(btn);
    var menu = header.querySelector('.menu-toggle');
    if (menu) header.insertBefore(btn, menu);
    else header.appendChild(btn);
    syncBadgeFromCart();
  }

  function bindCartButton(btn) {
    if (!btn || btn.getAttribute('data-scc-cart-bound') === '1') return;
    btn.setAttribute('data-scc-cart-bound', '1');
    var lastOpen = 0;
    function handle(e) {
      var now = Date.now();
      if (now - lastOpen < 500) return;
      lastOpen = now;
      if (e && e.cancelable && e.type === 'touchend') e.preventDefault();
      openCart();
    }
    btn.addEventListener('click', handle, false);
    btn.addEventListener('touchend', handle, { passive: false });
    /* Direct property fallback for stubborn WebKit */
    btn.onclick = function (e) { handle(e || window.event); };
  }

  function isAlreadyMounted(node) {
    if (!node) return true;
    if (node.getAttribute('data-scc-mounted') === '1') return true;
    if (node.querySelector('.shopify-buy-frame, iframe, .shopify-buy__product')) return true;
    return false;
  }

  function markMounted(node) {
    if (node) node.setAttribute('data-scc-mounted', '1');
  }

  function mount(ui) {
    ensureMounts();
    ensureHeaderButton();

    var cartNode = document.getElementById('scc-cart-mount');
    if (!mounted.cart && cartNode && !isAlreadyMounted(cartNode)) {
      ui.createComponent('cart', {
        node: cartNode,
        moneyFormat: '${{amount}}',
        options: productOptions
      });
      markMounted(cartNode);
      mounted.cart = true;
    } else {
      mounted.cart = true;
    }

    var toggleNode = document.getElementById('scc-cart-toggle-mount');
    if (!mounted.toggle && toggleNode && !isAlreadyMounted(toggleNode)) {
      ui.createComponent('toggle', {
        node: toggleNode,
        options: productOptions
      });
      markMounted(toggleNode);
      mounted.toggle = true;
    } else {
      mounted.toggle = true;
    }

    PRODUCTS.forEach(function (p) {
      if (mounted.products[p.nodeId]) return;
      var node = document.getElementById(p.nodeId);
      if (!node) return;
      if (isAlreadyMounted(node)) {
        mounted.products[p.nodeId] = true;
        return;
      }
      ui.createComponent('product', {
        id: p.id,
        node: node,
        moneyFormat: '${{amount}}',
        options: productOptions
      });
      markMounted(node);
      mounted.products[p.nodeId] = true;
    });

    if (/[?&]cart=1\b/.test(location.search) || location.hash === '#cart') {
      setTimeout(openCart, 700);
    }

    if (!mounted.timers) {
      mounted.timers = true;
      setTimeout(function () {
        syncBadgeFromCart();
        wireCheckoutButton();
        formatLineItemPrices();
      }, 900);
      setInterval(function () {
        syncBadgeFromCart();
        wireCheckoutButton();
        formatLineItemPrices();
      }, 2000);
    }

    window.__sccProShopMounted = true;
  }

  var startQueued = false;
  function start() {
    if (window.__sccProShopMounted) {
      ensureHeaderButton();
      syncBadgeFromCart();
      return;
    }
    if (startQueued) return;
    startQueued = true;
    var client = ShopifyBuy.buildClient({
      domain: DOMAIN,
      storefrontAccessToken: TOKEN
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      mount(ui);
    }).catch(function () {
      startQueued = false;
    });
  }

  function loadScript() {
    if (window.__sccProShopMounted) return;
    if (document.querySelector('script[data-scc-buybutton-sdk]')) {
      var waited = 0;
      var t = setInterval(function () {
        waited += 50;
        if (window.ShopifyBuy && window.ShopifyBuy.UI) {
          clearInterval(t);
          start();
        } else if (waited > 8000) clearInterval(t);
      }, 50);
      return;
    }
    var script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_URL;
    script.setAttribute('data-scc-buybutton-sdk', '1');
    script.onload = start;
    (document.getElementsByTagName('head')[0] || document.body).appendChild(script);
  }

  function boot() {
    if (window.__sccProShopMounted) {
      ensureHeaderButton();
      syncBadgeFromCart();
      return;
    }
    ensureHeaderButton();
    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) start();
      else loadScript();
    } else {
      loadScript();
    }
  }

  boot();

  /* bfcache restore: never remount; only refresh badge/header */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    ensureHeaderButton();
    syncBadgeFromCart();
  });
})();

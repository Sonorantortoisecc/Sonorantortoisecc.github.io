/* SCC Pro Shop — Shopify Buy Button (single SDK load) */
(function () {
  var DOMAIN = 'stqe3x-12.myshopify.com';
  var TOKEN = 'c7e643f9d9779158dcd702a936d789ef';
  var SCRIPT_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

  var PRODUCTS = [
    { id: '15493216600314', nodeId: 'product-component-rope-cap' },
    { id: '15493272011002', nodeId: 'product-component-paddle' },
    { id: '15493316673786', nodeId: 'product-component-towel' },
    { id: '15495942570234', nodeId: 'product-component-socks' },
    { id: '15496193376506', nodeId: 'product-component-trunks' }
  ];

  var productOptions = {
    product: {
      buttonDestination: 'checkout',
      contents: {
        img: false,
        imgWithCarousel: false,
        title: false,
        variantTitle: false,
        description: false,
        price: true,
        options: true,
        quantity: false,
        quantityIncrement: false,
        quantityDecrement: false,
        quantityInput: false,
        button: true,
        buttonWithQuantity: false
      },
      text: {
        button: 'Buy now'
      },
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
        prices: {
          'margin-bottom': '12px'
        },
        price: {
          'font-family': 'Cinzel, Georgia, serif',
          'font-size': '22px',
          'font-weight': '600',
          color: '#1b2a44'
        },
        compareAt: {
          'font-family': 'DM Sans, system-ui, sans-serif',
          'font-size': '14px'
        },
        unitPrice: {
          'font-family': 'DM Sans, system-ui, sans-serif',
          'font-size': '12px'
        },
        options: {
          'margin-bottom': '14px'
        },
        button: {
          'font-family': 'DM Sans, system-ui, sans-serif',
          'font-size': '12px',
          'font-weight': '600',
          'letter-spacing': '0.02em',
          'background-color': '#1b2a44',
          color: '#fffdf8',
          'border-radius': '0',
          padding: '14px 22px',
          ':hover': {
            'background-color': '#d9a596',
            color: '#1b2a44'
          },
          ':focus': {
            'background-color': '#d9a596',
            color: '#1b2a44'
          }
        }
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
        wrapper: {
          'margin-bottom': '10px'
        }
      }
    },
    cart: {
      text: {
        total: 'Subtotal',
        button: 'Checkout'
      }
    },
    toggle: { styles: { toggle: { display: 'none' } } },
    modalProduct: {
      contents: {
        img: false,
        imgWithCarousel: true,
        button: false,
        buttonWithQuantity: true
      },
      styles: {
        button: {
          'background-color': '#1b2a44',
          ':hover': { 'background-color': '#d9a596' }
        }
      },
      text: { button: 'Buy now' }
    }
  };

  function mount(ui) {
    PRODUCTS.forEach(function (p) {
      var node = document.getElementById(p.nodeId);
      if (!node) return;
      ui.createComponent('product', {
        id: p.id,
        node: node,
        moneyFormat: '${{amount}}',
        options: productOptions
      });
    });
  }

  function start() {
    var client = ShopifyBuy.buildClient({
      domain: DOMAIN,
      storefrontAccessToken: TOKEN
    });
    ShopifyBuy.UI.onReady(client).then(mount);
  }

  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_URL;
    script.onload = start;
    (document.getElementsByTagName('head')[0] || document.body).appendChild(script);
  }

  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) start();
    else loadScript();
  } else {
    loadScript();
  }
})();

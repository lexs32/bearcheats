(function() {
  function animateValue(obj, start, end, duration, formatComma) {
    var startTimestamp = null;
    var step = function(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      var progress = Math.min((timestamp - startTimestamp) / duration, 1);
      var val = Math.floor(progress * (end - start) + start);
      obj.innerHTML = formatComma ? val.toLocaleString() : val;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = formatComma ? end.toLocaleString() : end;
      }
    };
    window.requestAnimationFrame(step);
  }

  var onlineCounters = document.querySelectorAll('.stats-box--online .stats-box__metric, nav .online-count, nav .tabular-nums, [class*="header-action"] span');
  var gamesCounters = document.querySelectorAll('.stats-box--games .stats-box__metric');
  var cheatsCounters = document.querySelectorAll('.stats-box--cheats .stats-box__metric');
  var soldCounters = document.querySelectorAll('.stats-box--sold .stats-box__metric');

  var statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        gamesCounters.forEach(function(el) { animateValue(el, 0, 36, 1200, false); });
        cheatsCounters.forEach(function(el) { animateValue(el, 0, 78, 1400, false); });
        soldCounters.forEach(function(el) { animateValue(el, 0, 24190, 1600, true); });
        onlineCounters.forEach(function(el) { animateValue(el, 0, 184, 1000, false); });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  var statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    statsObserver.observe(statsSection);
  } else {
    onlineCounters.forEach(function(el) { el.textContent = '184'; });
  }

  var videoPlayer = document.querySelector('.video-player');
  if (videoPlayer) {
    videoPlayer.style.cursor = 'pointer';
    videoPlayer.addEventListener('click', function(e) {
      e.preventDefault();
      var videoId = videoPlayer.getAttribute('data-video-id') || 'WJxJLBkU0AI';
      var modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
      modal.innerHTML = '<div class="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">' +
        '<button class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition-all close-video">&times;</button>' +
        '<iframe class="w-full h-full" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '</div>';
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      var closeModal = function() {
        modal.remove();
        document.body.style.overflow = '';
      };
      
      modal.querySelector('.close-video').addEventListener('click', closeModal);
      modal.addEventListener('click', function(evt) {
        if (evt.target === modal) closeModal();
      });
      document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Escape') closeModal();
      }, { once: true });
    });
  }

  var faqItems = document.querySelectorAll('.faq-item, .faq__item, [class*="faq__item"]');
  faqItems.forEach(function(item) {
    var trigger = item.querySelector('.faq-question, .faq__question, button, summary') || item;
    trigger.style.cursor = 'pointer';
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      var wasOpen = item.classList.contains('active') || item.classList.contains('open');
      faqItems.forEach(function(other) {
        other.classList.remove('active', 'open');
        var ans = other.querySelector('.faq-answer, .faq__answer');
        if (ans) ans.style.display = 'none';
      });
      if (!wasOpen) {
        item.classList.add('active', 'open');
        var ans = item.querySelector('.faq-answer, .faq__answer');
        if (ans) ans.style.display = 'block';
      }
    });
  });

  var alphaBtns = document.querySelectorAll('.alphabet-filter__btn, .alphabet-filter button');
  var gameCards = document.querySelectorAll('.category-card, .store-card, [class*="categories-grid"] > div, [class*="categories-grid"] > a, [class*="games-grid"] > a, [class*="games-grid"] > div');
  if (alphaBtns.length && gameCards.length) {
    alphaBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        alphaBtns.forEach(function(b) {
          b.classList.remove('active');
          b.classList.remove('alphabet-filter__btn--active');
        });
        btn.classList.add('active');
        btn.classList.add('alphabet-filter__btn--active');
        var letter = btn.textContent.trim().toUpperCase();
        gameCards.forEach(function(card) {
          var titleEl = card.querySelector('h3, h4, .title, [class*="title"]') || card;
          var titleText = titleEl.textContent.trim().toUpperCase();
          if (letter === 'ALL' || titleText.startsWith(letter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  var loginHtmlCache = null;
  function openLoginModal() {
    var renderModal = function(html) {
      var existing = document.querySelector('.login-modal-overlay');
      if (existing) existing.remove();
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      var overlay = wrapper.firstElementChild;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      var closeBtn = overlay.querySelector('.login-modal__close');
      var emailInput = overlay.querySelector('#login-email');
      var sendBtn = overlay.querySelector('.login-modal__send-btn');

      var close = function() {
        overlay.remove();
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close();
      });

      var onKey = function(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', onKey);
        }
      };
      document.addEventListener('keydown', onKey);

      if (emailInput && sendBtn) {
        emailInput.focus();
        emailInput.addEventListener('input', function() {
          sendBtn.disabled = !emailInput.value.includes('@');
        });
        sendBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var step = overlay.querySelector('.login-modal__step');
          if (step) {
            step.innerHTML = '<div style="text-align:center;padding:30px 10px;">' +
              '<div style="font-size:32px;margin-bottom:12px;color:#d97706;">✓</div>' +
              '<h3 style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;">Magic Link Sent</h3>' +
              '<p style="font-size:14px;color:rgba(255,255,255,0.7);margin-bottom:20px;">We sent a secure login link to <strong style="color:#fff;">' + emailInput.value + '</strong>. Check your inbox to continue.</p>' +
              '<button class="login-modal__send-btn" style="width:100%;"><span>Done</span></button>' +
              '</div>';
            var doneBtn = step.querySelector('button');
            if (doneBtn) doneBtn.addEventListener('click', close);
          }
        });
      }
    };

    if (loginHtmlCache) {
      renderModal(loginHtmlCache);
    } else {
      fetch('/assets/login_modal.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          loginHtmlCache = html;
          renderModal(html);
        });
    }
  }

  var searchHtmlCache = null;
  function openSearchModal() {
    var renderModal = function(html) {
      var existing = document.querySelector('.search-modal-overlay');
      if (existing) existing.remove();
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      var overlay = wrapper.firstElementChild;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      var input = overlay.querySelector('.search-modal__input');
      var clearBtn = overlay.querySelector('.search-modal__clear');
      var closeBtn = overlay.querySelector('.search-modal__close');
      var groups = overlay.querySelectorAll('.search-modal__group');
      var allItems = overlay.querySelectorAll('.search-modal__item');
      var emptyState = overlay.querySelector('.search-modal__empty');

      var close = function() {
        overlay.remove();
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay || !e.target.closest('.search-modal')) close();
      });

      allItems.forEach(function(item) {
        item.addEventListener('click', function() {
          close();
        });
      });

      var onKey = function(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', onKey);
        }
      };
      document.addEventListener('keydown', onKey);

      if (input) {
        input.focus();
        input.addEventListener('input', function() {
          var query = input.value.trim().toLowerCase();
          if (clearBtn) clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
          var totalMatches = 0;
          groups.forEach(function(group) {
            var groupName = (group.querySelector('.search-modal__group-name') || {}).textContent || '';
            var items = group.querySelectorAll('.search-modal__item');
            var matchedInGroup = 0;
            items.forEach(function(item) {
              var text = item.textContent.toLowerCase();
              if (text.includes(query) || groupName.toLowerCase().includes(query)) {
                item.style.display = '';
                matchedInGroup++;
                totalMatches++;
              } else {
                item.style.display = 'none';
              }
            });
            group.style.display = matchedInGroup > 0 ? '' : 'none';
          });
          if (emptyState) emptyState.style.display = totalMatches === 0 ? 'flex' : 'none';
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input'));
            input.focus();
          }
        });
      }
    };

    if (searchHtmlCache) {
      renderModal(searchHtmlCache);
    } else {
      fetch('/assets/search_modal.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          searchHtmlCache = html;
          renderModal(html);
        });
    }
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.search-modal')) return;
    if (e.target.closest('.login-modal')) return;

    var btnOrLink = e.target.closest('button, a');
    if (btnOrLink) {
      var txt = btnOrLink.textContent.trim().toLowerCase();
      var aria = (btnOrLink.getAttribute('aria-label') || '').toLowerCase();
      var href = (btnOrLink.getAttribute('href') || '').toLowerCase();
      var hasLoginIcon = btnOrLink.querySelector('.fa-right-to-bracket');

      if (txt === 'login' || aria === 'login' || href.includes('login') || hasLoginIcon) {
        e.preventDefault();
        openLoginModal();
        return;
      }

      var hasSearchIcon = btnOrLink.querySelector('svg circle') || btnOrLink.querySelector('.fa-magnifying-glass');
      if (txt.includes('search') || aria.includes('search') || (hasSearchIcon && txt.includes('search for products'))) {
        e.preventDefault();
        openSearchModal();
        return;
      }
    }
  });

  window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  var variantBtns = document.querySelectorAll('.variant-btn');
  var currentUnitPrice = 0;
  var quantityVal = 1;

  if (variantBtns.length) {
    var initialSelected = document.querySelector('.variant-btn-selected') || variantBtns[0];
    if (initialSelected) {
      var priceMatch = initialSelected.textContent.match(/[0-9]+(?:\.[0-9]+)?/);
      if (priceMatch) currentUnitPrice = parseFloat(priceMatch[0]);
    }

    variantBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        variantBtns.forEach(function(b) { b.classList.remove('variant-btn-selected'); });
        btn.classList.add('variant-btn-selected');
        var match = btn.textContent.match(/[0-9]+(?:\.[0-9]+)?/);
        if (match) {
          currentUnitPrice = parseFloat(match[0]);
          updateTotals();
        }
      });
    });
  }

  function updateTotals() {
    var total = (currentUnitPrice * quantityVal).toFixed(2);
    var symbol = '$';
    var priceEl = document.querySelector('.product-actions__total-price');
    var totalValEl = document.querySelector('.product-page__total-value');
    if (priceEl) priceEl.textContent = symbol + total;
    if (totalValEl) totalValEl.textContent = symbol + total;
  }

  var qtySelectors = document.querySelectorAll('.quantity-selector');
  qtySelectors.forEach(function(sel) {
    var btns = sel.querySelectorAll('button');
    var countEl = sel.querySelector('span, [class*="count"], [class*="value"]');
    if (btns.length >= 2 && countEl) {
      var minusBtn = btns[0];
      var plusBtn = btns[1];
      minusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (quantityVal > 1) {
          quantityVal--;
          countEl.textContent = quantityVal;
          updateTotals();
        }
      });
      plusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        quantityVal++;
        countEl.textContent = quantityVal;
        updateTotals();
      });
    }
  });

  var galleryThumbs = document.querySelectorAll('.product-gallery__thumbnail');
  var mainImg = document.querySelector('.product-gallery__main img');
  if (galleryThumbs.length && mainImg) {
    galleryThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        galleryThumbs.forEach(function(t) { t.classList.remove('product-gallery__thumbnail--active'); });
        thumb.classList.add('product-gallery__thumbnail--active');
        var thumbImg = thumb.querySelector('img');
        if (thumbImg) {
          mainImg.src = thumbImg.src;
          if (mainImg.srcset) mainImg.srcset = thumbImg.src;
        }
      });
    });
  }

  var prevArrow = document.querySelector('.product-gallery__arrow--prev');
  var nextArrow = document.querySelector('.product-gallery__arrow--next');
  if (prevArrow && nextArrow && galleryThumbs.length) {
    var curIdx = 0;
    var setIdx = function(idx) {
      curIdx = (idx + galleryThumbs.length) % galleryThumbs.length;
      galleryThumbs[curIdx].click();
      var counter = document.querySelector('.product-gallery__counter');
      if (counter) counter.textContent = (curIdx + 1) + '/' + galleryThumbs.length;
    };
    prevArrow.addEventListener('click', function(e) { e.preventDefault(); setIdx(curIdx - 1); });
    nextArrow.addEventListener('click', function(e) { e.preventDefault(); setIdx(curIdx + 1); });
  }

  var addToCartBtn = document.querySelector('.product-actions__buttons button:first-child');
  var buyNowBtn = document.querySelector('.product-actions__buttons button:last-child');
  
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('bearcheats_cart') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('bearcheats_cart', JSON.stringify(cart));
    updateCartBadges();
  }

  function updateCartBadges() {
    var cart = getCart();
    var count = cart.reduce(function(sum, item) { return sum + (item.quantity || 1); }, 0);
    var badges = document.querySelectorAll('.header-cart-badge, [class*="cart-badge"], .navbar-right a[href*="cart"] span');
    badges.forEach(function(b) {
      b.textContent = count;
      b.style.display = count > 0 ? '' : 'none';
    });
  }
  updateCartBadges();

  if (addToCartBtn && addToCartBtn.textContent.toLowerCase().includes('cart')) {
    addToCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var titleEl = document.querySelector('.product-page__title h1') || document.querySelector('h1');
      var title = titleEl ? titleEl.textContent.trim() : 'Game Cheat';
      var selectedVariant = document.querySelector('.variant-btn-selected');
      var variantName = selectedVariant ? (selectedVariant.querySelector('.variant-btn-title') || selectedVariant).textContent.trim() : 'Standard';
      var price = currentUnitPrice || 25.00;
      
      var cart = getCart();
      cart.push({
        title: title,
        variant: variantName,
        price: price,
        quantity: quantityVal
      });
      saveCart(cart);

      var origText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = 'Added to Cart ✓';
      addToCartBtn.style.borderColor = '#d97706';
      setTimeout(function() {
        addToCartBtn.innerHTML = origText;
        addToCartBtn.style.borderColor = '';
      }, 1500);
    });
  }

  if (buyNowBtn && buyNowBtn.textContent.toLowerCase().includes('buy')) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (addToCartBtn) addToCartBtn.click();
      window.location.href = '/cart';
    });
  }

  var couponBtns = document.querySelectorAll('button');
  couponBtns.forEach(function(b) {
    if (b.textContent.trim().toLowerCase() === 'apply') {
      b.addEventListener('click', function(e) {
        e.preventDefault();
        var input = document.querySelector('input[placeholder*="Coupon"], input[placeholder*="coupon"]');
        var code = input ? input.value.trim().toUpperCase() : '';
        if (code === 'BEAR10' || code === 'WELCOME10') {
          alert('Coupon ' + code + ' applied! 10% discount activated.');
        } else {
          alert('Invalid coupon code. Try code: BEAR10');
        }
      });
    }
  });

  (function initReviewsCarousel() {
    function setup() {
      var carousel = document.querySelector('.reviews-carousel');
      var nav = document.querySelector('.reviews-nav');
      if (!carousel || !nav) return;
      var buttons = nav.querySelectorAll('button');
      if (buttons.length < 2) return;
      var prevBtn = buttons[0];
      var nextBtn = buttons[1];

      function getStep() {
        var slide = carousel.querySelector('.reviews-slide');
        if (slide) {
          var container = carousel.querySelector('.reviews-container');
          var gap = 24;
          if (container && window.getComputedStyle) {
            var g = parseFloat(window.getComputedStyle(container).gap);
            if (!isNaN(g)) gap = g;
          }
          return slide.offsetWidth + gap;
        }
        return carousel.clientWidth * 0.8;
      }

      function updateNavState() {
        var maxScroll = carousel.scrollWidth - carousel.clientWidth;
        var scrollLeft = carousel.scrollLeft;

        if (scrollLeft <= 8) {
          prevBtn.classList.add('reviews-nav-btn--disabled');
          prevBtn.disabled = true;
          prevBtn.style.opacity = '0.35';
          prevBtn.style.cursor = 'not-allowed';
        } else {
          prevBtn.classList.remove('reviews-nav-btn--disabled');
          prevBtn.disabled = false;
          prevBtn.style.opacity = '1';
          prevBtn.style.cursor = 'pointer';
        }

        if (scrollLeft >= maxScroll - 8) {
          nextBtn.classList.add('reviews-nav-btn--disabled');
          nextBtn.disabled = true;
          nextBtn.style.opacity = '0.35';
          nextBtn.style.cursor = 'not-allowed';
        } else {
          nextBtn.classList.remove('reviews-nav-btn--disabled');
          nextBtn.disabled = false;
          nextBtn.style.opacity = '1';
          nextBtn.style.cursor = 'pointer';
        }
      }

      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
        setTimeout(updateNavState, 350);
      });

      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
        setTimeout(updateNavState, 350);
      });

      carousel.addEventListener('scroll', updateNavState, { passive: true });
      window.addEventListener('resize', updateNavState);
      updateNavState();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  })();


  (function initOnlineCounter() {
    var count = 184;
    function updateOnlineDisplays() {
      var elements = document.querySelectorAll('.online-count, nav .tabular-nums, .stats-box--online .stats-box__metric');
      elements.forEach(function(el) {
        el.textContent = count;
      });
    }
    updateOnlineDisplays();
    setInterval(function() {
      var delta = Math.floor(Math.random() * 3) - 1;
      count = Math.max(174, Math.min(196, count + delta));
      updateOnlineDisplays();
    }, 6000);
  })();

  (function initReviewsPagePagination() {
    function setup() {
      var grid = document.querySelector('.reviews-grid__grid');
      var pagination = document.querySelector('.pagination');
      if (!grid || !pagination) return;

      var cards = grid.querySelectorAll('.reviews-card');
      if (cards.length === 0) return;

      cards.forEach(function(card, idx) {
        if (idx < 12) {
          card.setAttribute('data-page', '1');
          card.style.display = '';
        } else {
          card.setAttribute('data-page', '2');
          card.style.display = 'none';
        }
      });

      var prevLi = pagination.querySelector('.pagination__nav--prev');
      var nextLi = pagination.querySelector('.pagination__nav--next');
      var p1Li = pagination.querySelector('.pagination__page--1');
      var p2Li = pagination.querySelector('.pagination__page--2');
      if (!p1Li || !p2Li) return;

      var currentPage = 1;

      function goToPage(page) {
        if (page === currentPage) return;
        currentPage = page;

        cards.forEach(function(card) {
          if (card.getAttribute('data-page') === String(page)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        if (currentPage === 1) {
          p1Li.classList.add('pagination__page--active');
          p2Li.classList.remove('pagination__page--active');
          if (prevLi) prevLi.classList.add('pagination__nav--disabled');
          if (nextLi) nextLi.classList.remove('pagination__nav--disabled');
        } else {
          p2Li.classList.add('pagination__page--active');
          p1Li.classList.remove('pagination__page--active');
          if (prevLi) prevLi.classList.remove('pagination__nav--disabled');
          if (nextLi) nextLi.classList.add('pagination__nav--disabled');
        }

        var reviewsSection = document.getElementById('reviews-grid') || grid;
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      p1Li.addEventListener('click', function(e) {
        e.preventDefault();
        goToPage(1);
      });

      p2Li.addEventListener('click', function(e) {
        e.preventDefault();
        goToPage(2);
      });

      if (prevLi) {
        prevLi.addEventListener('click', function(e) {
          e.preventDefault();
          if (currentPage > 1) goToPage(currentPage - 1);
        });
      }

      if (nextLi) {
        nextLi.addEventListener('click', function(e) {
          e.preventDefault();
          if (currentPage < 2) goToPage(currentPage + 1);
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  })();

})();

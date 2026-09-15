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
        gamesCounters.forEach(function(el) { animateValue(el, 0, 7, 1200, false); });
        cheatsCounters.forEach(function(el) { animateValue(el, 0, 15, 1400, false); });
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
      var videoId = videoPlayer.getAttribute('data-video-id') || 'OdOsNi4v-jg';
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

  var currentUnitPrice = 0;
  var quantityVal = 1;

  function updateTotals() {
    var total = (currentUnitPrice * quantityVal).toFixed(2);
    var symbol = '$';
    var priceEl = document.querySelector('.product-actions__total-price');
    var totalValEl = document.querySelector('.product-page__total-value');
    if (priceEl) priceEl.textContent = symbol + total;
    if (totalValEl) totalValEl.textContent = symbol + total;
  }

  function getButtonPrice(btn) {
    if (!btn) return 0;
    var priceEl = btn.querySelector('.flex.items-end .font-semibold, .variant-btn-price');
    if (priceEl) {
      var m = priceEl.textContent.match(/[0-9]+(?:\.[0-9]+)?/);
      if (m) return parseFloat(m[0]);
    }
    var matches = btn.textContent.match(/[$€£]\s*([0-9]+(?:\.[0-9]+)?)/);
    if (matches) return parseFloat(matches[1]);
    var all = btn.textContent.match(/[0-9]+(?:\.[0-9]+)?/g);
    if (all && all.length) return parseFloat(all[all.length - 1]);
    return 0;
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.variant-btn');
    if (btn) {
      e.preventDefault();
      var all = document.querySelectorAll('.variant-btn');
      all.forEach(function(b) { b.classList.remove('variant-btn-selected'); });
      btn.classList.add('variant-btn-selected');
      var p = getButtonPrice(btn);
      if (p > 0) {
        currentUnitPrice = p;
        updateTotals();
      }
    }
  });

  function initVariantSelection() {
    var initial = document.querySelector('.variant-btn-selected') || document.querySelector('.variant-btn');
    if (initial) {
      initial.classList.add('variant-btn-selected');
      var p = getButtonPrice(initial);
      if (p > 0) {
        currentUnitPrice = p;
        updateTotals();
      }
    }
  }
  initVariantSelection();

  var qtySelectors = document.querySelectorAll('.quantity-selector');
  qtySelectors.forEach(function(sel) {
    var btns = sel.querySelectorAll('button');
    var countEl = sel.querySelector('input, span, [class*="count"], [class*="value"]');
    if (btns.length >= 2 && countEl) {
      var minusBtn = btns[0];
      var plusBtn = btns[1];
      minusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (quantityVal > 1) {
          quantityVal--;
          if (countEl.tagName === 'INPUT') countEl.value = quantityVal;
          else countEl.textContent = quantityVal;
          minusBtn.disabled = quantityVal <= 1;
          updateTotals();
        }
      });
      plusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        quantityVal++;
        if (countEl.tagName === 'INPUT') countEl.value = quantityVal;
        else countEl.textContent = quantityVal;
        minusBtn.disabled = false;
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

  var CATALOG = [
  {
    "id": 804989,
    "name": "Inferno - R6 Full",
    "path": "crusader-r6-full",
    "slugs": [
      "inferno-r6-full",
      "crusader-r6-full",
      "akuma-r6-full-cheat"
    ],
    "variants": [
      {
        "id": 1377265,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1377266,
        "name": "7 Day Key",
        "price": 30
      },
      {
        "id": 1377267,
        "name": "30 Day Key",
        "price": 60
      }
    ]
  },
  {
    "id": 804991,
    "name": "Exodus - Fortnite External",
    "path": "exodus-fortnite-external",
    "slugs": [
      "exodus-fortnite-external",
      "torix-fortnite-external-cheat",
      "ancient-fortnite",
      "ancient-fortnite-cheat",
      "ds6-ia-edition-fortnite",
      "fortnite-dma-cheat"
    ],
    "variants": [
      {
        "id": 1377275,
        "name": "1 Day Key",
        "price": 5.99
      },
      {
        "id": 1377274,
        "name": "3 Day Key",
        "price": 8
      },
      {
        "id": 1377273,
        "name": "7 Day Key",
        "price": 20
      },
      {
        "id": 1377276,
        "name": "30 Day Key",
        "price": 40
      }
    ]
  },
  {
    "id": 804994,
    "name": "Vega - R6",
    "path": "vega-r6",
    "slugs": [
      "vega-r6"
    ],
    "variants": [
      {
        "id": 1377290,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1377288,
        "name": "3 Day Key",
        "price": 12
      },
      {
        "id": 1377289,
        "name": "7 Day Key",
        "price": 25
      },
      {
        "id": 1377287,
        "name": "30 Day Key",
        "price": 50
      }
    ]
  },
  {
    "id": 804995,
    "name": "R6 Lite",
    "path": "r6-lite",
    "slugs": [
      "r6-lite"
    ],
    "variants": [
      {
        "id": 1377292,
        "name": "1 Day Key",
        "price": 4.99
      },
      {
        "id": 1377294,
        "name": "3 Day Key",
        "price": 8
      },
      {
        "id": 1377291,
        "name": "7 Day Key",
        "price": 15
      },
      {
        "id": 1377293,
        "name": "30 Day Key",
        "price": 30
      }
    ]
  },
  {
    "id": 804996,
    "name": "Arc Raiders",
    "path": "ancient-arc-raiders",
    "slugs": [
      "ancient-arc-raiders",
      "arc-raiders",
      "game-arc-raiders",
      "ancient-arc-raiders-cheat",
      "arcane-arc-raiders-cheat"
    ],
    "variants": [
      {
        "id": 1377297,
        "name": "1 Day Key",
        "price": 5.99
      },
      {
        "id": 1377296,
        "name": "7 Day Key",
        "price": 20
      },
      {
        "id": 1377295,
        "name": "30 Day Key",
        "price": 40
      }
    ]
  },
  {
    "id": 804997,
    "name": "Ancient - R6 External",
    "path": "ancient-r6-external",
    "slugs": [
      "ancient-r6-external",
      "r6s-ancient-external-cheat"
    ],
    "variants": [
      {
        "id": 1377298,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1377300,
        "name": "7 Day Key",
        "price": 15
      },
      {
        "id": 1377299,
        "name": "30 Day Key",
        "price": 30
      }
    ]
  },
  {
    "id": 805018,
    "name": "Krush - Apex Legends",
    "path": "krush-apex-legends",
    "slugs": [
      "krush-apex-legends"
    ],
    "variants": [
      {
        "id": 1377372,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1377373,
        "name": "7 Day Key",
        "price": 20
      },
      {
        "id": 1377374,
        "name": "30 Day Key",
        "price": 40
      }
    ]
  },
  {
    "id": 805019,
    "name": "Nebula - Fortnite External",
    "path": "disconnect-fortnite-external",
    "slugs": [
      "disconnect-fortnite-external",
      "nebula-fortnite-external"
    ],
    "variants": [
      {
        "id": 1377375,
        "name": "1 Day Key",
        "price": 10
      },
      {
        "id": 1377376,
        "name": "3 Day Key",
        "price": 20
      },
      {
        "id": 1377377,
        "name": "7 Day Key",
        "price": 35
      },
      {
        "id": 1377378,
        "name": "30 Day Key",
        "price": 65
      },
      {
        "id": 1377379,
        "name": "Lifetime Key",
        "price": 300
      }
    ]
  },
  {
    "id": 805020,
    "name": "Nebula - Rust Internal",
    "path": "nebula-rust-internal",
    "slugs": [
      "nebula-rust-internal"
    ],
    "variants": [
      {
        "id": 1377380,
        "name": "3 Day Key",
        "price": 22
      },
      {
        "id": 1401079,
        "name": "7 Day Key",
        "price": 45
      },
      {
        "id": 1401080,
        "name": "30 Day Key",
        "price": 85
      }
    ]
  },
  {
    "id": 817475,
    "name": "Nebula - Rust External",
    "path": "nebula-rust-external",
    "slugs": [
      "nebula-rust-external"
    ],
    "variants": [
      {
        "id": 1401065,
        "name": "1 Day Key",
        "price": 9.99
      },
      {
        "id": 1401066,
        "name": "3 Day Key",
        "price": 19.99
      },
      {
        "id": 1401067,
        "name": "7 Day Key",
        "price": 34.99
      },
      {
        "id": 1401068,
        "name": "30 Day Key",
        "price": 60
      },
      {
        "id": 1401069,
        "name": "Lifetime Key",
        "price": 300
      }
    ]
  },
  {
    "id": 823467,
    "name": "Private - Call Of Duty",
    "path": "private-call-of-duty",
    "slugs": [
      "private-call-of-duty"
    ],
    "variants": [
      {
        "id": 1412646,
        "name": "1 Day Key",
        "price": 5.99
      },
      {
        "id": 1412647,
        "name": "3 Day Key",
        "price": 10
      },
      {
        "id": 1412648,
        "name": "7 Day Key",
        "price": 20
      },
      {
        "id": 1412649,
        "name": "30 Day Key",
        "price": 50
      },
      {
        "id": 1412650,
        "name": "90 Day Key",
        "price": 99.99
      }
    ]
  },
  {
    "id": 856078,
    "name": "Predator - Cs2",
    "path": "predator-cs2",
    "slugs": [
      "predator-cs2"
    ],
    "variants": [
      {
        "id": 1532720,
        "name": "1 Day Key",
        "price": 3
      },
      {
        "id": 1532721,
        "name": "7 Day Key",
        "price": 6
      },
      {
        "id": 1532722,
        "name": "30 Day Key",
        "price": 8
      },
      {
        "id": 1532723,
        "name": "1 Year Key",
        "price": 54
      }
    ]
  },
  {
    "id": 856080,
    "name": "Verse - Perm Spoofer",
    "path": "verse-perm-spoofer",
    "slugs": [
      "verse-perm-spoofer"
    ],
    "variants": [
      {
        "id": 1532841,
        "name": "One Time Use",
        "price": 24
      },
      {
        "id": 1532842,
        "name": "Lifetime",
        "price": 80
      }
    ]
  },
  {
    "id": 856084,
    "name": "Predator - Marvel Rivals",
    "path": "predator-marvel-rivals",
    "slugs": [
      "predator-marvel-rivals",
      "ancient-marvel-rivals",
      "arcane-marvel-rivals-cheat"
    ],
    "variants": [
      {
        "id": 1532957,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1532958,
        "name": "7 Day Key",
        "price": 15
      },
      {
        "id": 1532959,
        "name": "30 Day Key",
        "price": 30
      },
      {
        "id": 1532960,
        "name": "1 Year Key",
        "price": 100
      }
    ]
  },
  {
    "id": 856085,
    "name": "Krush - Arc Raiders",
    "path": "krush-arc-raiders",
    "slugs": [
      "krush-arc-raiders"
    ],
    "variants": [
      {
        "id": 1532961,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1532962,
        "name": "7 Day Key",
        "price": 30
      },
      {
        "id": 1532963,
        "name": "30 Day Key",
        "price": 60
      }
    ]
  },
  {
    "id": 856087,
    "name": "Sapphire Unlock All - R6S",
    "path": "sapphire-unlock-all-r6s",
    "slugs": [
      "sapphire-unlock-all-r6s"
    ],
    "variants": [
      {
        "id": 1532965,
        "name": "3 Day Key",
        "price": 10
      },
      {
        "id": 1532966,
        "name": "7 Day Key",
        "price": 20
      },
      {
        "id": 1532967,
        "name": "30 Day Key",
        "price": 40
      }
    ]
  },
  {
    "id": 856088,
    "name": "Exodus - R6S",
    "path": "exodus-r6s",
    "slugs": [
      "exodus-r6s"
    ],
    "variants": [
      {
        "id": 1532968,
        "name": "1 Day Key",
        "price": 6
      },
      {
        "id": 1532969,
        "name": "3 Day Key",
        "price": 12
      },
      {
        "id": 1532970,
        "name": "7 Day Key",
        "price": 24
      },
      {
        "id": 1532971,
        "name": "30 Day Key",
        "price": 48
      }
    ]
  }
];

  function resolveCurrentProduct() {
    var path = (window.location.pathname || '').toLowerCase();
    var titleEl = document.querySelector('.product-page__title h1') || document.querySelector('.product-page__title') || document.querySelector('h1');
    var rawTitle = titleEl ? titleEl.textContent.trim() : '';
    var cleanTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (var i = 0; i < CATALOG.length; i++) {
      var p = CATALOG[i];
      for (var j = 0; j < p.slugs.length; j++) {
        if (path.includes(p.slugs[j])) return p;
      }
    }

    for (var k = 0; k < CATALOG.length; k++) {
      var prod = CATALOG[k];
      var cleanPName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTitle.includes(cleanPName) || cleanPName.includes(cleanTitle)) return prod;
    }

    for (var m = 0; m < CATALOG.length; m++) {
      var pr = CATALOG[m];
      var cleanPPath = pr.path.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTitle.includes(cleanPPath) || path.includes(cleanPPath)) return pr;
    }

    return CATALOG[0];
  }

  function resolveCurrentVariant(product) {
    if (!product || !product.variants || !product.variants.length) {
      return { id: 0, name: 'Default', price: 0 };
    }

    var selectedBtn = document.querySelector('.variant-btn-selected') || document.querySelector('.variant-btn');
    if (!selectedBtn) return product.variants[0];

    var btnText = (selectedBtn.innerText || selectedBtn.textContent || '').trim();
    var foundPrice = getButtonPrice(selectedBtn);

    var checks = [
      { regex: /\b(?:1|one)\s*year/i, matchName: /1\s*year/i },
      { regex: /\b90\s*day/i, matchName: /90\s*day/i },
      { regex: /\b30\s*day|\bmonth/i, matchName: /30\s*day/i },
      { regex: /\b7\s*day|\bweek/i, matchName: /7\s*day/i },
      { regex: /\b3\s*day/i, matchName: /3\s*day/i },
      { regex: /\b1\s*day/i, matchName: /1\s*day/i },
      { regex: /\blifetime/i, matchName: /lifetime/i },
      { regex: /\bone\s*time/i, matchName: /one\s*time/i }
    ];

    for (var i = 0; i < checks.length; i++) {
      if (checks[i].regex.test(btnText)) {
        for (var v = 0; v < product.variants.length; v++) {
          if (checks[i].matchName.test(product.variants[v].name)) {
            return product.variants[v];
          }
        }
      }
    }

    if (foundPrice > 0) {
      for (var j = 0; j < product.variants.length; j++) {
        if (Math.abs(parseFloat(product.variants[j].price) - foundPrice) < 0.05) {
          return product.variants[j];
        }
      }
    }

    return product.variants[0];
  }

  function getCart() {
    try {
      var raw = JSON.parse(localStorage.getItem('bearcheats_cart') || '[]');
      if (!Array.isArray(raw)) return [];
      var clean = [];
      for (var i = 0; i < raw.length; i++) {
        var item = raw[i];
        if (!item) continue;
        var name = item.name || item.title;
        var variantName = item.variantName || item.variant;
        if (!name || name === 'undefined' || !variantName || variantName === 'undefined') {
          continue;
        }
        name = name.replace(/^Ancient\s*-\s*/i, '');
        var price = parseFloat(item.price);
        if (isNaN(price) || price <= 0) continue;

        var productId = Number(item.productId);
        var variantId = Number(item.variantId);

        if (!productId || isNaN(productId) || !variantId || isNaN(variantId)) {
          var matchedProduct = null;
          for (var p = 0; p < CATALOG.length; p++) {
            var catName = CATALOG[p].name.toLowerCase();
            if (name.toLowerCase().includes(catName) || catName.includes(name.toLowerCase())) {
              matchedProduct = CATALOG[p];
              break;
            }
          }
          if (!matchedProduct) matchedProduct = CATALOG[0];
          productId = matchedProduct.id;

          var matchedVariant = null;
          for (var v = 0; v < matchedProduct.variants.length; v++) {
            if (Math.abs(parseFloat(matchedProduct.variants[v].price) - price) < 0.05) {
              matchedVariant = matchedProduct.variants[v];
              break;
            }
          }
          if (!matchedVariant) matchedVariant = matchedProduct.variants[0];
          variantId = matchedVariant.id;
          variantName = matchedVariant.name;
          item.path = matchedProduct.path;
        }

        clean.push({
          id: String(productId) + '-' + String(variantId),
          productId: productId,
          variantId: variantId,
          path: item.path || 'crusader-r6-full',
          name: name,
          variantName: variantName,
          price: price,
          quantity: Math.max(1, parseInt(item.quantity) || 1),
          image: item.image || '/assets/images/bearcheats_head.png'
        });
      }

      if (clean.length !== raw.length) {
        localStorage.setItem('bearcheats_cart', JSON.stringify(clean));
      }
      return clean;
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
    var cartLinks = document.querySelectorAll('a[href="/cart"], a[aria-label="Cart"]');

    cartLinks.forEach(function(link) {
      var badge = link.querySelector('.cart-badge-count');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cart-badge-count';
          badge.style.cssText = 'position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-size:11px;font-weight:700;min-width:18px;height:18px;line-height:18px;padding:0 4px;border-radius:9999px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.5);z-index:10;pointer-events:none;';
          link.style.position = 'relative';
          link.appendChild(badge);
        }
        badge.textContent = count;
        badge.style.display = 'flex';
      } else if (badge) {
        badge.style.display = 'none';
      }
    });

    var existingBadges = document.querySelectorAll('.header-cart-badge, [class*="cart-badge"]:not(.cart-badge-count)');
    existingBadges.forEach(function(b) {
      b.textContent = count;
      b.style.display = count > 0 ? '' : 'none';
    });
  }
  updateCartBadges();

  var addToCartBtn = document.querySelector('.product-actions__buttons button:first-child');
  var buyNowBtn = document.querySelector('.product-actions__buttons button:last-child');

  function addItemToCart() {
    var product = resolveCurrentProduct();
    var variant = resolveCurrentVariant(product);
    var mainImage = document.querySelector('.product-gallery__main img') || document.querySelector('.product-page img');
    var imageSrc = mainImage ? (mainImage.getAttribute('src') || '') : '/assets/images/bearcheats_head.png';
    var titleEl = document.querySelector('.product-page__title h1') || document.querySelector('.product-page__title') || document.querySelector('h1');
    var displayTitle = (product && product.name) ? product.name : 'Arc Raiders';

    var qty = Math.max(1, quantityVal || 1);
    var cart = getCart();
    var itemId = String(product.id) + '-' + String(variant.id);
    var existingIndex = -1;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === itemId || (cart[i].productId === product.id && cart[i].variantId === variant.id)) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + qty;
    } else {
      cart.push({
        id: itemId,
        productId: Number(product.id),
        variantId: Number(variant.id),
        path: product.path,
        name: displayTitle,
        variantName: variant.name,
        price: parseFloat(variant.price),
        quantity: qty,
        image: imageSrc
      });
    }

    saveCart(cart);
  }

  if (addToCartBtn && addToCartBtn.textContent.toLowerCase().includes('cart')) {
    addToCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      addItemToCart();

      var origHtml = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = '<span class="inline-flex items-center gap-2"><span style="color:#d97706;">✓</span><span>Added to Cart</span></span>';
      addToCartBtn.style.borderColor = '#d97706';
      setTimeout(function() {
        addToCartBtn.innerHTML = origHtml;
        addToCartBtn.style.borderColor = '';
      }, 1500);
    });
  }

  if (buyNowBtn && buyNowBtn.textContent.toLowerCase().includes('buy')) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      addItemToCart();
      window.location.href = '/cart';
    });
  }

  function initCartPage() {
    var isCartPage = window.location.pathname.indexOf('/cart') !== -1;
    if (!isCartPage) return;

    var cartCard = document.querySelector('.cart-page__main .cart-card');
    if (!cartCard) return;

    var cartEmpty = cartCard.querySelector('.cart-empty');
    var titleEl = cartCard.querySelector('.cart-card__title');
    var subtotalEl = document.querySelector('.cart-summary__row:not(.cart-summary__row--total) span:last-child');
    var totalEl = document.querySelector('.cart-summary__row--total span:last-child');
    var checkoutBtn = document.querySelector('.checkout-form__button');
    var emailInput = document.getElementById('checkout-email');

    function renderCart() {
      var cart = getCart();
      var totalItems = cart.reduce(function(sum, it) { return sum + (it.quantity || 1); }, 0);
      var subtotal = cart.reduce(function(sum, it) { return sum + (it.price * (it.quantity || 1)); }, 0);

      if (titleEl) titleEl.textContent = 'Cart Items (' + totalItems + ')';
      if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
      if (totalEl) totalEl.textContent = '$' + subtotal.toFixed(2);

      var existingItemsList = cartCard.querySelector('.cart-items');

      if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = '';
        if (existingItemsList) existingItemsList.remove();
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
      }

      if (cartEmpty) cartEmpty.style.display = 'none';
      if (checkoutBtn) checkoutBtn.disabled = false;

      var itemsContainer = existingItemsList;
      if (!itemsContainer) {
        itemsContainer = document.createElement('div');
        itemsContainer.className = 'cart-items';
        var header = cartCard.querySelector('.cart-card__header');
        if (header && header.nextSibling) {
          cartCard.insertBefore(itemsContainer, header.nextSibling);
        } else {
          cartCard.appendChild(itemsContainer);
        }
      }

      itemsContainer.innerHTML = '';

      cart.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.className = 'cart-item';
        row.setAttribute('data-id', item.id);

        var itemTotal = ((item.price || 0) * (item.quantity || 1)).toFixed(2);
        var imgSrc = item.image || '/assets/images/bearcheats_head.png';
        var displayName = item.name ? item.name.replace(/^Ancient\s*-\s*/i, '') : 'Arc Raiders';

        row.innerHTML = '<div class="cart-item__image">' +
          '<img src="' + imgSrc + '" alt="' + displayName + '" style="position:absolute;height:100%;width:100%;inset:0;object-fit:cover;border-radius:inherit;" />' +
          '</div>' +
          '<div class="cart-item__info">' +
          '<h3 class="cart-item__name">' + displayName + '</h3>' +
          '<div class="cart-item__variant">' + (item.variantName || '1 Day Key') + '</div>' +
          '<div class="cart-item__unit-price">$' + (item.price || 0).toFixed(2) + ' each</div>' +
          '</div>' +
          '<div class="cart-item__quantity">' +
          '<div class="quantity-selector">' +
          '<div class="quantity-selector__controls">' +
          '<button type="button" class="quantity-selector__btn cart-qty-minus" aria-label="Decrease quantity">' +
          '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 13q-.425 0-.712-.288T5 12t.288-.712T6 11h12q.425 0 .713.288T19 12t-.288.713T18 13z"/></svg>' +
          '</button>' +
          '<input type="number" class="quantity-selector__input" min="1" max="99" value="' + item.quantity + '" readonly />' +
          '<button type="button" class="quantity-selector__btn cart-qty-plus" aria-label="Increase quantity">' +
          '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/></svg>' +
          '</button>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="cart-item__total">' +
          '<div class="cart-item__price">$' + itemTotal + '</div>' +
          '</div>' +
          '<button type="button" class="cart-item__remove" aria-label="Remove item">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>';

        var minusBtn = row.querySelector('.cart-qty-minus');
        var plusBtn = row.querySelector('.cart-qty-plus');
        var removeBtn = row.querySelector('.cart-item__remove');

        minusBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var currentCart = getCart();
          if (currentCart[idx]) {
            if (currentCart[idx].quantity > 1) {
              currentCart[idx].quantity--;
            } else {
              currentCart.splice(idx, 1);
            }
            saveCart(currentCart);
            renderCart();
          }
        });

        plusBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var currentCart = getCart();
          if (currentCart[idx]) {
            currentCart[idx].quantity = (currentCart[idx].quantity || 1) + 1;
            saveCart(currentCart);
            renderCart();
          }
        });

        removeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var currentCart = getCart();
          currentCart.splice(idx, 1);
          saveCart(currentCart);
          renderCart();
        });

        itemsContainer.appendChild(row);
      });
    }

    renderCart();

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var cart = getCart();
        if (!cart.length) return;

        var origHtml = checkoutBtn.innerHTML;
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin w-5 h-5 text-current" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg><span>Redirecting to Checkout...</span></span>';

        var email = emailInput ? emailInput.value.trim() : '';
        var payload = {
          cart: cart.map(function(item) {
            return {
              productId: Number(item.productId),
              variantId: Number(item.variantId),
              quantity: Number(item.quantity || 1)
            };
          })
        };

        if (email && email.includes('@')) {
          payload.email = email;
        }

        fetch('https://api.sellauth.com/v1/shops/255381/checkout', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 6151040|OcCgJWN7HCCkz1LCkKJfKbxqSQOunx85BD1jZ55H9b5cc923',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(function(res) {
          return res.json().then(function(data) {
            if (!res.ok) {
              var msg = (data && (data.error || data.message)) || ('Error ' + res.status);
              throw new Error(msg);
            }
            return data;
          });
        })
        .then(function(data) {
          var targetUrl = data.url || data.invoice_url;
          if (targetUrl) {
            localStorage.removeItem('bearcheats_cart');
            window.location.href = targetUrl;
          } else {
            throw new Error('No url returned');
          }
        })
        .catch(function(err) {
          console.error(err);
          checkoutBtn.disabled = false;
          checkoutBtn.innerHTML = origHtml;
          var errNotice = document.querySelector('.checkout-error-notice');
          if (!errNotice) {
            errNotice = document.createElement('div');
            errNotice.className = 'checkout-error-notice';
            errNotice.style.cssText = 'color:#ef4444;font-size:13px;margin-top:8px;text-align:center;font-weight:500;';
            checkoutBtn.parentNode.insertBefore(errNotice, checkoutBtn.nextSibling);
          }
          errNotice.textContent = err.message || 'Unable to create checkout session. Please try again.';
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
  } else {
    initCartPage();
  }

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

  (function initGroupFilters() {
    function setup() {
      var filterContainer = document.querySelector('.group-filter__controls');
      if (!filterContainer) return;

      var filterBtns = filterContainer.querySelectorAll('.group-filter__btn');
      var statusGroups = document.querySelectorAll('.status-group');
      var reviewCards = document.querySelectorAll('.reviews-card');

      function filterByText(targetText) {
        var normTarget = (targetText || 'ALL').trim().toUpperCase();

        filterBtns.forEach(function(b) {
          var bText = b.textContent.trim().toUpperCase();
          if (normTarget === 'ALL' ? bText === 'ALL' : bText === normTarget) {
            b.classList.add('group-filter__btn--active');
          } else {
            b.classList.remove('group-filter__btn--active');
          }
        });

        if (statusGroups.length) {
          statusGroups.forEach(function(grp) {
            var nameEl = grp.querySelector('.status-group__name, h3, h4');
            var groupName = (nameEl ? nameEl.textContent : '').trim().toUpperCase();
            if (normTarget === 'ALL' || groupName === normTarget || groupName.includes(normTarget) || normTarget.includes(groupName)) {
              grp.style.display = '';
            } else {
              grp.style.display = 'none';
            }
          });
        }

        if (reviewCards.length) {
          reviewCards.forEach(function(card) {
            var pLink = card.querySelector('.reviews-product-link');
            var href = pLink ? (pLink.getAttribute('href') || '').toLowerCase() : '';
            var pName = card.querySelector('.reviews-product-name');
            var nameText = pName ? pName.textContent.trim().toUpperCase() : '';
            if (normTarget === 'ALL') {
              card.style.display = '';
            } else {
              var targetSlug = normTarget.toLowerCase().replace(/[^a-z0-9]/g, '-');
              if (href.includes(targetSlug) || nameText.includes(normTarget)) {
                card.style.display = '';
              } else {
                card.style.display = 'none';
              }
            }
          });
        }
      }

      filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var text = btn.textContent.trim();
          filterByText(text);
          var href = btn.getAttribute('href');
          if (href && window.history && window.history.pushState) {
            window.history.pushState(null, '', href);
          }
        });
      });

      var urlParams = new URLSearchParams(window.location.search);
      var groupParam = urlParams.get('group') || urlParams.get('game');
      if (groupParam) {
        var foundBtn = null;
        filterBtns.forEach(function(b) {
          var href = b.getAttribute('href') || '';
          if (href.includes(groupParam)) foundBtn = b;
        });
        if (foundBtn) {
          filterByText(foundBtn.textContent.trim());
        }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  })();

})();

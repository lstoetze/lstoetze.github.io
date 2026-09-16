document.addEventListener("DOMContentLoaded", function () {
  var CUSTOM_HIGHLIGHT_NAME = "search";
  var FILTER_GROUPS = ["method", "topic", "context"];

  var getTextNodesInElementContainingText = function (element, text) {
    var nodes = [];
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.toLowerCase().indexOf(text) !== -1) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  var getRangesForSearchTermInNode = function (node, search) {
    var ranges = [];
    var text = (node.textContent ? node.textContent.toLowerCase() : "") || "";
    var start = 0;
    var index;
    while ((index = text.indexOf(search, start)) >= 0) {
      var range = new Range();
      range.setStart(node, index);
      range.setEnd(node, index + search.length);
      ranges.push(range);
      start = index + search.length;
    }
    return ranges;
  };

  // Highlights `search` within elements matching `selector` (if the browser
  // supports the CSS Custom Highlight API) and returns the elements that did
  // not contain a match, so callers can hide them.
  var highlightSearchTerm = function (search, selector) {
    if (!CSS.highlights) return null;

    CSS.highlights.delete(CUSTOM_HIGHLIGHT_NAME);
    if (!search) return null;

    var ranges = [];
    var nonMatchingElements = [];
    var elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, function (element) {
      var match = false;
      getTextNodesInElementContainingText(element, search).forEach(function (node) {
        var rangesForSearch = getRangesForSearchTermInNode(node, search);
        ranges.push.apply(ranges, rangesForSearch);
        if (rangesForSearch.length > 0) match = true;
      });
      if (!match) nonMatchingElements.push(element);
    });

    if (ranges.length === 0) return nonMatchingElements;
    CSS.highlights.set(CUSTOM_HIGHLIGHT_NAME, new Highlight(...ranges));
    return nonMatchingElements;
  };

  // Hides year/status headings whose entire group of entries is unloaded.
  var updateGroupVisibility = function () {
    document.querySelectorAll(".publications > h2").forEach(function (heading) {
      var iterator = heading.nextElementSibling;
      var hideHeading = true;
      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          var unloadedSiblings = iterator.querySelectorAll(":scope > li.unloaded");
          var totalSiblings = iterator.querySelectorAll(":scope > li");
          if (totalSiblings.length > 0 && unloadedSiblings.length === totalSiblings.length) {
            iterator.classList.add("unloaded");
          } else if (totalSiblings.length > 0) {
            hideHeading = false;
          }
        }
        iterator = iterator.nextElementSibling;
      }
      heading.classList.toggle("unloaded", hideHeading);
    });
  };

  var resetUnloaded = function () {
    document.querySelectorAll(".bibliography, .unloaded").forEach(function (element) {
      element.classList.remove("unloaded");
    });
    if (CSS.highlights) CSS.highlights.delete(CUSTOM_HIGHLIGHT_NAME);
  };

  var filterByText = function (searchTerm) {
    resetUnloaded();

    if (CSS.highlights) {
      var nonMatchingElements = highlightSearchTerm(searchTerm, ".bibliography > li");
      if (nonMatchingElements == null) {
        updateGroupVisibility();
        return;
      }
      nonMatchingElements.forEach(function (element) {
        element.classList.add("unloaded");
      });
    } else {
      document.querySelectorAll(".bibliography > li").forEach(function (element) {
        var text = element.innerText.toLowerCase();
        if (text.indexOf(searchTerm) === -1) {
          element.classList.add("unloaded");
        }
      });
    }

    updateGroupVisibility();
  };

  // Independent selection per filter dimension (method / topic / context);
  // an entry must match every active dimension (AND across rows).
  var activeFilters = { method: "all", topic: "all", context: "all" };

  var filterByLabels = function () {
    resetUnloaded();

    var anyActive = FILTER_GROUPS.some(function (group) {
      return activeFilters[group] !== "all";
    });

    if (anyActive) {
      document.querySelectorAll(".bibliography > li").forEach(function (li) {
        var matches = FILTER_GROUPS.every(function (group) {
          if (activeFilters[group] === "all") return true;
          var badges = li.querySelectorAll(".topic-badge[data-" + group + "]");
          return Array.prototype.some.call(badges, function (badge) {
            return badge.dataset[group] === activeFilters[group];
          });
        });
        if (!matches) li.classList.add("unloaded");
      });
    }

    updateGroupVisibility();
  };

  var setActiveFilterButtons = function () {
    document.querySelectorAll(".topic-filter").forEach(function (group) {
      var dimension = group.dataset.filterGroup;
      group.querySelectorAll(".topic-filter-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.value === activeFilters[dimension]);
      });
    });
  };

  var resetActiveFilters = function () {
    FILTER_GROUPS.forEach(function (group) {
      activeFilters[group] = "all";
    });
  };

  var encodeFiltersToHash = function () {
    var parts = [];
    FILTER_GROUPS.forEach(function (group) {
      if (activeFilters[group] !== "all") parts.push(group + ":" + activeFilters[group]);
    });
    return parts.join(";");
  };

  var parseFiltersFromHash = function (hashValue) {
    return hashValue.split(";").some(function (piece) {
      var idx = piece.indexOf(":");
      return idx > 0 && FILTER_GROUPS.indexOf(piece.slice(0, idx)) !== -1;
    });
  };

  var searchInput = document.getElementById("bibsearch");

  var updateFromHash = function () {
    var hashValue = decodeURIComponent(window.location.hash.substring(1));

    if (hashValue && parseFiltersFromHash(hashValue)) {
      resetActiveFilters();
      hashValue.split(";").forEach(function (piece) {
        var idx = piece.indexOf(":");
        if (idx === -1) return;
        var group = piece.slice(0, idx);
        var value = piece.slice(idx + 1);
        if (FILTER_GROUPS.indexOf(group) !== -1) activeFilters[group] = value;
      });
      if (searchInput) searchInput.value = "";
      setActiveFilterButtons();
      filterByLabels();
    } else {
      resetActiveFilters();
      setActiveFilterButtons();
      if (searchInput) searchInput.value = hashValue;
      filterByText(hashValue.toLowerCase());
    }
  };

  if (searchInput) {
    var timeoutId;
    searchInput.addEventListener("input", function () {
      resetActiveFilters();
      setActiveFilterButtons();
      clearTimeout(timeoutId);
      var searchTerm = this.value.toLowerCase();
      timeoutId = setTimeout(function () {
        filterByText(searchTerm);
      }, 300);
    });
  }

  document.querySelectorAll(".topic-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = this.closest(".topic-filter");
      var dimension = group.dataset.filterGroup;
      var value = this.dataset.value;
      var alreadyActive = this.classList.contains("active");
      activeFilters[dimension] = alreadyActive && value !== "all" ? "all" : value;

      var nextHash = encodeFiltersToHash();
      if (window.location.hash.substring(1) === nextHash) {
        // Hash unchanged (e.g. toggling back to "all" from empty state) so
        // the hashchange event won't fire; apply directly.
        setActiveFilterButtons();
        if (searchInput) searchInput.value = "";
        filterByLabels();
      } else {
        window.location.hash = nextHash;
      }
    });
  });

  window.addEventListener("hashchange", updateFromHash);
  if (searchInput || document.querySelector(".topic-filter-btn")) {
    updateFromHash();
  }
});

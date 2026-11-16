document.addEventListener("DOMContentLoaded", function () {
  var CUSTOM_HIGHLIGHT_NAME = "search";

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

  var filterByTopic = function (topicSlug) {
    resetUnloaded();

    if (topicSlug && topicSlug !== "all") {
      document.querySelectorAll(".bibliography > li").forEach(function (li) {
        var badges = li.querySelectorAll(".topic-badge");
        var match = Array.prototype.some.call(badges, function (badge) {
          return badge.dataset.topic === topicSlug;
        });
        if (!match) li.classList.add("unloaded");
      });
    }

    updateGroupVisibility();
  };

  var setActiveTopicButton = function (topicSlug) {
    document.querySelectorAll(".topic-filter-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.topic === (topicSlug || "all"));
    });
  };

  var updateFromHash = function () {
    var hashValue = decodeURIComponent(window.location.hash.substring(1));
    var searchInput = document.getElementById("bibsearch");

    if (hashValue.indexOf("topic:") === 0) {
      var topicSlug = hashValue.slice("topic:".length);
      if (searchInput) searchInput.value = "";
      setActiveTopicButton(topicSlug);
      filterByTopic(topicSlug);
    } else {
      setActiveTopicButton("all");
      if (searchInput) searchInput.value = hashValue;
      filterByText(hashValue.toLowerCase());
    }
  };

  var searchInput = document.getElementById("bibsearch");
  if (searchInput) {
    var timeoutId;
    searchInput.addEventListener("input", function () {
      setActiveTopicButton("all");
      clearTimeout(timeoutId);
      var searchTerm = this.value.toLowerCase();
      timeoutId = setTimeout(function () {
        filterByText(searchTerm);
      }, 300);
    });
  }

  document.querySelectorAll(".topic-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var topicSlug = this.dataset.topic;
      var alreadyActive = this.classList.contains("active");
      var nextSlug = alreadyActive && topicSlug !== "all" ? "all" : topicSlug;
      window.location.hash = nextSlug === "all" ? "" : "topic:" + nextSlug;
      // If the hash didn't actually change (e.g. already empty), react directly.
      setActiveTopicButton(nextSlug);
      if (searchInput) searchInput.value = "";
      filterByTopic(nextSlug);
    });
  });

  window.addEventListener("hashchange", updateFromHash);
  if (searchInput || document.querySelector(".topic-filter-btn")) {
    updateFromHash();
  }
});

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

  var filterItems = function (searchTerm) {
    document.querySelectorAll(".bibliography, .unloaded").forEach(function (element) {
      element.classList.remove("unloaded");
    });

    if (CSS.highlights) {
      var nonMatchingElements = highlightSearchTerm(searchTerm, ".bibliography > li");
      if (nonMatchingElements == null) return;
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

    // Hide section/year headings whose entire group got filtered out.
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

  var updateInputField = function () {
    var hashValue = decodeURIComponent(window.location.hash.substring(1));
    var input = document.getElementById("bibsearch");
    if (!input) return;
    input.value = hashValue;
    filterItems(hashValue.toLowerCase());
  };

  var input = document.getElementById("bibsearch");
  if (!input) return;

  var timeoutId;
  input.addEventListener("input", function () {
    clearTimeout(timeoutId);
    var searchTerm = this.value.toLowerCase();
    timeoutId = setTimeout(function () {
      filterItems(searchTerm);
    }, 300);
  });

  window.addEventListener("hashchange", updateInputField);
  updateInputField();
});

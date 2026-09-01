document.addEventListener("DOMContentLoaded", function () {
  var elements = document.querySelectorAll(".citation-count[data-doi]");

  elements.forEach(function (el) {
    var doi = el.getAttribute("data-doi");
    if (!doi) return;

    fetch("https://api.openalex.org/works/https://doi.org/" + doi)
      .then(function (res) {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(function (data) {
        var count = data.cited_by_count;
        if (typeof count !== "number" || count <= 0) return;
        el.textContent = count === 1 ? "1 citation" : count + " citations";
        el.style.display = "inline-block";
      })
      .catch(function () {
        // Leave the element hidden if the lookup fails or the work isn't indexed.
      });
  });
});

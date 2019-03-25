var slideshow = remark.create({
  sourceUrl: 'slides.md',
  highlightLines: true,
  navigation: {
    scroll: false,
    touch: true,
    click: false
  },
});

// Hackish way to add start attribute to ol tag for one of the slides.
setTimeout(function () {
  document.querySelector('#slide-user-stories-cont ol').setAttribute("start", 4);
}, 2000);


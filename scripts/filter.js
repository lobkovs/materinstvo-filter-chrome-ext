(function () {
	console.info('Materinstvo Filter, Run filter!')
  let isScroll = false
  chrome.storage.sync.get('items', function(data) {
  	let items = data.items

    if (!items.length) {
      scrollTo($('body'))
    }

    $('div[id^="orders_row"]').each(function() {
    	// Если массив пуст, тогда покажем все элементы
    	if (!items.length) {
    		$(this).show()
    		return true
    	}

      let title = +$(this).find('.ftitle').text();
      if (isInArray(items, title)) {
        scrollTo($(this))
        return true;
      } else {
        $(this).hide();
      }
    })
  });

  function isInArray(array, search) {
    return array.indexOf(search) >= 0;
  }

  function scrollTo (item) {
    if (!isScroll) {
      $('html, body').animate({
        scrollTop: $(item).offset().top
      }, 500);
      isScroll = true
    }
  }
})()
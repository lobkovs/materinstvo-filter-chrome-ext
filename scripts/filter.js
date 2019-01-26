(function () {
	console.info('Materinstvo Filter, Run filter!')
  chrome.storage.sync.get('items', function(data) {
  	let items = data.items
    $('div[id^="orders_row"]').each(function() {
    	// Если массив пуст, тогда покажем все элементы
    	if (!items.length) {
    		$(this).show()
    		return true
    	}

      let title = +$(this).find('.ftitle').text();
      if (isInArray(items, title)) {
        return true;
      } else {
        $(this).hide();
      }
    })
  });

  function isInArray(array, search) {
    return array.indexOf(search) >= 0;
  }
})()
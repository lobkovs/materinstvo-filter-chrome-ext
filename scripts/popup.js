var app = new Vue({
  el: '#app',
  data () {
    return {
      inputArray: "",
      separators: [',', ';', '.'],
      rangeSeparator: '-',
    }
  },
  created () {
    // Выведем предыдущие элементы
    chrome.storage.sync.get('items', data => {
      if (data.items) {
        this.inputArray = data.items.join(', ')
      }
    })
  },
  mounted () {
    // Установим фокус на поле ввода
    this.$refs.numbers.focus()
  },
  watch: {
    // Защита от ввода букв и спец. символов
    inputArray: function (newWord) {
      this.inputArray = newWord.replace(/[^\d,;\.\-\s]/g, '')
    }
  },
  computed: {
    // Возвращает актуальный массив из строки
    indexes () {
      let split = this.inputArray.split(this.getRegExp) || []
      // Убираем пустые и возвращаем массив чисел
      return split.reduce((acc, item) => {
        // item = item.toString().trim()
        if (item.includes(this.rangeSeparator)) {
          return acc.concat(this.getRangeArray(item))
        } else {
          return acc.concat(+item)
        }
      }, [])
    },
    getRegExp () {
      return new RegExp(`[${this.separators.join('|')}]`, 'g')
    }
  },
  methods: {
    getRangeArray (item) {
      const split = item.split(this.rangeSeparator)
      // Init vars
      let rangeArray = []
      let startItem = 0

      const last = +split.pop()
      const first = +split.shift()

      let diffCount

      // Revert if first more last and init start value
      if (first > last) {
        diffCount = first - last
        startItem = last
      } else {
        diffCount = last - first
        startItem = first
      }

      // Create range array
      for (let i = 0; i <= diffCount; i++) {
        rangeArray.push(startItem + i)
      }

      return rangeArray
    },
    doFilter () {
      // Положим в chrome хранилице введённые пользователем номера
      chrome.storage.sync.set({ items: this.indexes }, function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          // Подключим jQuery
          chrome.tabs.executeScript(tabs[0].id, {file:"vendor/jquery.min.js"}, function(result){
            // Выполним основной код фильтрации
            chrome.tabs.executeScript(tabs[0].id, {file:"scripts/filter.js"});
          })
        })
      });
    },
    clear () {
      this.inputArray = ""
      this.doFilter()
    }
  }
})
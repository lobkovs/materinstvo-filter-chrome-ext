var app = new Vue({
  el: '#app',
  data () {
    return {
      inputArray: "",
      separators: [',', ';', '.']
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
      this.inputArray = newWord.replace(/[^\d,;\.\s]/g, '')
    }
  },
  computed: {
    // Возвращает актуальный массив из строки
    indexes () {
      let split = this.inputArray ? this.inputArray.split(this.getRegExp) : []
      // Убираем пустые и возвращаем массив чисел
      return split.map(x => parseInt(x))
    },
    getRegExp () {
      return new RegExp(`[${this.separators.join('|')}]`, 'g')
    }
  },
  methods: {
    filter () {
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
      this.filter()
    }
  }
})
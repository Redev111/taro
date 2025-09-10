const DEEPSEEK_API_KEY = "sk-8c8051f46dd84677b6f008887eadbf54";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

const russianToEnglishCardMap = {
  "Маг": "the-magician",
  "Жрица": "the-high-priestess",
  "Императрица": "the-empress",
  "Император": "the-emperor",
  "Жрец": "the-hierophant",
  "Любовник": "the-lovers",
  "Колесница": "the-chariot",
  "Сила": "strength",
  "Правосудие": "justice",
  "Отшельник": "the-hermit",
  "Колесо Фортуны": "the-wheel-of-fortune",
  "Повешенный": "the-hanged-man",
  "Смерть": "death",
  "Умеренность": "temperance",
  "Дьявол": "the-devil",
  "Башня": "the-tower",
  "Звезда": "the-star",
  "Луна": "the-moon",
  "Солнце": "the-sun",
  "Суд": "judgement",
  "Мир": "the-world",
  "Туз жезлов": "ace-of-wands",
  "Двойка жезлов": "two-of-wands",
  "Тройка жезлов": "three-of-wands",
  "Четвёрка жезлов": "four-of-wands",
  "Пятёрка жезлов": "five-of-wands",
  "Шестёрка жезлов": "six-of-wands",
  "Семёрка жезлов": "seven-of-wands",
  "Восьмёрка жезлов": "eight-of-wands",
  "Девятка жезлов": "nine-of-wands",
  "Десятка жезлов": "ten-of-wands",
  "Туз кубков": "ace-of-cups",
  "Двойка кубков": "two-of-cups",
  "Тройка кубков": "three-of-cups",
  "Четвёрка кубков": "four-of-cups",
  "Пятёрка кубков": "five-of-cups",
  "Шестёрка кубков": "six-of-cups",
  "Семёрка кубков": "seven-of-cups",
  "Восьмёрка кубков": "eight-of-cups",
  "Девятка кубков": "nine-of-cups",
  "Десятка кубков": "ten-of-cups",
  "Туз мечей": "ace-of-swords",
  "Двойка мечей": "two-of-swords",
  "Тройка мечей": "three-of-swords",
  "Четвёрка мечей": "four-of-swords",
  "Пятёрка мечей": "five-of-swords",
  "Шестёрка мечей": "six-of-swords",
  "Семёрка мечей": "seven-of-swords",
  "Восьмёрка мечей": "eight-of-swords",
  "Девятка мечей": "nine-of-swords",
  "Десятка мечей": "ten-of-swords",
  "Туз пентаклей": "ace-of-pentacles",
  "Двойка пентаклей": "two-of-pentacles",
  "Тройка пентаклей": "three-of-pentacles",
  "Четвёрка пентаклей": "four-of-pentacles",
  "Пятёрка пентаклей": "five-of-pentacles",
  "Шестёрка пентаклей": "six-of-pentacles",
  "Семёрка пентаклей": "seven-of-pentacles",
  "Восьмёрка пентаклей": "eight-of-pentacles",
  "Девятка пентаклей": "nine-of-pentacles",
  "Десятка пентаклей": "ten-of-pentacles",
  "Паж жезлов": "page-of-wands",
  "Рыцарь жезлов": "knight-of-wands",
  "Королева жезлов": "queen-of-wands",
  "Король жезлов": "king-of-wands",
  "Паж кубков": "page-of-cups",
  "Рыцарь кубков": "knight-of-cups",
  "Королева кубков": "queen-of-cups",
  "Король кубков": "king-of-cups",
  "Паж мечей": "page-of-swords",
  "Рыцарь мечей": "knight-of-swords",
  "Королева мечей": "queen-of-swords",
  "Король мечей": "king-of-swords",
  "Паж пентаклей": "page-of-pentacles",
  "Рыцарь пентаклей": "knight-of-pentacles",
  "Королева пентаклей": "queen-of-pentacles",
  "Король пентаклей": "king-of-pentacles"
};

const questionInput = document.getElementById('question');
const resultDiv = document.getElementById('result');
const cardsContainer = document.getElementById('cards');
const interpretationEl = document.getElementById('interpretation');

const nameInput = document.getElementById('name');
const birthDateInput = document.getElementById('birth-date');

const clearBtn = document.getElementById('clear');
const shortDrawBtn = document.getElementById('short-draw');
const fullDrawBtn = document.getElementById('full-draw');
const voiceBtn = document.getElementById('voice-input');

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    questionInput.value = '';
    nameInput.value = '';
    birthDateInput.value = '';
  });
}

if (shortDrawBtn) {
  shortDrawBtn.addEventListener('click', () => {
    const question = questionInput.value.trim();
    if (!question) return alert('Введите вопрос!');
    makeTarotReading(question, 3);
  });
}

if (fullDrawBtn) {
  fullDrawBtn.addEventListener('click', () => {
    const question = questionInput.value.trim();
    if (!question) return alert('Введите вопрос!');
    makeTarotReading(question, 5);
  });
}

if (voiceBtn) {
  let isListening = false;

  voiceBtn.addEventListener('click', () => {
    if (isListening) return;

    isListening = true;
    voiceBtn.innerText = '🎙️ Слушаю...';
    voiceBtn.style.background = '#e74c3c';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Голосовой ввод не поддерживается в этом браузере.');
      isListening = false;
      voiceBtn.innerText = '🎙️ Голос';
      voiceBtn.style.background = '#2ecc71';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      questionInput.value = transcript;
      isListening = false;
      voiceBtn.innerText = '🎙️ Голос';
      voiceBtn.style.background = '#2ecc71';
    };

    recognition.onerror = (event) => {
      console.error('Ошибка распознавания:', event.error);
      isListening = false;
      voiceBtn.innerText = '🎙️ Голос';
      voiceBtn.style.background = '#2ecc71';
      alert('Ошибка распознавания голоса: ' + event.error);
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognition.start();
  });
}

async function makeTarotReading(question, cardCount) {
  const button = shortDrawBtn === document.activeElement ? shortDrawBtn : fullDrawBtn;
  if (button) {
    button.disabled = true;
    button.innerText = '🔮 Делаю расклад...';
  }

  try {
    const context = [
      `Имя пользователя: ${nameInput.value.trim() || 'не указано'}`,
      `Дата рождения: ${birthDateInput.value.trim() || 'не указана'}`,
      `Количество карт: ${cardCount}`
    ].filter(line => line).join('\n');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Ты — мистический раскладчик Таро на русском языке. Отвечай **ТОЛЬКО на русском языке**.
              Не используй ни одного английского слова, даже если оно звучит красиво или профессионально.
              Если тебе нужно объяснить понятие, которое часто используется на английском (например, "fulfillment", "consciousness"), 
              замени его на русский эквивалент: "удовлетворение", "осознанность", "внутреннее состояние", "духовное развитие" и т.п.
              Пользователь задал вопрос: "${question}".
              У него есть дополнительная информация:
              ${context}
              В ответе верни ТОЛЬКО JSON в формате: { ... } без кодировок, обёрток, комментариев или других символов. Никаких \`\`\`json, никаких #, никаких объяснений.
              Формат:
              {
                "cards": ["название1", "название2", ...],
                "interpretation": "краткое обобщение",
                "detailed": {
                  "card1": {
                    "name": "название",
                    "meaning": "подробное значение",
                    "insight": "что это значит сейчас",
                    "advice": "совет"
                  },
                  "card2": { ... }
                },
                "overall": "Общий вывод с советами: ... (5-10 предложений, глубоко, с эмпатией)"
              }
              Названия карт на русском: Маг, Жрица, Императрица, Император, Жрец, Любовник, Колесница, Сила, Правосудие, Колесо Фортуны, Отшельник, Смерть, Умеренность, Дьявол, Башня, Звезда, Луна, Солнце, Суд, Мир, Туз жезлов, Двойка кубков, Король мечей и т.д.
              Толкование должно быть глубоким, эмоциональным, с советами.
              Все слова должны быть на русском языке. Английские слова запрещены.
              Если ты не знаешь русское слово — используй фразу на русском, которая передаст смысл.
              `
          },
          {
            role: "user",
            content: `Сделай расклад из ${cardCount} карт. Вопрос: ${question}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка API: ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log("Ответ от ИИ:", reply);

    let result;
    try {
      result = JSON.parse(reply);
    } catch (e) {
      throw new Error("Не удалось распарсить JSON. Ответ ИИ: " + reply);
    }

    if (!result.cards || !Array.isArray(result.cards)) {
      throw new Error("Некорректный формат: нет массива карт.");
    }

    cardsContainer.innerHTML = '';
    result.cards.forEach(cardName => {
      const englishFileName = russianToEnglishCardMap[cardName] || cardName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (!englishFileName) {
        console.warn(`Не найден файл для карты: ${cardName}`);
        return;
      }

      const div = document.createElement('div');
      div.className = 'card';
      div.style.backgroundImage = `url(assets/cards/${englishFileName}.jpg)`;
      div.title = cardName;

      const nameDiv = document.createElement('div');
      nameDiv.className = 'card-name';
      nameDiv.innerText = cardName;
      div.appendChild(nameDiv);

      cardsContainer.appendChild(div);
    });

    interpretationEl.innerHTML = `<p><strong>🔮 Общее толкование:</strong></p><p>${result.interpretation}</p>`;
    
    if (result.detailed) {
      const detailedDiv = document.createElement('div');
      detailedDiv.innerHTML = '<h3 style="margin-top: 25px; color: #e0d0ff; text-shadow: 0 0 5px #8e44ad;">📖 Подробное толкование карт:</h3>';
      Object.values(result.detailed).forEach(card => {
        detailedDiv.innerHTML += `
          <div style="margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 15px; border-left: 5px solid #9b59b6; text-align: left;">
            <strong style="color: #f1c40f; font-size: 18px;">${card.name}</strong><br><br>
            <strong>✨ Значение:</strong> ${card.meaning}<br><br>
            <strong>💡 Что это значит сейчас:</strong> ${card.insight}<br><br>
            <strong>🕊️ Совет:</strong> ${card.advice}
          </div>
        `;
      });
      interpretationEl.appendChild(detailedDiv);
    }

    if (result.overall) {
      const overallDiv = document.createElement('div');
      overallDiv.innerHTML = `
        <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #2c163e, #4a2a6a); border-radius: 20px; border: 2px solid #f1c40f; text-align: left; position: relative;">
          <h3 style="color: #f1c40f; margin-bottom: 15px; text-align: center; font-size: 22px;">🌟 Общий вывод и советы</h3>
          <p style="line-height: 1.8; font-size: 17px;">${result.overall}</p>
          <button id="share-btn" style="margin-top: 20px; padding: 12px 25px; background: #f1c40f; color: #2c163e; border: none; border-radius: 30px; font-weight: bold; cursor: pointer; display: block; margin: 20px auto 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">📤 Поделиться раскладом</button>
        </div>
      `;
      interpretationEl.appendChild(overallDiv);

      document.getElementById('share-btn').addEventListener('click', () => {
        const shareText = `
🔮 Мой расклад Таро:
Вопрос: "${question}"

Карты: ${result.cards.join(', ')}

Общее толкование:
${result.interpretation}

🌟 Общий вывод:
${result.overall}

— Сделано с помощью нейросети в приложении "Таро с ИИ"
        `.trim();

        if (navigator.share) {
          navigator.share({
            title: 'Мой расклад Таро',
            text: shareText,
            url: window.location.href
          }).catch(err => console.log('Ошибка при попытке поделиться:', err));
        } else {
          navigator.clipboard.writeText(shareText).then(() => {
            alert('Расклад скопирован! Можете вставить в WhatsApp, Telegram или соцсеть.');
          }).catch(err => {
            alert('Не удалось скопировать. Попробуйте вручную выделить текст выше.');
          });
        }
      });
    }

    resultDiv.classList.remove('hidden');

  } catch (error) {
    alert('Ошибка: ' + error.message);
    console.error(error);
  } finally {
    if (button) {
      button.disabled = false;
      button.innerText = button.id === 'short-draw' ? 'Краткий расклад (3 карты)' : 'Полный расклад (5 карт)';
    }
  }
}
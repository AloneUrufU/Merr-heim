document.addEventListener('DOMContentLoaded', () => {
  // Кнопка перехода назад (если есть)
  const backBtn = document.querySelector('.chronicle-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
  }

  // Кнопка возвращения к главной странице
  const returnHomeBtn = document.getElementById('returnHomeBtn');
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
  }

  // Панель быстрого перехода
  const quickNavPanel = document.getElementById('quickNavPanel');
  const quickNavToggle = document.getElementById('quickNavToggle');
  const pageInput = document.getElementById('pageInput');
  const goToPageBtn = document.getElementById('goToPageBtn');
  const pageList = document.getElementById('pageList');

  // --- ЛОГИКА СВОРАЧИВАНИЯ/РАЗВОРАЧИВАНИЯ ПАНЕЛИ ---
  if (quickNavToggle && quickNavPanel) {
    quickNavToggle.addEventListener('click', () => {
      // Переключаем класс 'collapsed' у содержимого панели
      // Это контролирует CSS-стили для скрытия/показа
      quickNavPanel.classList.toggle('collapsed'); // <-- Это добавляет/удаляет класс 'collapsed' у всей панели

      // Переключаем класс 'collapsed' у самой кнопки переключения
      // Это позволит стилизовать иконку кнопки (например, ее поворот)
      quickNavToggle.classList.toggle('collapsed');

      // Изменяем иконку SVG в зависимости от состояния
      const svgPath = quickNavToggle.querySelector('svg path');
      if (quickNavPanel.classList.contains('collapsed')) {
        // Если панель свернута, показываем иконку "плюс" или "развернуть"
        svgPath.setAttribute('d', 'M12 5v14M5 12h14'); // Иконка плюса
        quickNavToggle.setAttribute('aria-label', 'Показать панель');
        quickNavToggle.setAttribute('aria-expanded', 'false');
      } else {
        // Если панель развернута, показываем иконку "минус" или "свернуть"
        svgPath.setAttribute('d', 'M19 13H5v-2h14v2z'); // Иконка минуса
        quickNavToggle.setAttribute('aria-label', 'Скрыть панель');
        quickNavToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Переключение видимости панели
  //if (quickNavToggle && quickNavPanel) {
  //  quickNavToggle.addEventListener('click', () => {
  //    quickNavPanel.classList.toggle('collapsed');
  //    
      // Изменяем иконку
  //    const svg = quickNavToggle.querySelector('svg');
  //    if (quickNavPanel.classList.contains('collapsed')) {
  //      svg.innerHTML = '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>';
  //    } else {
  //      svg.innerHTML = '<path d="M19 13H5v-2h14v2z" fill="currentColor"/>';
  //    }
  //  });
  //}

  // Анимация "мерцания" пепла
  const ash = document.querySelector('.ash-overlay');
  if (ash) {
    setInterval(() => {
      ash.style.opacity = 0.13 + Math.random() * 0.15;
    }, 700);
  }

  // Хаотично раскиданные руны на обложке, не перекрывающие заголовок и символ
  const runeChars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᛗ','ᚾ','ᛃ','ᛚ','ᛖ','ᛏ','ᛉ','ᛟ','ᛞ','ᚷ','ᚺ'];
  const runeCount = 18;
  const cover = document.querySelector('.page.cover');
  const title = cover ? cover.querySelector('.book-title') : null;
  const engraving = cover ? cover.querySelector('.book-engraving') : null;
  if (cover) {
    // Получаем координаты запрещённых зон (относительно cover)
    let forbiddenZones = [];
    if (title) {
      const rect = title.getBoundingClientRect();
      const coverRect = cover.getBoundingClientRect();
      forbiddenZones.push({
        left: rect.left - coverRect.left - 20,
        top: rect.top - coverRect.top - 10,
        right: rect.right - coverRect.left + 20,
        bottom: rect.bottom - coverRect.top + 10
      });
    }
    if (engraving) {
      const rect = engraving.getBoundingClientRect();
      const coverRect = cover.getBoundingClientRect();
      forbiddenZones.push({
        left: rect.left - coverRect.left - 10,
        top: rect.top - coverRect.top - 10,
        right: rect.right - coverRect.left + 10,
        bottom: rect.bottom - coverRect.top + 10
      });
    }
    let placed = 0, tries = 0;
    while (placed < runeCount && tries < runeCount * 10) {
      tries++;
      const rune = document.createElement('span');
      rune.textContent = runeChars[Math.floor(Math.random() * runeChars.length)];
      rune.className = 'floating-rune';
      rune.style.fontSize = (1.2 + Math.random() * 2.8) + 'rem';
      rune.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);
      rune.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`;
      rune.style.zIndex = 6 + Math.floor(Math.random()*3);
      // Случайная позиция
      const coverW = cover.offsetWidth, coverH = cover.offsetHeight;
      const runeW = 32 + Math.random() * 32, runeH = 32 + Math.random() * 32;
      const left = Math.random() * (coverW - runeW);
      const top = Math.random() * (coverH - runeH);
      // Проверяем, не попадает ли в запрещённую зону
      let overlaps = false;
      for (const zone of forbiddenZones) {
        if (
          left + runeW > zone.left &&
          left < zone.right &&
          top + runeH > zone.top &&
          top < zone.bottom
        ) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;
      rune.style.left = left + 'px';
      rune.style.top = top + 'px';
      cover.appendChild(rune);
      rune.animate([
        { opacity: rune.style.opacity, filter: 'blur(0.5px)' },
        { opacity: 1, filter: 'blur(0px)' },
        { opacity: rune.style.opacity, filter: 'blur(1px)' }
      ], {
        duration: 1800 + Math.random() * 2200,
        iterations: Infinity,
        direction: 'alternate',
        delay: Math.random() * 2000
      });
      placed++;
    }
  }

  // Перелистывание страниц
  const pages = Array.from(document.querySelectorAll('.page'));
  const leftArrow = document.getElementById('arrow-left');
  const rightArrow = document.getElementById('arrow-right');
  let currentPage = 0; // 0 — обложка, далее: 1 — первый разворот (1+2)
  let flipping = false;

  function showPages(page) {
    let leftPage, rightPage;
    if (page === 0) {
      leftPage = 0;
      rightPage = null;
    } else if (page === 1 || page === 2) {
      leftPage = 1;
      rightPage = 2;
    } else if (page % 2 === 1) {
      leftPage = page;
      rightPage = page + 1;
    } else {
      leftPage = page - 1;
      rightPage = page;
    }
    pages.forEach((p, i) => {
      if (i === leftPage || i === rightPage) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
    if (leftPage === 0) {
      leftArrow.disabled = true;
      rightArrow.disabled = pages.length <= 2;
    } else {
      leftArrow.disabled = false;
      rightArrow.disabled = (rightPage !== null && rightPage + 1 >= pages.length);
    }
    updateActivePageItem(page);
  }

  function updateActivePageItem(page) {
    if (pageList) {
      const pageItems = pageList.querySelectorAll('.page-item');
      pageItems.forEach((item, index) => {
        const itemPage = parseInt(item.getAttribute('data-page'));
        if (itemPage === page) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  function flip(direction) {
    if (direction === 1 && currentPage === 0) {
      currentPage = 1;
      showPages(currentPage);
    } else if (direction === 1 && currentPage+2 < pages.length) {
      currentPage += 2;
      showPages(currentPage);
    } else if (direction === -1 && currentPage === 1) {
      currentPage = 0;
      showPages(currentPage);
    } else if (direction === -1 && currentPage > 1) {
      currentPage -= 2;
      showPages(currentPage);
    }
  }

  // Функция перехода к конкретной странице
  function goToPage(pageNumber) {
    if (pageNumber >= 0 && pageNumber < pages.length) {
      // Для любого номера вычисляем левую страницу (чётную)
      let leftPage;
      if (pageNumber === 1) {
        leftPage = 1;
      } else if (pageNumber % 2 === 1 && pageNumber > 0) {
        leftPage = pageNumber - 1;
      } else {
        leftPage = pageNumber;
      }
      currentPage = leftPage;
      showPages(leftPage);
      // Прокручиваем к активному элементу в списке
      if (pageList) {
        const activeItem = pageList.querySelector('.page-item.active');
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }

  if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      if (!leftArrow.disabled) flip(-1);
    });
  }
  if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      if (!rightArrow.disabled) flip(1);
    });
  }

  // Обработчик кнопки "Перейти"
  if (goToPageBtn && pageInput) {
    goToPageBtn.addEventListener('click', () => {
      const pageNumber = parseInt(pageInput.value);
      if (!isNaN(pageNumber)) {
        goToPage(pageNumber);
        pageInput.value = '';
      }
    });
  }

  // Обработчик Enter в поле ввода
  if (pageInput) {
    pageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const pageNumber = parseInt(pageInput.value);
        if (!isNaN(pageNumber)) {
          goToPage(pageNumber);
          pageInput.value = '';
        }
      }
    });
  }

  // Обработчики кликов по элементам списка страниц
  if (pageList) {
    pageList.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-item')) {
        const pageNumber = parseInt(e.target.getAttribute('data-page'));
        goToPage(pageNumber);
      }
    });
  }

  // Инициализация
  showPages(currentPage);

  // Кнопка "Открыть летопись" на обложке (если есть)
  const openBtn = document.getElementById('openChronicleBtn');
  if (openBtn && rightArrow) {
    openBtn.addEventListener('click', () => {
      rightArrow.click();
    });
  }
});
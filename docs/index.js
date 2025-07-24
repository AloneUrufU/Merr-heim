// JS для подсказки, на случай если захотим расширять
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltip');
    let activeElement = null;
  
    function showTooltip(elem) {
      const title = elem.getAttribute('data-title');
      if (!title) return;
      tooltip.textContent = title;
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
  
      const rect = elem.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      tooltip.style.top = rect.bottom + scrollY + 6 + 'px';
      tooltip.style.left = rect.left + rect.width / 2 + 'px';
      tooltip.setAttribute('aria-hidden', 'false');
    }
  
    function hideTooltip() {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      tooltip.setAttribute('aria-hidden', 'true');
    }
  
    document.querySelectorAll('.book, .scroll').forEach(el => {
      el.addEventListener('mouseenter', () => {
        activeElement = el;
        showTooltip(el);
      });
      el.addEventListener('mouseleave', () => {
        if (activeElement === el) {
          hideTooltip();
          activeElement = null;
        }
      });
      el.addEventListener('focus', () => {
        showTooltip(el);
      });
      el.addEventListener('blur', () => {
        hideTooltip();
      });
    });
  });
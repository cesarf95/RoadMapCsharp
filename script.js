// script.js — controla salvar/carregar/exportar/limpar progresso
document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'roadmapProgress_v1'; // chave no localStorage
  const checkboxes = document.querySelectorAll('input.topic[type="checkbox"]');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');

  // Carrega progresso salvo (se houver)
  function load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    try {
      const arr = JSON.parse(raw);
      checkboxes.forEach((cb, i) => cb.checked = !!arr[i]);
    } catch (e) {
      console.warn('Erro ao carregar progresso:', e);
    }
  }

  // Salva estado atual
  function save() {
    const arr = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem(KEY, JSON.stringify(arr));
    alert('Progresso salvo localmente!');
  }

  // Limpa tudo
  function clearAll() {
    if (!confirm('Deseja limpar todas as marcações?')) return;
    localStorage.removeItem(KEY);
    checkboxes.forEach(cb => cb.checked = false);
    alert('Progresso apagado!');
  }

  // Exporta JSON para clipboard (fallback abre janela)
  function exportJson() {
    const arr = Array.from(checkboxes).map(cb => cb.checked);
    const json = JSON.stringify(arr, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(() => {
        alert('JSON copiado para a área de transferência!');
      }).catch(() => {
        openFallback(json);
      });
    } else {
      openFallback(json);
    }

    function openFallback(text) {
      const w = window.open('', '_blank');
      w.document.body.style.whiteSpace = 'pre-wrap';
      w.document.title = 'Export — roadmap.json';
      w.document.body.textContent = text;
    }
  }

  // Eventos
  saveBtn.addEventListener('click', save);
  clearBtn.addEventListener('click', clearAll);
  exportBtn.addEventListener('click', exportJson);

  // Auto-carrega ao abrir
  load();
});

/* ============================================================
 * FILE: 06-fsrs-core.js
 * DOMAIN: FSRS pool, tombstone, review table, settings
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared
 * ============================================================ */

// ==================== FSRS TOMBSTONE HELPERS ====================
function softDeleteFsrsItem(type, key, reason = 'manual') {
  if (!fsrsPool[type] || !fsrsPool[type][key]) return false;
  const now = Date.now();
  fsrsPool[type][key] = {
    ...fsrsPool[type][key],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function cleanupTombstones(maxAgeDays = 30) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  let cleaned = 0;
  ['vocab'].forEach(type => {
    if (!fsrsPool[type]) return;
    Object.keys(fsrsPool[type]).forEach(key => {
      const item = fsrsPool[type][key];
      if (item.deleted && item.deletedAt && item.deletedAt < cutoff) {
        delete fsrsPool[type][key];
        cleaned++;
      }
    });
  });
  if (cleaned > 0) {
    console.log(`[Cleanup] Đã dọn ${cleaned} tombstone cũ hơn ${maxAgeDays} ngày.`);
  }
  return cleaned;
}

function getActiveFsrsItems(type) {
  if (!fsrsPool[type]) return {};
  const result = {};
  Object.keys(fsrsPool[type]).forEach(key => {
    const item = fsrsPool[type][key];
    if (!item.deleted) result[key] = item;
  });
  return result;
}

function checkDocDueEligibility(doc) {
  if (!doc.testStatus || !doc.testStatus.trackedItems || doc.testStatus.trackedItems.length === 0) {
    return { eligible: true, duePercent: 100 };
  }
  const now = Date.now();
  let totalTracked = 0, totalDue = 0;
  doc.testStatus.trackedItems.forEach(entry => {
    const [type, key] = entry.split(':');
    const pool = fsrsPool.vocab;
    if (pool && pool[key]) {
      totalTracked++;
      if (pool[key].nextReview <= now) totalDue++;
    }
  });
  if (totalTracked === 0) return { eligible: true, duePercent: 100 };
  const duePercent = (totalDue / totalTracked) * 100;
  return { eligible: duePercent >= fsrsConfig.retestDueThreshold, duePercent, totalTracked, totalDue };
}

function applyRetestEffectOnFsrs(doc) {
  const now = Date.now();
  const words = doc.content.trim().split(/\s+/);
  const docWords = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) docWords.add(cleaned);
  });
  docWords.forEach(w => {
    const item = fsrsPool.vocab[w];
    if (item && !item.deleted) {
      if (item.nextReview <= now) {
        item.streak = (item.streak || 0) + 1;
        item.interval = Math.round((item.interval || 1) * 2.2);
        item.nextReview = now + item.interval * 24 * 60 * 60 * 1000;
        item.lastReview = now;
        item.updatedAt = now;
        const targetSteps = fsrsConfig.fsrsSteps || 4;
        if (targetSteps < 999 && item.streak >= targetSteps) {
          softDeleteFsrsItem('vocab', w, 'retest');
        }
      } else {
        item.nextReview += 2 * 24 * 60 * 60 * 1000;
        item.updatedAt = now;
      }
    }
  });
}

// ==================== FSRS REVIEW TABLE ====================
function renderReviewTables() {
  const hzTbody = document.getElementById('review-hanzi-table-body');
  const vcTbody = document.getElementById('review-vocab-table-body');
  const docsContainer = document.getElementById('ready-retest-docs-list');
  const now = Date.now();

  // Từ đơn
  hzTbody.innerHTML = '';
  const hzKeys = Object.keys(fsrsPool.vocab).filter(k => !fsrsPool.vocab[k].deleted && !k.includes(' '));
  hzKeys.sort((a, b) => (fsrsPool.vocab[a].nextReview || 0) - (fsrsPool.vocab[b].nextReview || 0));
  if (hzKeys.length === 0) {
    hzTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400">Không có từ đơn nào cần củng cố.</td></tr>`;
  } else {
    hzKeys.forEach(word => {
      const item = fsrsPool.vocab[word];
      const isDue = item.nextReview <= now;
      const tr = document.createElement('tr');
      tr.className = "hover:bg-stone-50 transition";
      tr.innerHTML = `
        <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs bg-stone-100 font-bold">#${item.rank || getItemRank('vocab', word)}</span></td>
        <td class="px-4 py-3 font-english text-xl font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
        <td class="px-4 py-3"><div class="flex items-center gap-1 flex-wrap">${(() => {
          const totalSteps = fsrsConfig.fsrsSteps || 4;
          if (totalSteps >= 999) {
            return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
          }
          return Array.from({length: totalSteps}, (_, i) => i + 1)
            .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
        })()}</div></td><td class="px-4 py-3"><span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}</span></td>
        <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="graduateFsrsItemManually('vocab', '${word}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
          <button onclick="removeFsrsItem('vocab', '${word}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
        </td>
      `;
      hzTbody.appendChild(tr);
    });
  }

  // Cụm từ
  vcTbody.innerHTML = '';
  const vcKeys = Object.keys(fsrsPool.vocab).filter(w => w.includes(' ') && !fsrsPool.vocab[w].deleted);
  vcKeys.sort((a, b) => (fsrsPool.vocab[a].nextReview || 0) - (fsrsPool.vocab[b].nextReview || 0));
  if (vcKeys.length === 0) {
    vcTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400">Không có cụm từ nào cần củng cố.</td></tr>`;
  } else {
    vcKeys.forEach(word => {
      const item = fsrsPool.vocab[word];
      const isDue = item.nextReview <= now;
      const tr = document.createElement('tr');
      tr.className = "hover:bg-stone-50 transition";
      tr.innerHTML = `
        <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs bg-stone-100 font-bold">#${item.rank || getItemRank('vocab', word)}</span></td>
        <td class="px-4 py-3 font-english text-lg font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
        <td class="px-4 py-3"><div class="flex items-center gap-1 flex-wrap">${(() => {
          const totalSteps = fsrsConfig.fsrsSteps || 4;
          if (totalSteps >= 999) {
            return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
          }
          return Array.from({length: totalSteps}, (_, i) => i + 1)
            .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
        })()}</div></td><td class="px-4 py-3"><span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}</span></td>
        <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="graduateFsrsItemManually('vocab', '${word}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
          <button onclick="removeFsrsItem('vocab', '${word}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
        </td>
      `;
      vcTbody.appendChild(tr);
    });
  }

  // ========== GRAMMAR FSRS TABLE ==========
  let grammarTbody = document.getElementById('review-grammar-table-body');
  if (!grammarTbody) {
    const grammarSection = document.getElementById('review-subcontent-grammar');
    if (grammarSection) {
      grammarSection.innerHTML = `
        <div class="overflow-x-auto max-h-[480px]">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">Cấu trúc</th>
                <th class="px-4 py-3">Tiến độ</th>
                <th class="px-4 py-3">Trạng thái</th>
                <th class="px-4 py-3">Lần ôn kế</th>
                <th class="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody id="review-grammar-table-body" class="divide-y divide-stone-100"></tbody>
          </table>
        </div>`;
      grammarTbody = document.getElementById('review-grammar-table-body');
    }
  }

  if (grammarTbody) {
    grammarTbody.innerHTML = '';
    const grammarKeys = Object.keys(grammarFsrsPool).filter(pid => !grammarFsrsPool[pid].deleted);
    grammarKeys.sort((a, b) => (grammarFsrsPool[a].nextReview || 0) - (grammarFsrsPool[b].nextReview || 0));
    if (grammarKeys.length === 0) {
      grammarTbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có cấu trúc ngữ pháp nào trong bể củng cố.</td></tr>`;
    } else {
      grammarKeys.forEach(pid => {
        const item = grammarFsrsPool[pid];
        const isDue = item.nextReview <= now;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition";
        tr.innerHTML = `
          <td class="px-4 py-3">
            <span class="font-mono text-xs font-bold text-purple-800 cursor-pointer hover:underline"
                  onclick="openGrammarCard('${pid}', '')">${pid}</span>
            <p class="text-[11px] text-stone-500 truncate max-w-xs">${item.snapshotAnchors || ''}</p>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1 flex-wrap">
              ${(() => {
                const totalSteps = fsrsConfig.fsrsSteps || 4;
                if (totalSteps >= 999) {
                  return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
                }
                return Array.from({length: totalSteps}, (_, i) => i + 1)
                  .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
              })()}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">
              ${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
          <td class="px-4 py-3 text-right">
            <button onclick="graduateGrammarFsrsManually('${pid}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
            <button onclick="removeGrammarFsrsItem('${pid}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
          </td>
        `;
        grammarTbody.appendChild(tr);
      });
    }
  }

  // ========== SENTENCE FSRS TABLE ==========
  const snTbody = document.getElementById('review-sentence-table-body');
  if (snTbody) {
    snTbody.innerHTML = '';
    const snKeys = Object.keys(sentenceFsrsPool).filter(id => !sentenceFsrsPool[id].deleted);
    snKeys.sort((a, b) => (sentenceFsrsPool[a].nextReview || 0) - (sentenceFsrsPool[b].nextReview || 0));
    if (snKeys.length === 0) {
      snTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có Sentence Card nào trong bể củng cố.</td></tr>`;
    } else {
      snKeys.forEach(id => {
        const item = sentenceFsrsPool[id];
        const isDue = item.nextReview <= now;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition";
        const anchorsDisplay = (item.snapshotAnchors || []).join(' · ') || '--';
        const currentShort = (item.snapshotCurrent || '').substring(0, 60);
        tr.innerHTML = `
          <td class="px-4 py-3">
            <span class="font-mono text-xs font-bold text-rose-800 cursor-pointer hover:underline"
                  onclick="openSentenceCard('${id}')">${id}</span>
            <p class="text-[11px] text-stone-500 truncate max-w-xs font-english mt-0.5">${currentShort}${(item.snapshotCurrent || '').length > 60 ? '...' : ''}</p>
          </td>
          <td class="px-4 py-3 text-xs text-purple-800 font-mono max-w-xs truncate" title="${anchorsDisplay}">${anchorsDisplay}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1 flex-wrap">
              ${(() => {
                const totalSteps = fsrsConfig.fsrsSteps || 4;
                if (totalSteps >= 999) {
                  return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
                }
                return Array.from({length: totalSteps}, (_, i) => i + 1)
                  .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
              })()}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">
              ${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
          <td class="px-4 py-3 text-right">
            <button onclick="graduateSentenceFsrsManually('${id}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
            <button onclick="removeSentenceFsrsItem('${id}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
          </td>
        `;
        snTbody.appendChild(tr);
      });
    }
  }

  const subSnBadge = document.getElementById('badge-subtab-sn');
  if (subSnBadge) {
    const snCount = Object.keys(sentenceFsrsPool).filter(id => !sentenceFsrsPool[id].deleted).length;
    subSnBadge.innerText = snCount;
  }

  docsContainer.innerHTML = '';
  const readyDocs = docs.filter(d => {
    if (!d.testStatus || !d.testStatus.tested) return false;
    const check = checkDocDueEligibility(d);
    return check.eligible && check.totalTracked > 0;
  });
  if (readyDocs.length === 0) {
    docsContainer.innerHTML = `<div class="col-span-full py-10 text-center text-stone-400 bg-white rounded-2xl border border-stone-200"><span class="text-3xl block mb-2">📚</span><p class="text-xs font-medium text-stone-600">Chưa có bài đọc nào đạt ngưỡng > ${fsrsConfig.retestDueThreshold}%.</p></div>`;
  } else {
    readyDocs.forEach(d => {
      const check = checkDocDueEligibility(d);
      const card = document.createElement('div');
      card.className = "bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between gap-3";
      card.innerHTML = `
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-stone-900 truncate font-englishSans">${d.title}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">${check.duePercent.toFixed(0)}%</span>
          </div>
          <p class="text-xs text-stone-400 mt-0.5">${check.totalDue} / ${check.totalTracked} mục tới hạn</p>
        </div>
        <button onclick="readDoc('${d.id}'); startTestMode();" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex-shrink-0">Tái thẩm định</button>
      `;
      docsContainer.appendChild(card);
    });
  }

  const subHzBadge = document.getElementById('badge-subtab-hz');
  const subVcBadge = document.getElementById('badge-subtab-vc');
  const subGmBadge = document.getElementById('badge-subtab-gm');
  const subDocsBadge = document.getElementById('badge-subtab-docs');
  if (subHzBadge) subHzBadge.innerText = hzKeys.length;
  if (subVcBadge) subVcBadge.innerText = vcKeys.length;
  if (subGmBadge) {
    const gmCount = Object.keys(grammarFsrsPool).filter(pid => !grammarFsrsPool[pid].deleted).length;
    subGmBadge.innerText = gmCount;
  }
  if (subDocsBadge) subDocsBadge.innerText = readyDocs.length;
}

function graduateFsrsItemManually(type, key) {
  if (fsrsPool[type] && fsrsPool[type][key]) {
    softDeleteFsrsItem(type, key, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp mục "${key}"!`, "success");
  }
}

function removeFsrsItem(type, key) {
  showConfirmModal(`Xóa mục "${key}" khỏi danh sách củng cố?`, () => {
    softDeleteFsrsItem(type, key, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${key}"`, "info");
  });
}

function openFsrsSettingsModal() {
  document.getElementById('cfg-rank-threshold').value = fsrsConfig.rankThreshold || 2500;
  document.getElementById('cfg-corruption-threshold').value = fsrsConfig.corruptionThreshold || 5.0;
  document.getElementById('cfg-retest-due-threshold').value = fsrsConfig.retestDueThreshold || 50.0;
  document.getElementById('cfg-fsrs-steps').value = String(fsrsConfig.fsrsSteps || 4);
  openModal('modal-fsrs-settings');
}

function saveFsrsSettings(e) {
  e.preventDefault();
  fsrsConfig.rankThreshold = parseInt(document.getElementById('cfg-rank-threshold').value, 10) || 2500;
  fsrsConfig.corruptionThreshold = parseFloat(document.getElementById('cfg-corruption-threshold').value) || 5.0;
  fsrsConfig.retestDueThreshold = parseFloat(document.getElementById('cfg-retest-due-threshold').value) || 50.0;
  fsrsConfig.fsrsSteps = parseInt(document.getElementById('cfg-fsrs-steps').value, 10) || 4;
  saveAllData();
  closeModal('modal-fsrs-settings');
  renderReviewTables();
  const label = fsrsConfig.fsrsSteps >= 999 ? "Vô hạn" : `${fsrsConfig.fsrsSteps} bước`;
  showToast(`Đã lưu cấu hình! Số bước tốt nghiệp: ${label}`, "success");
}
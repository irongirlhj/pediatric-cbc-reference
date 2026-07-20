/* 한국 소아 CBC 연령별 참고치 조회 — 앱 로직
 * 모든 계산은 브라우저 내에서만 수행됩니다. 외부 전송 없음.
 */
(function () {
  "use strict";

  var DATA = window.REFERENCE_DATA;
  var DAYS_PER_MONTH = 30.4375; // 365.25 / 12

  var state = {
    mode: "age",     // "age" | "date"
    sex: null,       // "M" | "F"
    unit: "conv",    // "conv" | "src"
    ageMonths: null, // 만 개월
    ageLabel: "",
  };

  // ---------- 연령 계산 ----------

  /** 생년월일 ~ 검사일 사이의 «만 개월» (정확한 달력 기준) */
  function completedMonths(birthISO, testISO) {
    var b = new Date(birthISO + "T00:00:00");
    var t = new Date(testISO + "T00:00:00");
    var m = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
    if (t.getDate() < b.getDate()) m -= 1;
    return m;
  }

  function daysBetween(birthISO, testISO) {
    var b = new Date(birthISO + "T00:00:00");
    var t = new Date(testISO + "T00:00:00");
    return Math.floor((t - b) / 86400000);
  }

  /** 연령 구간 탐색: [minM, maxM) + 성별 일치 */
  function findBracket(brackets, months, sex) {
    if (!brackets) return null;
    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i];
      if (months >= b.minM && months < b.maxM && (b.sex === "any" || b.sex === sex)) {
        return b;
      }
    }
    return null;
  }

  // ---------- 표시 헬퍼 ----------

  function monthsToLabel(m) {
    if (m === 0) return "0개월";
    if (m < 12) return m + "개월";
    var y = Math.floor(m / 12);
    var r = m % 12;
    return r === 0 ? y + "세" : y + "세 " + r + "개월";
  }

  /** 구간 상한은 배타적이므로, 표시할 때는 «직전 값»으로 보여준다 */
  function bracketLabel(b) {
    return monthsToLabel(b.minM) + " ~ " + monthsToLabel(b.maxM - 1);
  }

  function convert(value, p) {
    if (state.unit === "src") return value;
    return value * p.conv.factor;
  }

  function fmt(value, p) {
    var v = convert(value, p);
    var d = state.unit === "src" ? guessDecimals(value) : p.conv.decimals;
    return v.toFixed(d);
  }

  function guessDecimals(v) {
    var s = String(v);
    var i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }

  function unitLabel(p) {
    return state.unit === "src" ? p.unit : p.conv.unit;
  }

  // ---------- 데이터 완성도 점검 ----------

  function checkDataCompleteness() {
    var missing = [];
    DATA.parameters.forEach(function (p) {
      var ok =
        p.brackets &&
        p.brackets.length > 0 &&
        p.brackets.some(function (b) {
          return b.low !== null && b.high !== null;
        });
      if (!ok) missing.push(p.code);
    });
    return missing;
  }

  // ---------- 렌더링 ----------

  function render() {
    document.getElementById("ageSummary").textContent = state.ageLabel;

    var tbody = document.querySelector("#resultTable tbody");
    var prevValues = {};
    tbody.querySelectorAll("tr").forEach(function (tr) {
      var code = tr.dataset.code;
      var inp = tr.querySelector(".val-input");
      if (code && inp && inp.value) prevValues[code] = inp.value;
    });
    tbody.innerHTML = "";

    var usedNotes = {};

    DATA.parameters.forEach(function (p) {
      var b = findBracket(p.brackets, state.ageMonths, state.sex);

      var tr = document.createElement("tr");
      tr.dataset.code = p.code;

      tr.appendChild(cell(p.name + " (" + p.code + ")", "name"));
      tr.appendChild(cell(unitLabel(p), "unit"));

      // 참고치
      var rangeTd = document.createElement("td");
      rangeTd.className = "range";
      if (b) {
        rangeTd.textContent = fmt(b.low, p) + " ~ " + fmt(b.high, p);
        if (b.note) {
          var sup = document.createElement("sup");
          sup.textContent = b.note;
          sup.className = "fn";
          rangeTd.appendChild(sup);
          usedNotes[b.note] = true;
        }
      } else {
        rangeTd.textContent = "—";
        rangeTd.classList.add("muted");
      }
      tr.appendChild(rangeTd);

      tr.appendChild(cell(b ? bracketLabel(b) : "해당 구간 없음", "bracket"));

      // 검사값 입력
      var valTd = document.createElement("td");
      var input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.className = "val-input";
      input.placeholder = "선택";
      input.disabled = !b;
      if (prevValues[p.code]) input.value = prevValues[p.code];
      valTd.appendChild(input);
      tr.appendChild(valTd);

      var flagTd = document.createElement("td");
      flagTd.className = "flag";
      tr.appendChild(flagTd);

      input.addEventListener("input", function () {
        updateFlag(input, b, p, flagTd);
      });
      if (input.value) updateFlag(input, b, p, flagTd);

      tbody.appendChild(tr);
    });

    renderFootnotes(usedNotes);
    document.getElementById("result").hidden = false;
  }

  function cell(text, cls) {
    var td = document.createElement("td");
    td.textContent = text;
    if (cls) td.className = cls;
    return td;
  }

  /** 판정은 «현재 표시 단위» 기준으로 입력된 값을 비교한다 */
  function updateFlag(input, bracket, p, flagTd) {
    flagTd.className = "flag";
    flagTd.textContent = "";
    var raw = input.value.trim();
    if (raw === "" || !bracket) return;
    var v = parseFloat(raw);
    if (isNaN(v)) return;

    var low = convert(bracket.low, p);
    var high = convert(bracket.high, p);

    if (v < low) {
      flagTd.textContent = "↓ 낮음";
      flagTd.classList.add("flag-low");
    } else if (v > high) {
      flagTd.textContent = "↑ 높음";
      flagTd.classList.add("flag-high");
    } else {
      flagTd.textContent = "정상";
      flagTd.classList.add("flag-normal");
    }
  }

  function renderFootnotes(used) {
    var box = document.getElementById("footnotes");
    box.innerHTML = "";
    Object.keys(used).forEach(function (k) {
      var p = document.createElement("p");
      p.innerHTML = "<sup class='fn'>" + k + "</sup> " + DATA.footnotes[k];
      box.appendChild(p);
    });
  }

  // ---------- 입력 처리 ----------

  function showError(msg) {
    var el = document.getElementById("inputError");
    el.textContent = msg;
    el.hidden = false;
  }

  function clearError() {
    document.getElementById("inputError").hidden = true;
  }

  function handleLookup() {
    clearError();

    if (!state.sex) return showError("성별을 선택해 주세요.");

    var months, label;

    if (state.mode === "age") {
      var raw = document.getElementById("ageValue").value.trim();
      if (raw === "") return showError("나이를 입력해 주세요.");
      var val = parseFloat(raw);
      if (isNaN(val) || val < 0) return showError("나이는 0 이상의 숫자여야 합니다.");

      var unit = document.getElementById("ageUnit").value;
      if (unit === "months") {
        months = Math.floor(val);
        label = monthsToLabel(months);
      } else if (unit === "years") {
        months = Math.floor(val) * 12;
        label = monthsToLabel(months);
      } else {
        months = Math.floor(val / DAYS_PER_MONTH);
        label = val + "일 (약 " + monthsToLabel(months) + ")";
      }
    } else {
      var birth = document.getElementById("birthDate").value;
      var test = document.getElementById("testDate").value;
      if (!birth || !test) return showError("생년월일과 검사일을 모두 입력해 주세요.");
      months = completedMonths(birth, test);
      if (months < 0) return showError("검사일이 생년월일보다 빠릅니다. 날짜를 확인해 주세요.");
      label = monthsToLabel(months) + " (생후 " + daysBetween(birth, test) + "일)";
    }

    var range = DATA.meta.ageRangeMonths;
    if (months >= range[1]) {
      return showError(
        "이 참고치는 만 " + range[0] + "개월 ~ " + monthsToLabel(range[1] - 1) +
        " 소아를 대상으로 합니다. 성인 참고치를 사용하십시오."
      );
    }

    state.ageMonths = months;
    state.ageLabel = label;
    render();
  }

  // ---------- 초기화 ----------

  function init() {
    var m = DATA.meta;
    document.getElementById("srcText").textContent = m.source;
    document.getElementById("srcLink").href = m.sourceUrl;
    document.getElementById("popText").textContent = m.population;
    document.getElementById("instText").textContent = m.instrument;
    document.getElementById("verText").textContent = m.version;
    document.getElementById("licText").textContent = m.license;

    var missing = checkDataCompleteness();
    if (missing.length > 0) {
      var warn = document.getElementById("dataWarning");
      warn.textContent =
        "⚠️ 참고치 값이 입력되지 않은 항목이 있습니다: " + missing.join(", ");
      warn.hidden = false;
    }

    // 입력 모드 탭
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.mode = tab.dataset.mode;
        document.querySelectorAll(".tab").forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        document.querySelectorAll(".panel").forEach(function (p) {
          p.hidden = p.dataset.panel !== state.mode;
        });
        clearError();
      });
    });

    // 성별
    document.querySelectorAll("#sexGroup .seg").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.sex = btn.dataset.sex;
        document.querySelectorAll("#sexGroup .seg").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        clearError();
        if (state.ageMonths !== null) render();
      });
    });

    // 단위 전환
    document.querySelectorAll("#unitGroup .seg").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.unit = btn.dataset.unit;
        document.querySelectorAll("#unitGroup .seg").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        if (state.ageMonths !== null) render();
      });
    });

    document.getElementById("lookupBtn").addEventListener("click", handleLookup);

    document.querySelectorAll("#ageValue, #birthDate, #testDate").forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") handleLookup();
      });
    });

    document.getElementById("testDate").valueAsDate = new Date();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

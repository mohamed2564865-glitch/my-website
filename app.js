const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()-_=+[]{};:,.<>/?";

function secureRandomInt(maxExclusive) {
  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let n;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % maxExclusive;
}

function securePick(str) {
  return str[secureRandomInt(str.length)];
}

const els = {
  totalLength: document.getElementById("totalLength"),
  letterCount: document.getElementById("letterCount"),
  numberCount: document.getElementById("numberCount"),
  symbolCount: document.getElementById("symbolCount"),
  generate: document.getElementById("generate"),
  copy: document.getElementById("copy"),
  output: document.getElementById("output"),
  status: document.getElementById("status"),
};

function setStatus(msg) {
  els.status.textContent = msg || "";
}

els.generate.addEventListener("click", () => {
  const total = parseInt(els.totalLength.value, 10);
  const l = parseInt(els.letterCount.value, 10);
  const n = parseInt(els.numberCount.value, 10);
  const s = parseInt(els.symbolCount.value, 10);

  if (l + n + s !== total) {
    els.output.value = "";
    els.copy.disabled = true;
    setStatus("⚠️ المجموع لا يساوي الطول الكلي");
    return;
  }

  const passwordArray = [];
  for (let i = 0; i < l; i++) passwordArray.push(securePick(letters));
  for (let i = 0; i < n; i++) passwordArray.push(securePick(numbers));
  for (let i = 0; i < s; i++) passwordArray.push(securePick(symbols));

  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  els.output.value = passwordArray.join("");
  els.copy.disabled = false;
  setStatus("✅ تم إنشاء كلمة السر");
});

els.copy.addEventListener("click", async () => {
  if (!els.output.value) return;
  try {
    await navigator.clipboard.writeText(els.output.value);
    setStatus("✅ تم النسخ");
  } catch {
    els.output.select();
    document.execCommand("copy");
    setStatus("✅ تم النسخ (طريقة بديلة)");
  }
});
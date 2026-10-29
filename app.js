const $ = (id) => document.getElementById(id);
const heap = [];
let arrival = 0;
let processed = 0;
let logEntries = [];

const priorityName = (p) => ({4:"Critical",3:"Urgent",2:"Moderate",1:"Stable"}[p] || "Unknown");
const higher = (a,b) => a.priority !== b.priority ? a.priority > b.priority : a.arrival < b.arrival;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function addLog(text) {
  const time = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  logEntries.unshift(`${time} — ${text}`);
  logEntries = logEntries.slice(0,80);
  renderLog();
}
function setMessage(text) { $("message").textContent = text; }
function swap(i,j) { [heap[i],heap[j]] = [heap[j],heap[i]]; addLog("Swapped elements to restore the heap property."); }
function siftUp(i) {
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (!higher(heap[i],heap[p])) break;
    swap(i,p); i = p;
  }
}
function siftDown(i) {
  while (true) {
    const left = 2*i+1, right = 2*i+2;
    let best = i;
    if (left < heap.length && higher(heap[left],heap[best])) best = left;
    if (right < heap.length && higher(heap[right],heap[best])) best = right;
    if (best === i) break;
    swap(i,best); i = best;
  }
}
function addPatient(patient) {
  if (heap.some(p => p.id.toLowerCase() === patient.id.toLowerCase())) {
    setMessage(`Patient ID "${patient.id}" is already waiting. Please use a unique ID.`); return false;
  }
  patient.arrival = ++arrival;
  heap.push(patient);
  addLog(`Added ${patient.name} with ${priorityName(patient.priority)} priority. Heapify-Up started.`);
  siftUp(heap.length - 1);
  setMessage(`Added ${patient.name}. Heapify-Up moves a higher-priority patient towards the root.`);
  refresh();
  return true;
}
function processPatient() {
  if (!heap.length) { setMessage("No patients waiting."); return; }
  const patient = heap[0];
  const last = heap.pop();
  if (heap.length) { heap[0] = last; addLog("Removed root and moved the last patient to the root. Heapify-Down started."); siftDown(0); }
  processed++;
  addLog(`Processed ${patient.name} (${patient.id}).`);
  setMessage(`Processed: ${patient.id} | ${patient.name} | ${priorityName(patient.priority)} priority.\nHeapify-Down restored the Max-Heap.`);
  refresh();
}
function refresh() {
  $("waitingCount").textContent = heap.length;
  $("processedCount").textContent = processed;
  $("nextPriority").textContent = heap.length ? `${heap[0].priority} — ${priorityName(heap[0].priority)}` : "—";
  $("heapArray").textContent = "[" + heap.map(p => `${p.id}:${p.priority}`).join(", ") + "]";
  $("heapTree").innerHTML = heap.length ? heap.map((p,i) => `<div class="heap-node ${i===0?"root":""}"><span class="node-label">${i===0?"★ ROOT":`INDEX ${i}`}</span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.id)} · P${p.priority} ${priorityName(p.priority)}</small></div>`).join("") : '<p class="empty-state">No patients waiting yet.</p>';
  const sorted = [...heap].sort((a,b) => higher(a,b) ? -1 : higher(b,a) ? 1 : 0);
  $("waitingTable").innerHTML = sorted.length ? sorted.map(p => `<tr><td><strong>${escapeHtml(p.name)}</strong><br><span style="color:#8a97aa">${escapeHtml(p.id)}</span></td><td>${p.age}</td><td><span class="priority-pill p${p.priority}">${priorityName(p.priority)}</span></td><td>#${p.arrival}</td></tr>`).join("") : '<tr><td colspan="4" class="table-empty">No patients in queue.</td></tr>';
}
function renderLog() {
  $("operationLog").innerHTML = logEntries.length ? logEntries.map(s => `<li>${escapeHtml(s)}</li>`).join("") : "<li>No operations yet.</li>";
}
$("patientForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("patientId").value.trim(), name = $("patientName").value.trim();
  const age = Number($("patientAge").value), priority = Number($("patientPriority").value);
  if (!id || !name || !Number.isInteger(age) || age < 0 || age > 120) { setMessage("Enter a patient ID, name, and a valid age from 0 to 120."); return; }
  if (addPatient({id,name,age,priority})) $("patientForm").reset();
});
$("viewNext").addEventListener("click", () => {
  if (!heap.length) { setMessage("No patients waiting."); return; }
  const p = heap[0]; setMessage(`Next patient: ${p.id} | ${p.name} | ${priorityName(p.priority)} | Arrival #${p.arrival}`);
  addLog(`Viewed root: ${p.name} is next.`);
});
$("processPatient").addEventListener("click", processPatient);
$("searchPatient").addEventListener("click", () => {
  const key = prompt("Enter Patient ID to search:");
  if (!key || !key.trim()) return;
  const p = heap.find(x => x.id.toLowerCase() === key.trim().toLowerCase());
  if (p) { setMessage(`Found: ${p.id} | ${p.name} | ${priorityName(p.priority)} | Arrival #${p.arrival}`); addLog(`Search found ${p.id}.`); }
  else { setMessage(`Patient "${key.trim()}" was not found in the waiting heap.`); addLog(`Search did not find ${key.trim()}.`); }
});
$("loadSamples").addEventListener("click", () => {
  const samples = [
    {id:"P101",name:"Aarav Shah",age:42,priority:2},
    {id:"P102",name:"Mira Patel",age:28,priority:4},
    {id:"P103",name:"Kabir Rao",age:65,priority:3},
    {id:"P104",name:"Diya Mehta",age:19,priority:2}
  ];
  let count = 0;
  samples.forEach(p => { if (!heap.some(x => x.id.toLowerCase() === p.id.toLowerCase())) { p.arrival=++arrival; heap.push(p); addLog(`Loaded sample ${p.name}.`); siftUp(heap.length-1); count++; }});
  setMessage(count ? "Sample patients loaded. Observe the highest priority at the root." : "Sample patients are already loaded.");
  refresh();
});
$("resetSystem").addEventListener("click", () => {
  if (!confirm("Clear all waiting patients and reset the demo counts?")) return;
  heap.length = 0; arrival = 0; processed = 0; logEntries = [];
  addLog("System reset."); setMessage("Demo reset."); refresh();
});
$("clearLog").addEventListener("click", () => { logEntries = []; renderLog(); });
addLog("System ready.");
refresh();

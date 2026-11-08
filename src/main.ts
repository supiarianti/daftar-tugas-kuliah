import "./style.css";

type TaskStatus = "Belum Selesai" | "Selesai";

interface Task {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: TaskStatus;
}

type TaskFormMode = "add" | "edit";

// Generic sederhana: fungsi ini dapat mengambil array dengan tipe data apa pun.
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// Primitive types dan array.
const appName: string = import.meta.env.VITE_APP_NAME || "Taskly";
const appVersion: string = import.meta.env.VITE_APP_VERSION || "1.0.0";
let nextId: number = 4;
const isDemoMode: boolean = true;

const initialTasks: Task[] = [
  { id: 1, title: "Membuat rangkuman materi React", course: "Pengembangan Aplikasi Web", dueDate: "2026-11-12", status: "Belum Selesai" },
  { id: 2, title: "Mengerjakan latihan basis data", course: "Basis Data", dueDate: "2026-11-14", status: "Selesai" },
  { id: 3, title: "Menyusun proposal penelitian", course: "Metodologi Penelitian", dueDate: "2026-11-18", status: "Belum Selesai" }
];

let tasks: Task[] = loadTasks();
let currentFilter: "Semua" | TaskStatus = "Semua";
let editingId: number | null = null;

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem("taskly-tasks");
    return saved ? (JSON.parse(saved) as Task[]) : initialTasks;
  } catch {
    return initialTasks;
  }
}

function saveTasks(): void {
  localStorage.setItem("taskly-tasks", JSON.stringify(tasks));
}

function formatDate(date: string): string {
  if (!date) return "Belum ditentukan";
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char] ?? char);
}

function render(): void {
  const visibleTasks = tasks.filter((task) =>
    currentFilter === "Semua" || task.status === currentFilter
  );
  const completed = tasks.filter((task) => task.status === "Selesai").length;
  const pending = tasks.length - completed;

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="${escapeHTML(appName)}">
          <span class="brand-mark">✓</span><span>${escapeHTML(appName)}</span>
        </a>
        <span class="version">v${escapeHTML(appVersion)}</span>
      </header>

      <section class="hero">
        <div>
          <p class="eyebrow">RUANG KULIAH LEBIH TERATUR</p>
          <h1>Semua tugas,<br><span>dalam kendali.</span></h1>
          <p class="subtitle">Catat, atur, dan selesaikan tugas kuliahmu satu per satu.</p>
        </div>
        <div class="hero-icon" aria-hidden="true">✦</div>
      </section>

      <section class="stats" aria-label="Ringkasan tugas">
        <article class="stat-card"><span class="stat-icon purple">▤</span><div><strong>${tasks.length}</strong><small>Total tugas</small></div></article>
        <article class="stat-card"><span class="stat-icon orange">◷</span><div><strong>${pending}</strong><small>Belum selesai</small></div></article>
        <article class="stat-card"><span class="stat-icon green">✓</span><div><strong>${completed}</strong><small>Selesai</small></div></article>
      </section>

      <section class="content-card">
        <div class="section-heading">
          <div><p class="eyebrow">DAFTAR PEKERJAAN</p><h2>Tugas kuliah</h2></div>
          <button class="primary-btn" id="add-btn"><span>＋</span> Tambah tugas</button>
        </div>

        <div class="toolbar">
          <div class="filters" role="group" aria-label="Filter tugas">
            ${(["Semua", "Belum Selesai", "Selesai"] as const).map((filter) =>
              `<button class="filter-btn ${currentFilter === filter ? "active" : ""}" data-filter="${filter}">${filter}</button>`
            ).join("")}
          </div>
          <span class="task-count">${visibleTasks.length} tugas ditampilkan</span>
        </div>

        <div class="task-list">
          ${visibleTasks.length ? visibleTasks.map((task) => `
            <article class="task-row ${task.status === "Selesai" ? "is-done" : ""}">
              <button class="check-btn ${task.status === "Selesai" ? "checked" : ""}" data-action="toggle" data-id="${task.id}" aria-label="Ubah status tugas">${task.status === "Selesai" ? "✓" : ""}</button>
              <div class="task-info">
                <h3>${escapeHTML(task.title)}</h3>
                <div class="task-meta"><span>${escapeHTML(task.course)}</span><span class="dot">•</span><span>Deadline ${formatDate(task.dueDate)}</span></div>
              </div>
              <span class="status ${task.status === "Selesai" ? "done" : "pending"}">${task.status}</span>
              <div class="actions">
                <button data-action="edit" data-id="${task.id}" aria-label="Edit tugas">✎</button>
                <button data-action="delete" data-id="${task.id}" aria-label="Hapus tugas">×</button>
              </div>
            </article>
          `).join("") : `<div class="empty"><span>✧</span><h3>Belum ada tugas di sini</h3><p>Tambahkan tugas baru agar tidak terlewat.</p></div>`}
        </div>
      </section>

      <section class="info-card">
        <div class="info-symbol">i</div>
        <div><h3>Belajar mengelola tugas dengan lebih mudah</h3><p>Data tugas tersimpan di browser menggunakan Local Storage. Kamu dapat menandai tugas selesai, mengubah detail, atau menghapus tugas kapan saja.</p></div>
      </section>

      <footer>© 2026 ${escapeHTML(appName)} · Dibuat untuk tugas Pengembangan Aplikasi Web</footer>
    </main>

    <dialog id="task-dialog">
      <form id="task-form" class="dialog-form">
        <div class="dialog-head"><div><p class="eyebrow">FORMULIR TUGAS</p><h2 id="dialog-title">Tambah tugas</h2></div><button type="button" class="close-btn" id="close-dialog">×</button></div>
        <label>Nama tugas<input id="title" name="title" required maxlength="90" placeholder="Contoh: Membuat laporan praktikum"></label>
        <label>Mata kuliah<input id="course" name="course" required maxlength="70" placeholder="Contoh: Pengembangan Aplikasi Web"></label>
        <label>Deadline<input id="dueDate" name="dueDate" type="date" required></label>
        <div class="dialog-actions"><button type="button" class="secondary-btn" id="cancel-btn">Batal</button><button class="primary-btn" type="submit">Simpan tugas</button></div>
      </form>
    </dialog>
  `;

  document.querySelector("#add-btn")?.addEventListener("click", () => openDialog("add"));
  document.querySelector("#close-dialog")?.addEventListener("click", closeDialog);
  document.querySelector("#cancel-btn")?.addEventListener("click", closeDialog);
  const taskForm = document.querySelector<HTMLFormElement>("#task-form");

taskForm?.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  submitTask(event as SubmitEvent);
});
  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter as typeof currentFilter;
      render();
    });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action!, Number(button.dataset.id)));
  });
}

function openDialog(mode: TaskFormMode, task?: Task): void {
  editingId = mode === "edit" && task ? task.id : null;
  const dialog = document.querySelector<HTMLDialogElement>("#task-dialog")!;
  document.querySelector("#dialog-title")!.textContent = mode === "edit" ? "Edit tugas" : "Tambah tugas";
  (document.querySelector<HTMLInputElement>("#title")!).value = task?.title ?? "";
  (document.querySelector<HTMLInputElement>("#course")!).value = task?.course ?? "";
  (document.querySelector<HTMLInputElement>("#dueDate")!).value = task?.dueDate ?? "";
  dialog.showModal();
}

function closeDialog(): void {
  document.querySelector<HTMLDialogElement>("#task-dialog")?.close();
}

function submitTask(event: SubmitEvent): void {
  event.preventDefault();
  const title = document.querySelector<HTMLInputElement>("#title")!.value.trim();
  const course = document.querySelector<HTMLInputElement>("#course")!.value.trim();
  const dueDate = document.querySelector<HTMLInputElement>("#dueDate")!.value;
  if (!title || !course || !dueDate) return;

  if (editingId !== null) {
    const existing = findById(tasks, editingId);
    if (existing) Object.assign(existing, { title, course, dueDate });
  } else {
    tasks.unshift({ id: nextId++, title, course, dueDate, status: "Belum Selesai" });
  }
  saveTasks();
  closeDialog();
  render();
}

function handleAction(action: string, id: number): void {
  const task = findById(tasks, id);
  if (!task) return;

  if (action === "toggle") {
    task.status = task.status === "Selesai" ? "Belum Selesai" : "Selesai";
  } else if (action === "edit") {
    openDialog("edit", task);
    return;
  } else if (action === "delete") {
    if (!window.confirm(`Hapus tugas "${task.title}"?`)) return;
    tasks = tasks.filter((item) => item.id !== id);
  }
  saveTasks();
  render();
}

render();
console.info(`${appName} ${appVersion} | Demo mode: ${isDemoMode}`);

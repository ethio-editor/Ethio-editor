import { db } from "./firebase.js";
import {
  collection, getDocs, query, where, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const jobList = document.getElementById("job-list");
const myProjects = document.getElementById("my-projects");
const btnHome = document.getElementById("btn-home");
const btnMy = document.getElementById("btn-my");

btnHome.onclick = () => {
  jobList.classList.remove("hidden");
  myProjects.classList.add("hidden");
  btnHome.classList.add("active");
  btnMy.classList.remove("active");
  loadJobs();
};

btnMy.onclick = () => {
  jobList.classList.add("hidden");
  myProjects.classList.remove("hidden");
  btnMy.classList.add("active");
  btnHome.classList.remove("active");
};

btnHome.click();

async function loadJobs() {
  jobList.innerHTML = "";
  const q = query(collection(db, "jobs"), where("status", "==", "posted"));
  const snap = await getDocs(q);

  if (snap.empty) {
    jobList.innerHTML = `<p class="empty-state">No jobs yet.</p>`;
    return;
  }

  snap.forEach(docSnap => {
    const job = docSnap.data();
    const el = document.createElement("div");
    el.className = "job-card";
    el.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <p><strong>Expiry:</strong> ${job.expiry}</p>
      <p><strong>Salary:</strong> ${job.salary}</p>
      <button class="nav-btn">✅ Accept</button>
    `;
    el.querySelector("button").onclick = () => acceptJob(docSnap.id, el);
    jobList.appendChild(el);
  });
}

async function acceptJob(id, el) {
  await updateDoc(doc(db, "jobs", id), { status: "accepted" });
  el.querySelector("button").remove();
  const submitBtn = document.createElement("button");
  submitBtn.className = "nav-btn";
  submitBtn.innerText = "📤 Submit";
  submitBtn.onclick = () => deliverJob(id);
  el.appendChild(submitBtn);
  myProjects.appendChild(el);
  btnMy.click();
}

async function deliverJob(id) {
  const link = prompt("Paste your Google Drive link:");
  const telebirr = prompt("Enter your Telebirr number:");
  if (!link || !telebirr) return;
  await updateDoc(doc(db, "jobs", id), {
    status: "delivered",
    deliverLink: link,
    editorTelebirr: telebirr
  });
  alert("✅ Delivery submitted!");
}

// admin.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// --- Element References ---
const clientInput    = document.getElementById("client-username");
const titleInput     = document.getElementById("job-title");
const descInput      = document.getElementById("job-description");
const expiryInput    = document.getElementById("job-expiry");
const salaryInput    = document.getElementById("job-salary");
const postBtn        = document.getElementById("post-job");
const deliveredList  = document.getElementById("delivered-jobs");

// --- Post a New Job ---
postBtn.addEventListener("click", async () => {
  const client   = clientInput.value.trim();
  const title    = titleInput.value.trim();
  const desc     = descInput.value.trim();
  const expiry   = expiryInput.value;
  const salary   = salaryInput.value.trim();

  if (!client || !title || !desc || !expiry || !salary) {
    return alert("Please fill in all fields before posting.");
  }

  try {
    postBtn.disabled = true;
    await addDoc(collection(db, "jobs"), {
      clientUsername: client,
      title,
      description: desc,
      expiry,
      salary,
      status: "posted",
      deliverLink: "",
      editorTelebirr: ""
    });
    alert("Job posted successfully!");
    clientInput.value = titleInput.value = descInput.value = expiryInput.value = salaryInput.value = "";
    loadDeliveredProjects();
  } catch (err) {
    console.error("Error posting job:", err);
    alert("Failed to post job. Check console for details.");
  } finally {
    postBtn.disabled = false;
  }
});

// --- Load Delivered Projects ---
async function loadDeliveredProjects() {
  deliveredList.innerHTML = "";  

  try {
    const q = query(
      collection(db, "jobs"),
      where("status", "==", "delivered"),
      orderBy("expiry", "desc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      deliveredList.innerHTML = `<p class="empty-state">No deliveries yet.</p>`;
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id   = docSnap.id;
      deliveredList.appendChild(createDeliveredCard(id, data));
    });
  } catch (err) {
    console.error("Error loading deliveries:", err);
    deliveredList.innerHTML = `<p class="empty-state">Error loading deliveries.</p>`;
  }
}

// --- Create a Card for Each Delivered Project ---
function createDeliveredCard(id, job) {
  const card = document.createElement("div");
  card.className = "delivered-card";
  card.innerHTML = `
    <h3>${job.title}</h3>
    <p><strong>Description:</strong> ${job.description}</p>
    <p><strong>Expiry:</strong> ${job.expiry}</p>
    <p><strong>Salary:</strong> ${job.salary}</p>
    <p>
      <strong>Client:</strong> ${job.clientUsername}
      <button class="copy-btn" data-copy="${job.clientUsername}">Copy</button>
    </p>
    <p>
      <strong>Editor Telebirr:</strong> ${job.editorTelebirr}
      <button class="copy-btn" data-copy="${job.editorTelebirr}">Copy</button>
    </p>
    <p>
      <strong>Drive Link:</strong>
      <a href="${job.deliverLink}" target="_blank">${job.deliverLink}</a>
      <button class="copy-btn" data-copy="${job.deliverLink}">Copy</button>
    </p>
    <button class="delete-btn">Delete</button>
  `;

  // Copy buttons
  card.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1000);
      } catch {
        alert("Copy failed. Please do it manually.");
      }
    });
  });

  // Delete button
  card.querySelector(".delete-btn").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      card.remove();
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete. Check console for details.");
    }
  });

  return card;
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", loadDeliveredProjects);

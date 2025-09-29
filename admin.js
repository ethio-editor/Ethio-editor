import { db } from "./firebase.js";
import {
  collection, addDoc, query, where, getDocs, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const titleInput = document.getElementById("job-title");
const descInput = document.getElementById("job-description");
const expiryInput = document.getElementById("job-expiry");
const salaryInput = document.getElementById("job-salary");
const postBtn = document.getElementById("post-job");
const lastDiv = document.getElementById("last-delivery");

postBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const expiry = expiryInput.value.trim();
  const salary = salaryInput.value.trim();

  if (!title || !desc || !expiry || !salary) return alert("Fill all fields");

  await addDoc(collection(db, "jobs"), {
    title, description: desc, expiry, salary,
    status: "posted", deliverLink: "", editorTelebirr: ""
  });

  titleInput.value = descInput.value = expiryInput.value = salaryInput.value = "";
  loadLast();
});

async function loadLast() {
  const q = query(
    collection(db, "jobs"),
    where("status", "==", "delivered"),
    orderBy("expiry", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    lastDiv.innerText = "No deliveries yet.";
    return;
  }
  const job = snap.docs[0].data();
  lastDiv.innerHTML = `
    <p><strong>Title:</strong> ${job.title}</p>
    <p><strong>Description:</strong> ${job.description}</p>
    <p><strong>Expiry:</strong> ${job.expiry}</p>
    <p><strong>Salary:</strong> ${job.salary}</p>
    <p><strong>Telebirr:</strong> ${job.editorTelebirr}</p>
    <p><strong>Delivery:</strong> <a href="${job.deliverLink}" target="_blank">📁 View File</a></p>
  `;
}
loadLast();

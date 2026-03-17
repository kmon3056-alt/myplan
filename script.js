import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgWhjhHfUA5tjXNqo5Ci67mKVFhdw-62g",
    authDomain: "planme-cb749.firebaseapp.com",
    projectId: "planme-cb749",
    storageBucket: "planme-cb749.firebasestorage.app",
    messagingSenderId: "365862800805",
    appId: "1:365862800805:web:20716ddab9a92c20e32c4c",
    measurementId: "G-1DMXDB7DGS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, "students");

// บันทึกข้อมูล
document.getElementById('btnSave').addEventListener('click', async () => {
    const sid = document.getElementById('studentId').value;
    const name = document.getElementById('studentName').value;

    if (sid && name) {
        await addDoc(colRef, {
            studentId: sid,
            name: name,
            createdAt: new Date()
        });
        document.getElementById('studentId').value = "";
        document.getElementById('studentName').value = "";
    }
});

// แสดงผลและลบข้อมูล
onSnapshot(query(colRef, orderBy("createdAt", "desc")), (snapshot) => {
    const tbody = document.getElementById('studentList');
    tbody.innerHTML = "";
    snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.studentId}</td>
            <td>${item.name}</td>
            <td><button class="btn-del" data-id="${docSnap.id}">ลบ</button></td>
        `;
        tbody.appendChild(row);
    });

    // ผูกเหตุการณ์การลบ (Delegation)
    document.querySelectorAll('.btn-del').forEach(btn => {
        btn.onclick = async () => {
            if (confirm("ลบข้อมูลนี้?")) {
                await deleteDoc(doc(db, "students", btn.dataset.id));
            }
        };
    });
});

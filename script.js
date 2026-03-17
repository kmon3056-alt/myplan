// นำเข้า Firebase SDK (ใช้เวอร์ชัน 10 แบบ Module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. ตั้งค่า Firebase ตามที่คุณให้มา
const firebaseConfig = {
    apiKey: "AIzaSyAgWhjhHfUA5tjXNqo5Ci67mKVFhdw-62g",
    authDomain: "planme-cb749.firebaseapp.com",
    projectId: "planme-cb749",
    storageBucket: "planme-cb749.firebasestorage.app",
    messagingSenderId: "365862800805",
    appId: "1:365862800805:web:20716ddab9a92c20e32c4c",
    measurementId: "G-1DMXDB7DGS"
};

// เริ่มต้นใช้งาน Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. ข้อมูลตารางเรียนจำลอง (Mock Data)
const scheduleData = {
    "จันทร์": ["คณิตศาสตร์", "ภาษาไทย", "วิทยาศาสตร์", "ศิลปะ"],
    "อังคาร": ["ภาษาอังกฤษ", "สังคมศึกษา", "พละศึกษา", "คอมพิวเตอร์"],
    "พุธ": ["วิทยาศาสตร์", "คณิตศาสตร์", "ประวัติศาสตร์", "ลูกเสือ/เนตรนารี"],
    "พฤหัสบดี": ["ภาษาไทย", "ภาษาอังกฤษ", "ดนตรี", "แนะแนว"],
    "ศุกร์": ["คอมพิวเตอร์", "คณิตศาสตร์", "สังคมศึกษา", "ชมรม"]
};

// 3. จัดการ UI
const scheduleContainer = document.getElementById('scheduleContainer');
const noteModal = document.getElementById('noteModal');
const closeModal = document.getElementById('closeModal');
const modalSubjectName = document.getElementById('modalSubjectName');
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const statusMessage = document.getElementById('statusMessage');
const gradeSelect = document.getElementById('gradeSelect');

let currentSubject = "";
let currentGrade = gradeSelect.value;

gradeSelect.addEventListener('change', (e) => {
    currentGrade = e.target.value;
    // ในระบบจริงสามารถดึงข้อมูลตารางที่ต่างกันตามระดับชั้นได้ที่นี่
});

// ฟังก์ชันสร้างตารางเรียน
function renderSchedule() {
    scheduleContainer.innerHTML = '';
    for (const [day, subjects] of Object.entries(scheduleData)) {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const dayTitle = document.createElement('div');
        dayTitle.className = 'day-title';
        dayTitle.textContent = day;
        dayCard.appendChild(dayTitle);

        const subjectList = document.createElement('div');
        subjectList.className = 'subject-list';

        subjects.forEach(subject => {
            const item = document.createElement('div');
            item.className = 'subject-item';
            item.textContent = subject;
            item.onclick = () => openModal(subject);
            subjectList.appendChild(item);
        });

        dayCard.appendChild(subjectList);
        scheduleContainer.appendChild(dayCard);
    }
}

// เปิด/ปิด Modal
function openModal(subject) {
    currentSubject = subject;
    modalSubjectName.textContent = `วิชา: ${subject}`;
    noteText.value = '';
    statusMessage.textContent = '';
    noteModal.classList.remove('hidden');
}

closeModal.onclick = () => noteModal.classList.add('hidden');

// 4. ฟังก์ชันบันทึกข้อมูล
saveNoteBtn.onclick = async () => {
    const note = noteText.value.trim();
    if (!note) {
        alert("กรุณาพิมพ์โน้ตก่อนบันทึกนะเด็กๆ 😅");
        return;
    }

    saveNoteBtn.disabled = true;
    saveNoteBtn.textContent = "กำลังบันทึก...";

    try {
        // ก. บันทึกลง Firebase Firestore
        await addDoc(collection(db, "student_notes"), {
            grade: currentGrade,
            subject: currentSubject,
            note: note,
            timestamp: serverTimestamp()
        });

        // ข. จำลองการบันทึกลง Google Sheets
        await saveToGoogleSheetsMock(currentGrade, currentSubject, note);

        statusMessage.textContent = "บันทึกสำเร็จแล้ว! 🎉";
        setTimeout(() => {
            noteModal.classList.add('hidden');
            saveNoteBtn.disabled = false;
            saveNoteBtn.textContent = "บันทึกข้อมูล 💾";
        }, 1500);

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = "เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะ";
        statusMessage.style.color = "red";
        saveNoteBtn.disabled = false;
        saveNoteBtn.textContent = "บันทึกข้อมูล 💾";
    }
};

// ฟังก์ชันจำลองการยิงข้อมูลเข้า Google Sheets
async function saveToGoogleSheetsMock(grade, subject, note) {
    // หมายเหตุสำหรับการนำไปใช้จริง: 
    // คุณต้องสร้าง Google Apps Script (doPost) ที่ผูกกับ Sheet ID: 102gpPD_GPsCRpF3zwN11k93T1XO6rrKa1i1XXkNR-04
    // จากนั้นนำ Web App URL มาใส่แทนที่ MOCK_URL นี้
    const sheetId = "102gpPD_GPsCRpF3zwN11k93T1XO6rrKa1i1XXkNR-04";
    const payload = {
        sheet_id: sheetId,
        grade: grade,
        subject: subject,
        note: note,
        date: new Date().toISOString()
    };
    
    console.log("Simulating API Call to Google Sheets Web App with payload:", payload);
    // สร้าง Promise จำลองเวลาโหลด 0.5 วินาที
    return new Promise(resolve => setTimeout(resolve, 500));
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
renderSchedule();

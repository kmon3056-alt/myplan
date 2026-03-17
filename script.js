import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// อัปเดตข้อมูล Firebase อันใหม่ของคุณตรงนี้ครับ
const firebaseConfig = {
  apiKey: "AIzaSyDZAcbv6IPBs1FzINqmNeuwsLeIxw6UbNg",
  authDomain: "myplan-1d795.firebaseapp.com",
  projectId: "myplan-1d795",
  storageBucket: "myplan-1d795.firebasestorage.app",
  messagingSenderId: "213850865909",
  appId: "1:213850865909:web:a5071192adaf51253105bc",
  measurementId: "G-DBZMZM7BEK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

let timeSlots = [
    "08:30 - 09:20", "09:20 - 10:10", "10:10 - 11:00", 
    "11:00 - 11:50", "12:40 - 13:30", "13:30 - 14:20", "14:20 - 15:10"
];
let lunchTime = "11:50 - 12:40";

const daysConfig = [
    { id: 'mon', name: 'จันทร์', className: 'row-mon' },
    { id: 'tue', name: 'อังคาร', className: 'row-tue' },
    { id: 'wed', name: 'พุธ', className: 'row-wed' },
    { id: 'thu', name: 'พฤหัสบดี', className: 'row-thu' },
    { id: 'fri', name: 'ศุกร์', className: 'row-fri' }
];

let scheduleData = {};
daysConfig.forEach(day => {
    scheduleData[day.id] = Array(7).fill().map(() => ({ subject: "ว่าง", teacher: "-", note: "" }));
});

let currentEditDay = null;
let currentEditSlot = null;

function renderTable() {
    const timeHeaderRow = document.getElementById('timeHeaderRow');
    timeHeaderRow.innerHTML = '<th class="day-col">วัน / เวลา</th>';
    
    for(let i=0; i<4; i++) timeHeaderRow.appendChild(createTimeHeader(i, i+1));

    const lunchTh = document.createElement('th');
    lunchTh.className = 'lunch-header';
    lunchTh.innerHTML = `<div class="time-header"><span>พักเที่ยง</span><span>${lunchTime}</span><button class="edit-time-btn" onclick="editLunchTime()">✏️ แก้ไข</button></div>`;
    timeHeaderRow.appendChild(lunchTh);

    for(let i=4; i<7; i++) timeHeaderRow.appendChild(createTimeHeader(i, i+1));

    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = '';
    
    daysConfig.forEach((day, dayIndex) => {
        const tr = document.createElement('tr');
        tr.className = day.className;
        
        const tdDay = document.createElement('td');
        tdDay.className = 'day-col';
        tdDay.textContent = day.name;
        tr.appendChild(tdDay);

        for(let i=0; i<4; i++) tr.appendChild(createSubjectCell(day.id, i));

        if (dayIndex === 0) {
            const tdLunch = document.createElement('td');
            tdLunch.rowSpan = 5;
            tdLunch.className = 'lunch-cell';
            tdLunch.innerHTML = '🍽️<br><br>พักรับประทานอาหาร';
            tr.appendChild(tdLunch);
        }

        for(let i=4; i<7; i++) tr.appendChild(createSubjectCell(day.id, i));

        scheduleBody.appendChild(tr);
    });
}

function createTimeHeader(index, periodNum) {
    const th = document.createElement('th');
    th.innerHTML = `<div class="time-header"><span>คาบ ${periodNum}</span><span>${timeSlots[index]}</span><button class="edit-time-btn" onclick="editTime(${index})">✏️ แก้ไข</button></div>`;
    return th;
}

function createSubjectCell(dayId, index) {
    const td = document.createElement('td');
    const slotData = scheduleData[dayId][index];
    td.innerHTML = `<div class="subject-cell" onclick="openModal('${dayId}', ${index})"><div class="subject-name">${slotData.subject}</div><div class="teacher-name">ครู: ${slotData.teacher}</div></div>`;
    return td;
}

window.editTime = function(index) {
    const newTime = prompt(`แก้ไขเวลาคาบที่ ${index + 1}:`, timeSlots[index]);
    if (newTime !== null && newTime.trim() !== "") { timeSlots[index] = newTime.trim(); renderTable(); }
};

window.editLunchTime = function() {
    const newTime = prompt(`แก้ไขเวลาพักเที่ยง:`, lunchTime);
    if (newTime !== null && newTime.trim() !== "") { lunchTime = newTime.trim(); renderTable(); }
};

window.openModal = function(dayId, slotIndex) {
    currentEditDay = dayId; currentEditSlot = slotIndex;
    const data = scheduleData[dayId][slotIndex];
    document.getElementById('subjectInput').value = data.subject === "ว่าง" ? "" : data.subject;
    document.getElementById('teacherInput').value = data.teacher === "-" ? "" : data.teacher;
    document.getElementById('noteInput').value = data.note;
    document.getElementById('statusMsg').textContent = "";
    document.getElementById('editModal').classList.add('active');
};

window.closeModal = function() { document.getElementById('editModal').classList.remove('active'); };

document.getElementById('gradeSelect').addEventListener('change', (e) => {
    document.getElementById('displayGradeTitle').textContent = `ตารางเรียน ชั้น ${e.target.value}`;
});

document.getElementById('saveBtn').addEventListener('click', async () => {
    const subject = document.getElementById('subjectInput').value.trim() || "ว่าง";
    const teacher = document.getElementById('teacherInput').value.trim() || "-";
    const note = document.getElementById('noteInput').value.trim();
    const grade = document.getElementById('gradeSelect').value;
    
    const btn = document.getElementById('saveBtn');
    const msg = document.getElementById('statusMsg');

    scheduleData[currentEditDay][currentEditSlot] = { subject, teacher, note };
    renderTable();

    if (!note) { closeModal(); return; }

    btn.disabled = true; btn.textContent = "กำลังบันทึก...";

    try {
        if (currentUser && !currentUser.isOffline) {
            // อัปเดต appId ให้ตรงกับ config อันใหม่ด้วยเพื่อไม่ให้เกิด Error ตอนบันทึก
            const appId = "1:213850865909:web:a5071192adaf51253105bc"; 
            const dbPath = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'student_notes');
            await addDoc(dbPath, { grade, day: daysConfig.find(d => d.id === currentEditDay).name, time: timeSlots[currentEditSlot], subject, teacher, note, timestamp: serverTimestamp() });
        }
        await saveToGoogleSheetsMock(grade, subject, teacher, note);
        msg.style.color = "green"; msg.textContent = "อัปเดตข้อมูลสำเร็จ! 🎉";
        setTimeout(() => { closeModal(); btn.disabled = false; btn.textContent = "บันทึกข้อมูล 💾"; }, 1000);
    } catch (error) {
        msg.style.color = "orange"; msg.textContent = "อัปเดตบนหน้าจอสำเร็จ (ระบบคลาวด์มีปัญหา)";
        setTimeout(() => { closeModal(); btn.disabled = false; btn.textContent = "บันทึกข้อมูล 💾"; }, 1500);
    }
});

function saveToGoogleSheetsMock(grade, subject, teacher, note) {
    return new Promise(resolve => setTimeout(resolve, 600)); 
}

window.openDownloadModal = function() { document.getElementById('downloadModal').classList.add('active'); };
window.closeDownloadModal = function() { document.getElementById('downloadModal').classList.remove('active'); };

window.executeDownload = function(format) {
    closeDownloadModal();
    const editBtns = document.querySelectorAll('.edit-time-btn');
    editBtns.forEach(btn => btn.style.display = 'none');
    
    html2canvas(document.getElementById('captureArea'), { scale: 2, backgroundColor: '#FFFFFF', logging: false }).then(canvas => {
        editBtns.forEach(btn => btn.style.display = 'inline-block');
        const link = document.createElement('a');
        link.download = `ตารางเรียนของฉัน.${format}`; link.href = canvas.toDataURL(`image/${format}`, 0.9); link.click();
    }).catch(err => {
        alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ");
        editBtns.forEach(btn => btn.style.display = 'inline-block');
    });
};

async function initApp() {
    try {
        await signInAnonymously(auth);
        onAuthStateChanged(auth, (user) => {
            if (user) { currentUser = user; document.getElementById('loadingOverlay').style.display = 'none'; renderTable(); }
        });
    } catch (error) {
        currentUser = { uid: "offline-mode", isOffline: true };
        document.getElementById('loadingOverlay').style.display = 'none'; renderTable(); 
    }
}

initApp();

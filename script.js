import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// === ตั้งค่าต่างๆ ===
// ถ้านำ URL จาก Google Apps Script มาแล้ว ให้นำมาใส่ในเครื่องหมายคำพูดด้านล่างนี้ได้เลยครับ
const GOOGLE_SCRIPT_URL = ""; 

const firebaseConfig = {
    apiKey: "AIzaSyAgWhjhHfUA5tjXNqo5Ci67mKVFhdw-62g",
    authDomain: "planme-cb749.firebaseapp.com",
    projectId: "planme-cb749",
    storageBucket: "planme-cb749.firebasestorage.app",
    messagingSenderId: "365862800805",
    appId: "1:365862800805:web:20716ddab9a92c20e32c4c",
    measurementId: "G-1DMXDB7DGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันเปิด/ปิด Modal หน้าต่างเพิ่มข้อมูล
window.toggleModal = (show) => {
    document.getElementById('addModal').style.display = show ? 'flex' : 'none';
};

// ฟังก์ชันดึงข้อมูลจาก Firebase มาแสดงผล
async function loadSchedules() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-6 text-xl font-mali animate-pulse">กำลังโหลดข้อมูลตารางเรียน... ⏳</td></tr>';
    
    try {
        const q = query(collection(db, "schedules"));
        const querySnapshot = await getDocs(q);
        
        let html = '';
        let lastTeacher = '';
        let lastNote = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // เอาคำว่าอีโมจิออกเพื่อใช้เช็คคลาส CSS สี
            const rawDay = data.day.replace(/[^ก-๙a-zA-Z]/g, '').trim(); 
            
            lastTeacher = data.teacherName;
            lastNote = data.note;
            html += `
                <tr class="border-b-4 border-black hover:bg-white transition-colors">
                    <td class="p-3 border-r-4 border-black text-center font-bold text-lg day-${rawDay}">${data.day}</td>
                    <td class="p-3 border-r-4 border-black text-center font-semibold text-blue-700">${data.time}</td>
                    <td class="p-3 border-r-4 border-black text-center font-bold bg-white">${data.level}</td>
                    <td class="p-3 border-r-4 border-black font-bold text-lg">${data.subject}</td>
                    <td class="p-3 text-center font-bold bg-gray-100">${data.room}</td>
                </tr>
            `;
        });

        if(html === '') html = '<tr><td colspan="5" class="text-center p-8 text-xl font-mali text-gray-500">ยังไม่มีตารางเรียน กดเพิ่มเลย! ✨</td></tr>';
        tbody.innerHTML = html;

        if(lastTeacher) {
            document.getElementById('displayTeacherName').innerText = lastTeacher;
            document.getElementById('displayNote').innerText = lastNote || "ไม่มีโน้ตเพิ่มเติม";
            document.getElementById('teacherName').value = lastTeacher;
            document.getElementById('teacherNote').value = lastNote;
        }

    } catch (error) {
        console.error("Error:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-red-500">โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่</td></tr>';
    }
}

// ฟังก์ชันบันทึกข้อมูล
document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "⏳ กำลังบันทึก...";
    submitBtn.disabled = true;

    const payload = {
        teacherName: document.getElementById('teacherName').value,
        note: document.getElementById('teacherNote').value,
        day: document.getElementById('day').value,
        time: document.getElementById('time').value,
        level: document.getElementById('level').value,
        room: document.getElementById('room').value,
        subject: document.getElementById('subject').value,
        timestamp: new Date()
    };

    try {
        await addDoc(collection(db, "schedules"), payload);

        if(GOOGLE_SCRIPT_URL !== "") {
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        toggleModal(false);
        e.target.reset();
        loadSchedules();

    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ฟังก์ชันดาวน์โหลดภาพ
window.exportSchedule = async (type) => {
    const element = document.getElementById('captureArea');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    
    if (type === 'png' || type === 'jpg') {
        const link = document.createElement('a');
        link.download = `ตารางเรียน_PlanMe.${type}`;
        link.href = canvas.toDataURL(`image/${type === 'jpg' ? 'jpeg' : 'png'}`);
        link.click();
    } else if (type === 'pdf') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' = แนวนอน
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        pdf.save('ตารางเรียน_PlanMe.pdf');
    }
};

// โหลดข้อมูลเมื่อเปิดเว็บ
window.addEventListener('DOMContentLoaded', loadSchedules);

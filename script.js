/* ================= CSS ตกแต่ง UI/UX ธีมพาสเทล ================= */
:root {
    --bg-color: #FFF0F5;
    --primary: #FFB6C1;
    --secondary: #87CEFA;
    --text-dark: #4A4A4A;
    --text-light: #7A7A7A;
    --shadow: 0 4px 15px rgba(0,0,0,0.05);
    
    --day-mon: #FFF5BA;
    --day-tue: #FFD1DC;
    --day-wed: #C1E1C1;
    --day-thu: #FFDAB9;
    --day-fri: #B4E4FF;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Mali', cursive;
    background-color: var(--bg-color);
    color: var(--text-dark);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-container {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
    max-width: 1000px;
}

h1 { color: #FF69B4; font-size: 2rem; margin-bottom: 5px; }
p.subtitle { color: var(--text-light); margin-bottom: 15px; }

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
}

select, button {
    font-family: 'Mali', cursive;
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    outline: none;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform 0.2s;
}

select {
    border: 2px solid var(--primary);
    background: white;
    color: var(--text-dark);
}

button { font-weight: 600; }
button:hover { transform: translateY(-2px); }
button:active { transform: translateY(0); }

.btn-png { background-color: #AEC6CF; color: white; }
.btn-jpg { background-color: #FFB347; color: white; }
.btn-save { background-color: #77DD77; color: white; width: 100%; margin-top: 15px;}
.btn-download-main { background-color: #B19CD9; color: white; }

.capture-area {
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 1100px;
    overflow-x: auto;
}

.schedule-title-display {
    text-align: center;
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 15px;
    font-weight: bold;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 5px;
    min-width: 900px;
}

th, td {
    padding: 12px;
    text-align: center;
    border-radius: 12px;
    vertical-align: top;
}

th { background-color: #F0F0F0; color: #555; position: relative; }

.time-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.edit-time-btn {
    font-size: 0.8rem;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    cursor: pointer;
    color: #888;
}

.day-col { font-weight: bold; font-size: 1.1rem; width: 100px; }

.subject-cell {
    background-color: #FAFAFA;
    border: 2px dashed #E0E0E0;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.subject-cell:hover {
    transform: scale(1.02);
    border-style: solid;
}

.subject-name { font-weight: bold; color: var(--text-dark); font-size: 1.05rem;}
.teacher-name { font-size: 0.85rem; color: var(--text-light); margin-top: 5px; }

.row-mon .subject-cell, .row-mon .day-col { background-color: var(--day-mon); border-color: #E8D880; }
.row-tue .subject-cell, .row-tue .day-col { background-color: var(--day-tue); border-color: #E8A8B8; }
.row-wed .subject-cell, .row-wed .day-col { background-color: var(--day-wed); border-color: #A0C8A0; }
.row-thu .subject-cell, .row-thu .day-col { background-color: var(--day-thu); border-color: #E8B898; }
.row-fri .subject-cell, .row-fri .day-col { background-color: var(--day-fri); border-color: #90C8E8; }

.lunch-cell {
    background-color: #FFF3E0;
    border: 2px dashed #FFCC80;
    vertical-align: middle !important;
    font-size: 1.2rem;
    color: #E65100;
    font-weight: bold;
    letter-spacing: 1px;
}
.lunch-header { background-color: #FFE0B2 !important; }

/* Modal */
.modal {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}
.modal.active { opacity: 1; pointer-events: auto; }

.modal-content {
    background: white; padding: 30px; border-radius: 20px;
    width: 90%; max-width: 400px;
    position: relative;
    transform: translateY(-20px);
    transition: transform 0.3s;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.modal.active .modal-content { transform: translateY(0); }

.close-btn {
    position: absolute; top: 15px; right: 20px;
    font-size: 1.5rem; cursor: pointer; color: #aaa;
}

.modal-title { color: var(--primary); margin-bottom: 15px; text-align: center; }
.text-center { text-align: center; }
.download-btn-group { display: flex; gap: 15px; justify-content: center; margin-top: 20px; }

.input-group { margin-bottom: 15px; text-align: left; }
.input-group label { display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-dark); }
.input-group input, .input-group textarea {
    width: 100%; padding: 10px; border-radius: 10px;
    border: 1px solid #ccc; font-family: 'Mali', cursive;
}
.input-group textarea { resize: none; height: 80px; }

.status-msg { margin-top: 10px; font-size: 0.9rem; text-align: center; min-height: 20px;}

/* Loading Overlay */
#loadingOverlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: white; z-index: 9999;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
}
#loadingOverlay h2 { color: #FF69B4; margin-top: 10px; }

.spinner {
    border: 6px solid #f3f3f3; border-top: 6px solid var(--primary);
    border-radius: 50%; width: 50px; height: 50px;
    animation: spin 1s linear infinite; margin-bottom: 10px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

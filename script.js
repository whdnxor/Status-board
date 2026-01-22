const storedSoldiers = localStorage.getItem('soldiers');
const storedOfficers = localStorage.getItem('officers');

let soldiers = storedSoldiers ? JSON.parse(storedSoldiers) : [
    { id: 1, name: "김공군", joinDate: "2024-05-14", status: "present" },
    { id: 2, name: "이상병", joinDate: "2025-01-20", status: "present" },
    { id: 3, name: "박정비", joinDate: "2025-03-10", status: "present" },
    { id: 4, name: "하늘이", joinDate: "2025-09-05", status: "present" },
    { id: 5, name: "최신병", joinDate: "2026-01-10", status: "present" }
];

let officers = storedOfficers ? JSON.parse(storedOfficers) : [
    { id: 6, name: "안반장", rank: "상사", status: "present" },
    { id: 7, name: "김중사", rank: "중사", status: "present" },
    { id: 8, name: "최중사", rank: "중사", status: "present" },
    { id: 9, name: "박하사", rank: "하사", status: "present" },
    { id: 10, name: "조하사", rank: "하사", status: "present" }
];

let selectedID = null;

function saveData() {
    localStorage.setItem('soldiers', JSON.stringify(soldiers));
    localStorage.setItem('officers', JSON.stringify(officers));
}

function addSoldier(name, joinDateStr) {
    if (!name || !joinDateStr) {
        alert("이름과 입대일을 모두 입력해주세요.");
        return;
    }
    const newID = Date.now();
    soldiers.push({ id: newID, name: name, joinDate: joinDateStr, status: "present" });
    saveData();
    renderBoard();
}

function addOfficer(name, rank) {
    if (!name || !rank) {
        alert("이름과 계급을 모두 입력해주세요.");
        return;
    }
    const newID = Date.now();
    officers.push({ id: newID, name: name, rank: rank, status: "present" });
    saveData();
    renderBoard();
}

function deleteMember() {
    if (!selectedID) {
        alert("삭제할 인원을 먼저 선택해주세요.");
        return;
    }

    if (confirm("정말 삭제하시겠습니까?")) {
        const initialSoldierCount = soldiers.length;
        soldiers = soldiers.filter(s => s.id !== selectedID);

        if (soldiers.length === initialSoldierCount) {
            officers = officers.filter(o => o.id !== selectedID);
        }

        selectedID = null;
        saveData();
        renderBoard();
    }
}

function getNextMonthFirstDay(date, monthsToAdd) {
    const targetDate = new Date(date);
    targetDate.setMonth(targetDate.getMonth() + monthsToAdd);
    if (targetDate.getDate() !== 1) {
        targetDate.setMonth(targetDate.getMonth() + 1);
        targetDate.setDate(1);
    }
    return targetDate;
}

function getRank(joinDateStr) {
    const joinDate = new Date(joinDateStr);
    const today = new Date();
    const dischargeDate = new Date(joinDate);
    dischargeDate.setMonth(dischargeDate.getMonth() + 21);
    dischargeDate.setDate(dischargeDate.getDate() - 1);

    if (today > dischargeDate) {
        return null;
    }
    const pfcDate = getNextMonthFirstDay(joinDate, 2);
    const cplDate = getNextMonthFirstDay(joinDate, 8);
    const sgtDate = getNextMonthFirstDay(joinDate, 14);

    let rank = "이병";
    if (today >= sgtDate) rank = "병장";
    else if (today >= cplDate) rank = "상병";
    else if (today >= pfcDate) rank = "일병";

    return rank;
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const activeSoldiers = soldiers.filter(soldier => { return getRank(soldier.joinDate) !== null; });

    const officerContainer = document.createElement('div');
    officerContainer.className = 'officer-container';

    const soldierContainer = document.createElement('div');
    soldierContainer.className = 'soldier-container';

    const separator = document.createElement('div');
    separator.className = 'separator';
    
    officers.forEach(officer => {
        const card = document.createElement('div');
        let classString = `officer status-${officer.status}`;
        if (officer.id === selectedID) {
            classString += ' selected';
        }
        card.className = classString;

        card.innerHTML = `
            <div class="rank">${officer.rank}</div>
            <div class="name">${officer.name}</div>
        `;

        card.onclick = () => {
            selectedID = (selectedID === officer.id) ? null : officer.id;
            renderBoard();
        };
        officerContainer.appendChild(card);
    });

    activeSoldiers.forEach(soldier => {
        const rank = getRank(soldier.joinDate);
        const card = document.createElement('div');
        let classString = `soldier status-${soldier.status}`;
        if (soldier.id === selectedID) {
            classString += ' selected';
        }
        card.className = classString;

        card.innerHTML = `
            <div class="rank">${rank}</div>
            <div class="name">${soldier.name}</div>
        `;

        card.onclick = () => {
            selectedID = (selectedID === soldier.id) ? null : soldier.id;
            renderBoard();
        };
        soldierContainer.appendChild(card);
    });
    board.appendChild(officerContainer);
    board.appendChild(separator);
    board.appendChild(soldierContainer);
}

function applyStatus(newStatus) {
    const member = soldiers.find(s => s.id === selectedID) || officers.find(s => s.id === selectedID);
    if (member) {
        member.status = newStatus;
        selectedID = null;
        saveData();
        renderBoard();
    }
}

renderBoard();


let soldiers = [
    { id: 1, name: "김공군", joinDate: "2024-12-14", status: "present" },
    { id: 2, name: "이신병", joinDate: "2025-01-20", status: "present" },
    { id: 3, name: "박정비", joinDate: "2025-03-10", status: "present" },
    { id: 4, name: "하늘이", joinDate: "2025-09-05", status: "present" }
];

let selectedID = null;

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
    const pfcDate = getPromotionDate(joinDate, 2);
    const cplDate = getPromotionDate(joinDate, 8);
    const sgtDate = getPromotionDate(joinDate, 14);

    let rank = "이병";
    if (today >= sgtDate) rank = "병장";
    else if (today >= cplDate) rank = "상병";
    else if (today >= pfcDate) rank = "일병";

    return rank;
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const activeSoldiers = soldiers.filter(soldier => {return getRank(soldier.joinDate) !== null;});

    activeSoldiers.forEach(soldiers => {
        const rank = getRank(soldiers.joinDate);
        const card = document.createElement('div');
        let classString = 'soldier status - ${soldiers.status}';
        if (soldiers.id === selectedID) {
            classString += ' selected';
        }
        card.className = classString;

        card.innerHTML = `
            <div class="rank">${rank}</div>
            <div class="name">${soldiers.name}</div>
        `;

        card.onclick = () => {
            selectedID = (selectedID === soldiers.id) ? null : soldiers.id;
            renderBoard();
        };
        board.appendChild(card);

    });
}

function applyStatus(newStatus) {
    const soldier = soldiers.find(s => s.id === selectedID);
    if (soldier) {
        soldier.status = newStatus;
        selectedID = null;
        renderBoard();
    }
}

renderBoard();


async function loadExcel() {
    // تحميل ملف Excel من Google Sheets بصيغة xlsx
    const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQBEEWleneEDduy7yyqTQN8jbwJmgCvDRAmqFEbybcoATaE27SkNGZEc4hUqvfKnNKnL2Csye6Vvs8v/pub?output=xlsx");
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // تحويل محتوى الورقة إلى صيغة JSON
    window.excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    displayExcel(window.excelData);
}

function displayExcel(data) {
    const headerRow = document.getElementById("tableHeader");
    const body = document.getElementById("tableBody");

    // مسح المحتوى السابق للجدول
    headerRow.innerHTML = "";
    body.innerHTML = "";

    // عرض ترويسة الجدول
    data[0].forEach(header => {
        const th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });

    // عرض البيانات
    data.slice(1).forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.innerText = cell;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}

function searchExcel() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    // تصفية البيانات بناءً على مصطلح البحث في جميع الأعمدة
    const results = window.excelData.slice(1).filter(row =>
        row.some(cell => cell && cell.toString().toLowerCase().includes(searchTerm))
    );

    // عرض النتائج مع الاحتفاظ بعناوين الأعمدة
    displayExcel([window.excelData[0], ...results]);
}

// تحميل بيانات Excel عند تشغيل الصفحة
loadExcel();
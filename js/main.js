function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var clockEl = document.getElementById('clock');
    clockEl.textContent = h + ':' + m + ':' + s;
    clockEl.setAttribute('datetime', now.toISOString());
}
updateClock();
setInterval(updateClock, 1000);

function doSearch() {
    var query = document.querySelector('.search-input').value.trim();
    if (query) {
        window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(query));
    }
}

var searchInput = document.querySelector('.search-input');
var overlay = document.querySelector('.overlay');

searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doSearch();
});

searchInput.addEventListener('click', function(e) {
    e.stopPropagation();
    searchInput.classList.add('active');
    overlay.classList.add('active');
});

document.getElementById('searchBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    doSearch();
});

document.getElementById('settingsBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleSettings();
});

document.getElementById('settingsPanel').addEventListener('click', function(e) {
    e.stopPropagation();
});

document.getElementById('confirmAddBtn').addEventListener('click', confirmAdd);
document.getElementById('cancelAddBtn').addEventListener('click', closeAddForm);
document.getElementById('editBookmarkBtn').addEventListener('click', editCurrentBookmark);
document.getElementById('deleteBookmarkBtn').addEventListener('click', deleteCurrentBookmark);

document.getElementById('editForm').addEventListener('click', function(e) {
    e.stopPropagation();
});

document.getElementById('resetBgBtn').addEventListener('click', resetBackground);
document.getElementById('resetClockBtn').addEventListener('click', resetClockColor);

document.addEventListener('click', function() {
    searchInput.classList.remove('active');
    overlay.classList.remove('active');
    document.getElementById('editForm').classList.remove('show');
    document.getElementById('settingsPanel').classList.remove('show');
});

/*书签*/
var defaultBookmarks = [
    { name: 'B站', url: 'https://www.bilibili.com', icon: 'B' },
    { name: '力扣', url: 'https://leetcode.cn', icon: '力' }
];
var bookmarksData = JSON.parse(localStorage.getItem('bookmarksData')) || defaultBookmarks;
var currentEditIndex = -1;

function saveBookmarks() {
    localStorage.setItem('bookmarksData', JSON.stringify(bookmarksData));
}

function renderBookmarks() {
    var container = document.getElementById('bookmarks');
    var html = '';
    bookmarksData.forEach(function(item, index) {
        html += '<div class="bookmark-item" data-index="' + index + '">' +
            '<div class="bookmark-icon"><span>' + item.icon + '</span></div>' +
            '<span class="bookmark-label">' + item.name + '</span></div>';
    });
    html += '<div class="bookmark-item add-item">' +
        '<div class="bookmark-icon add"><span>+</span></div>' +
        '<span class="bookmark-label">添加</span></div>';
    container.innerHTML = html;

    container.querySelectorAll('.bookmark-item:not(.add-item)').forEach(function(el) {
        var idx = parseInt(el.getAttribute('data-index'));
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open(bookmarksData[idx].url);
        });
        el.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();
            showEditForm(e, idx);
        });
    });

    container.querySelector('.add-item').addEventListener('click', function(e) {
        e.stopPropagation();
        showAddForm(this);
    });
}

function showAddForm(addItem) {
    var form = document.getElementById('addForm');
    var rect = addItem.getBoundingClientRect();
    form.style.left = rect.left + rect.width / 2 - 120 + 'px';
    form.style.top = rect.top - 120 + 'px';
    form.classList.add('show');
    if (currentEditIndex === -1 || !window.editMode) {
        document.getElementById('bookmarkName').value = '';
        document.getElementById('bookmarkUrl').value = '';
    }
    document.getElementById('bookmarkName').focus();
}

function closeAddForm() {
    document.getElementById('addForm').classList.remove('show');
}

function showEditForm(event, index) {
    currentEditIndex = index;
    var form = document.getElementById('editForm');
    form.style.left = event.clientX + 'px';
    form.style.top = event.clientY + 'px';
    form.classList.add('show');
}

function closeEditForm() {
    document.getElementById('editForm').classList.remove('show');
}

function editCurrentBookmark() {
    if (currentEditIndex === -1) return;
    var item = bookmarksData[currentEditIndex];
    document.getElementById('bookmarkName').value = item.name;
    document.getElementById('bookmarkUrl').value = item.url;
    closeEditForm();
    window.editMode = true;
    window.currentEditIndex = currentEditIndex;
    showAddForm(document.querySelector('.add-item'));
}

function confirmAdd() {
    var name = document.getElementById('bookmarkName').value.trim();
    var url = document.getElementById('bookmarkUrl').value.trim();
    if (!name || !url) return;
    if (window.editMode && currentEditIndex !== -1) {
        bookmarksData[currentEditIndex] = {
            name: name,
            url: url,
            icon: name.charAt(0)
        };
        window.editMode = false;
        currentEditIndex = -1;
    } else {
        bookmarksData.push({
            name: name,
            url: url,
            icon: name.charAt(0)
        });
    }
    saveBookmarks();
    renderBookmarks();
    closeAddForm();
}

function deleteCurrentBookmark() {
    if (currentEditIndex === -1) return;
    bookmarksData.splice(currentEditIndex, 1);
    saveBookmarks();
    renderBookmarks();
    closeEditForm();
}

renderBookmarks();

function fetchQuote() {
    fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=h&c=i&c=k')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var text = data.hitokoto;
            if (data.from) text += ' —— ' + data.from;
            document.getElementById('quote').textContent = text;
        })
        .catch(function() {
            var fallback = [
                "不积跬步，无以至千里。",
                "千里之行，始于足下。",
                "学而不思则罔，思而不学则殆。"
            ];
            document.getElementById('quote').textContent = fallback[Math.floor(Math.random() * fallback.length)];
        });
}
fetchQuote();

function toggleSettings() {
    var panel = document.getElementById('settingsPanel');
    panel.classList.toggle('show');
}

/*背景渐变色设置*/
var defaultColors = ['#f6ede7', '#e9fce4', '#dffdfb', '#e5e9fa', '#facadc'];
var colorPickers = [
    document.getElementById('gradColor1'),
    document.getElementById('gradColor2'),
    document.getElementById('gradColor3'),
    document.getElementById('gradColor4'),
    document.getElementById('gradColor5')
];

function applyGradient(colors) {
    document.body.style.backgroundImage = 'linear-gradient(135deg, ' + colors.join(', ') + ')';
    localStorage.setItem('customBgColors', JSON.stringify(colors));
}

var savedColors = JSON.parse(localStorage.getItem('customBgColors'));
if (savedColors && savedColors.length === 5) {
    applyGradient(savedColors);
    savedColors.forEach(function(c, i) { colorPickers[i].value = c; });
}

colorPickers.forEach(function(picker) {
    picker.addEventListener('input', function() {
        var currentColors = colorPickers.map(function(p) { return p.value; });
        applyGradient(currentColors);
    });
});

function resetBackground() {
    applyGradient(defaultColors);
    defaultColors.forEach(function(c, i) { colorPickers[i].value = c; });
    localStorage.removeItem('customBgColors');
}

/*时钟颜色设置*/
var defaultClockColors = ['#ff4747', '#ff942e', '#c8de43', '#449645', '#3ec5ba', '#4695ff', '#d150e8'];
var clockPickers = [
    document.getElementById('clockColor1'),
    document.getElementById('clockColor2'),
    document.getElementById('clockColor3'),
    document.getElementById('clockColor4'),
    document.getElementById('clockColor5'),
    document.getElementById('clockColor6'),
    document.getElementById('clockColor7')
];

function applyClockGradient(colors) {
    var clk = document.getElementById('clock');
    clk.style.backgroundImage = 'linear-gradient(135deg, ' + colors.join(', ') + ')';
    localStorage.setItem('customClockColors', JSON.stringify(colors));
}

var savedClockColors = JSON.parse(localStorage.getItem('customClockColors'));
if (savedClockColors && savedClockColors.length === 7) {
    applyClockGradient(savedClockColors);
    savedClockColors.forEach(function(c, i) { clockPickers[i].value = c; });
}

clockPickers.forEach(function(picker) {
    picker.addEventListener('input', function() {
        var currentColors = clockPickers.map(function(p) { return p.value; });
        applyClockGradient(currentColors);
    });
});

function resetClockColor() {
    applyClockGradient(defaultClockColors);
    defaultClockColors.forEach(function(c, i) { clockPickers[i].value = c; });
    localStorage.removeItem('customClockColors');
}

// Global variables
let currentDocument = {
    content: '',
    fileName: 'Untitled Document',
    isModified: false
};

let undoStack = [];
let redoStack = [];
let zoomLevel = 100;
let wordCount = 0;

// DOM elements
const editor = document.getElementById('editor');
const fontFamily = document.getElementById('fontFamily');
const fontSize = document.getElementById('fontSize');
const textColor = document.getElementById('textColor');
const highlightColor = document.getElementById('highlightColor');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    updateWordCount();
    updateCursorPosition();
});

// Initialize editor
function initializeEditor() {
    // Set default values
    fontFamily.value = 'Arial';
    fontSize.value = '12';
    textColor.value = '#000000';
    highlightColor.value = '#ffff00';
    
    // Focus on editor
    editor.focus();
}

// Setup event listeners
function setupEventListeners() {
    // Editor events
    editor.addEventListener('input', handleEditorInput);
    editor.addEventListener('keydown', handleKeyDown);
    editor.addEventListener('mouseup', updateCursorPosition);
    editor.addEventListener('keyup', updateCursorPosition);
    editor.addEventListener('selectionchange', updateSelectionInfo);
    
    // Formatting buttons
    document.getElementById('boldBtn').addEventListener('click', () => formatText('bold'));
    document.getElementById('italicBtn').addEventListener('click', () => formatText('italic'));
    document.getElementById('underlineBtn').addEventListener('click', () => formatText('underline'));
    document.getElementById('strikethroughBtn').addEventListener('click', () => formatText('strikethrough'));
    
    // Alignment buttons
    document.getElementById('alignLeftBtn').addEventListener('click', () => alignText('left'));
    document.getElementById('alignCenterBtn').addEventListener('click', () => alignText('center'));
    document.getElementById('alignRightBtn').addEventListener('click', () => alignText('right'));
    document.getElementById('justifyBtn').addEventListener('click', () => alignText('justify'));
    
    // List buttons
    document.getElementById('bulletListBtn').addEventListener('click', () => formatList('ul'));
    document.getElementById('numberListBtn').addEventListener('click', () => formatList('ol'));
    
    // Indent buttons
    document.getElementById('decreaseIndentBtn').addEventListener('click', decreaseIndent);
    document.getElementById('increaseIndentBtn').addEventListener('click', increaseIndent);
    
    // Clear formatting
    document.getElementById('clearFormatBtn').addEventListener('click', clearFormatting);
    
    // Font controls
    fontFamily.addEventListener('change', () => setFontFamily(fontFamily.value));
    fontSize.addEventListener('change', () => setFontSize(fontSize.value));
    textColor.addEventListener('change', () => setTextColor(textColor.value));
    highlightColor.addEventListener('change', () => setHighlightColor(highlightColor.value));
    
    // Zoom controls
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    
    // File operations
    document.getElementById('saveBtn').addEventListener('click', saveDocument);
    document.getElementById('printBtn').addEventListener('click', printDocument);
    document.getElementById('shareBtn').addEventListener('click', shareDocument);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle editor input
function handleEditorInput() {
    saveToUndoStack();
    updateWordCount();
    currentDocument.isModified = true;
    updateDocumentStats();
}

// Handle key down events
function handleKeyDown(event) {
    // Handle Enter key for new paragraphs
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift+Enter for line break
            event.preventDefault();
            document.execCommand('insertLineBreak', false, null);
        } else {
            // Regular Enter for new paragraph
            event.preventDefault();
            document.execCommand('insertParagraph', false, null);
        }
    }
    
    // Handle Tab key
    if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
            decreaseIndent();
        } else {
            increaseIndent();
        }
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 's':
                event.preventDefault();
                saveDocument();
                break;
            case 'o':
                event.preventDefault();
                openFile();
                break;
            case 'n':
                event.preventDefault();
                newDocument();
                break;
            case 'p':
                event.preventDefault();
                printDocument();
                break;
            case 'z':
                event.preventDefault();
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                break;
            case 'y':
                event.preventDefault();
                redo();
                break;
            case 'a':
                event.preventDefault();
                selectAll();
                break;
            case 'c':
                event.preventDefault();
                copy();
                break;
            case 'v':
                event.preventDefault();
                paste();
                break;
            case 'x':
                event.preventDefault();
                cut();
                break;
        }
    }
}

// Text formatting functions
function formatText(command) {
    document.execCommand(command, false, null);
    updateFormattingButtons();
    editor.focus();
}

function alignText(alignment) {
    document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1), false, null);
    updateAlignmentButtons();
    editor.focus();
}

function formatList(listType) {
    if (listType === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
    } else {
        document.execCommand('insertOrderedList', false, null);
    }
    editor.focus();
}

function increaseIndent() {
    document.execCommand('indent', false, null);
    editor.focus();
}

function decreaseIndent() {
    document.execCommand('outdent', false, null);
    editor.focus();
}

function clearFormatting() {
    document.execCommand('removeFormat', false, null);
    updateFormattingButtons();
    editor.focus();
}

function setFontFamily(family) {
    document.execCommand('fontName', false, family);
    editor.focus();
}

function setFontSize(size) {
    document.execCommand('fontSize', false, size);
    editor.focus();
}

function setTextColor(color) {
    document.execCommand('foreColor', false, color);
    editor.focus();
}

function setHighlightColor(color) {
    document.execCommand('hiliteColor', false, color);
    editor.focus();
}

// Update formatting buttons state
function updateFormattingButtons() {
    const buttons = ['boldBtn', 'italicBtn', 'underlineBtn', 'strikethroughBtn'];
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        const command = btnId.replace('Btn', '');
        btn.classList.toggle('active', document.queryCommandState(command));
    });
}

function updateAlignmentButtons() {
    const alignments = ['left', 'center', 'right', 'justify'];
    alignments.forEach(alignment => {
        const btn = document.getElementById('align' + alignment.charAt(0).toUpperCase() + alignment.slice(1) + 'Btn');
        btn.classList.toggle('active', document.queryCommandState('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1)));
    });
}

// Undo/Redo functionality
function saveToUndoStack() {
    const content = editor.innerHTML;
    undoStack.push(content);
    if (undoStack.length > 50) {
        undoStack.shift();
    }
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(editor.innerHTML);
        editor.innerHTML = undoStack.pop();
        updateWordCount();
        updateCursorPosition();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(editor.innerHTML);
        editor.innerHTML = redoStack.pop();
        updateWordCount();
        updateCursorPosition();
    }
}

// File operations
function newDocument() {
    if (currentDocument.isModified) {
        if (confirm('Do you want to save changes to the current document?')) {
            saveDocument();
        }
    }
    editor.innerHTML = '<p>Welcome to Word Editor!</p><p>Start typing your document here.</p>';
    currentDocument.fileName = 'Untitled Document';
    currentDocument.isModified = false;
    undoStack = [];
    redoStack = [];
    updateWordCount();
    updateDocumentStats();
    editor.focus();
}

function openFile() {
    document.getElementById('openModal').style.display = 'flex';
}

function saveDocument() {
    document.getElementById('saveModal').style.display = 'flex';
}

function saveAs() {
    document.getElementById('saveModal').style.display = 'flex';
}

function confirmSave() {
    const fileName = document.getElementById('fileName').value;
    const fileFormat = document.getElementById('fileFormat').value;
    
    let content = editor.innerHTML;
    let mimeType = 'text/html';
    let extension = '.html';
    
    if (fileFormat === 'txt') {
        content = editor.innerText;
        mimeType = 'text/plain';
        extension = '.txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + extension;
    a.click();
    URL.revokeObjectURL(url);
    
    currentDocument.fileName = fileName;
    currentDocument.isModified = false;
    updateDocumentStats();
    closeModal('saveModal');
}

function confirmOpen() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (file.name.endsWith('.txt')) {
                editor.innerText = e.target.result;
            } else {
                editor.innerHTML = e.target.result;
            }
            currentDocument.fileName = file.name;
            currentDocument.isModified = false;
            updateWordCount();
            updateDocumentStats();
            undoStack = [];
            redoStack = [];
        };
        reader.readAsText(file);
    }
    
    closeModal('openModal');
}

function printDocument() {
    window.print();
}

function shareDocument() {
    if (navigator.share) {
        navigator.share({
            title: currentDocument.fileName,
            text: editor.innerText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(editor.innerText).then(() => {
            alert('Document content copied to clipboard!');
        });
    }
}

// Edit operations
function cut() {
    document.execCommand('cut', false, null);
    editor.focus();
}

function copy() {
    document.execCommand('copy', false, null);
    editor.focus();
}

async function paste() {
    try {
        const text = await navigator.clipboard.readText();
        document.execCommand('insertText', false, text);
    } catch (err) {
        alert('Paste failed. Use Ctrl+V instead.');
        console.error(err);
    }
}


function selectAll() {
    document.execCommand('selectAll', false, null);
    editor.focus();
}

// Zoom functionality
function zoomIn() {
    if (zoomLevel < 200) {
        zoomLevel += 10;
        updateZoom();
    }
}

function zoomOut() {
    if (zoomLevel > 50) {
        zoomLevel -= 10;
        updateZoom();
    }
}

function updateZoom() {
    document.getElementById('zoomLevel').textContent = zoomLevel + '%';
    editor.style.transform = `scale(${zoomLevel / 100})`;
    editor.style.transformOrigin = 'top left';
}

// Utility functions
function updateWordCount() {
    const text = editor.innerText || editor.textContent;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount = words.length;
    document.getElementById('wordCount').textContent = wordCount + ' words';
}

function updateCursorPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        
        let line = 1;
        let column = 1;
        
        if (container.nodeType === Node.TEXT_NODE) {
            const text = container.textContent;
            const lines = text.split('\n');
            line = lines.length;
            column = range.startOffset + 1;
        }
        
        document.getElementById('cursorPosition').textContent = `Ln ${line}, Col ${column}`;
    }
}

function updateSelectionInfo() {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    if (selectedText.length > 0) {
        document.getElementById('selectionInfo').textContent = `${selectedText.length} characters selected`;
    } else {
        document.getElementById('selectionInfo').textContent = '';
    }
}

function updateDocumentStats() {
    const stats = currentDocument.isModified ? 'Modified' : 'Ready';
    document.getElementById('documentStats').textContent = stats;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Auto-save functionality
setInterval(() => {
    if (currentDocument.isModified) {
        localStorage.setItem('wordEditor_autoSave', editor.innerHTML);
        localStorage.setItem('wordEditor_fileName', currentDocument.fileName);
    }
}, 30000); // Auto-save every 30 seconds

// Load auto-saved content on page load
window.addEventListener('load', () => {
    const autoSavedContent = localStorage.getItem('wordEditor_autoSave');
    const autoSavedFileName = localStorage.getItem('wordEditor_fileName');
    
    if (autoSavedContent && !editor.innerHTML.includes('Welcome to Word Editor')) {
        if (confirm('Found auto-saved content. Would you like to restore it?')) {
            editor.innerHTML = autoSavedContent;
            currentDocument.fileName = autoSavedFileName || 'Auto-saved Document';
            updateWordCount();
        }
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (currentDocument.isModified) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Context menu for right-click
editor.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // You can add custom context menu here
});

// Drag and drop support
editor.addEventListener('dragover', (e) => {
    e.preventDefault();
    editor.style.border = '2px dashed #0078d4';
});

editor.addEventListener('dragleave', (e) => {
    e.preventDefault();
    editor.style.border = 'none';
});

editor.addEventListener('drop', (e) => {
    e.preventDefault();
    editor.style.border = 'none';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('text/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                editor.innerHTML = e.target.result;
                updateWordCount();
            };
            reader.readAsText(file);
        }
    }
});

// Export functions for global access
window.newDocument = newDocument;
window.openFile = openFile;
window.saveDocument = saveDocument;
window.saveAs = saveAs;
window.printDocument = printDocument;
window.undo = undo;
window.redo = redo;
window.cut = cut;
window.copy = copy;
window.paste = paste;
window.closeModal = closeModal;
window.confirmSave = confirmSave;
window.confirmOpen = confirmOpen; 


const insertImageBtn = document.getElementById('insertImageBtn');
const imageUpload = document.getElementById('imageUpload');


// Button opens file picker
insertImageBtn.addEventListener('click', () => imageUpload.click());

// Insert chosen image
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        // Insert an <img> at the current cursor position
        document.execCommand('insertImage', false, evt.target.result);
    };
    reader.readAsDataURL(file);
});

// Drag & Drop
editor.addEventListener('dragover', (e) => {
    e.preventDefault();
    editor.classList.add('drag-over');
});
editor.addEventListener('dragleave', () => editor.classList.remove('drag-over'));

editor.addEventListener('drop', (e) => {
    e.preventDefault();
    editor.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            document.execCommand('insertImage', false, evt.target.result);
        };
        reader.readAsDataURL(file);
    }
});



// Handle clicks inside editor: open links in a new tab, still support image selection
editor.addEventListener('click', function (e) {
    // If click is inside an <a>, open it in a new tab (works reliably inside contenteditable)
    const anchor = e.target.closest && e.target.closest('a');
    if (anchor) {
        e.preventDefault(); // prevent caret placement / default contenteditable behavior
        const href = anchor.getAttribute('href');
        if (!href) return;
        const newWin = window.open(href, '_blank');
        // best-effort to remove opener reference for security
        if (newWin) try { newWin.opener = null; } catch (err) { }
        return;
    }

    // existing image selection logic
    if (e.target.tagName === 'IMG') {
        selectImage(e.target);
    } else {
        removeSelection();
    }
});


function selectImage(img) {
    removeSelection();
    img.classList.add('resizable');

    // Create handle
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    img.parentElement.style.position = 'relative';
    img.parentElement.appendChild(handle);

    enableDrag(img);
    enableResize(img, handle);
}

function removeSelection() {
    const selected = editor.querySelector('img.resizable');
    if (!selected) return;
    selected.classList.remove('resizable');
    const handle = selected.parentElement.querySelector('.resize-handle');
    if (handle) handle.remove();
}


function enableDrag(img) {
    let offsetX, offsetY;

    img.onmousedown = function (e) {
        if (e.target.classList.contains('resize-handle')) return; // skip if resizing
        e.preventDefault();
        offsetX = e.clientX - img.offsetLeft;
        offsetY = e.clientY - img.offsetTop;

        document.onmousemove = function (e) {
            img.style.position = 'absolute';
            img.style.left = (e.clientX - offsetX) + 'px';
            img.style.top = (e.clientY - offsetY) + 'px';
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}


function enableResize(img, handle) {
    let startX, startY, startWidth, startHeight;

    handle.onmousedown = function (e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(img).width, 10);
        startHeight = parseInt(window.getComputedStyle(img).height, 10);

        document.onmousemove = function (e) {
            img.style.width = startWidth + (e.clientX - startX) + 'px';
            img.style.height = startHeight + (e.clientY - startY) + 'px';
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}


document.getElementById('createTableBtn').addEventListener('click', () => {
    const rows = parseInt(prompt("How many rows?"), 10);
    const cols = parseInt(prompt("How many columns?"), 10);
    if (rows > 0 && cols > 0) insertTable(rows, cols);
});


function insertTable(rows, cols) {
    const table = document.createElement('table');
    table.className = 'editor-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    for (let r = 0; r < rows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const td = document.createElement('td');
            td.innerHTML = '<br>';  // allow caret to go inside
            td.style.border = '1px solid #999';
            td.style.padding = '4px';
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    // insert at caret position
    insertNodeAtCursor(table);
}


function insertNodeAtCursor(node) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    // Move caret after the table
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


function addTableResizers(table) {
    const firstRow = table.rows[0];
    if (!firstRow) return;

    // create a wrapper for positioning
    table.style.position = 'relative';

    Array.from(firstRow.cells).forEach((cell, i) => {
        // Skip the very last cell if you don't want a handle after it
        if (i === firstRow.cells.length) return;

        const resizer = document.createElement('div');
        resizer.className = 'col-resizer';
        resizer.style.height = table.offsetHeight + 'px';

        // Position the handle at the right edge of the cell
        positionResizer(resizer, cell);

        // Drag logic
        let startX, startWidth;
        resizer.addEventListener('mousedown', e => {
            e.preventDefault();
            startX = e.pageX;
            startWidth = cell.offsetWidth;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            const diff = e.pageX - startX;
            cell.style.width = (startWidth + diff) + 'px';
            // match all cells in this column
            for (let r = 1; r < table.rows.length; r++) {
                table.rows[r].cells[i].style.width = cell.style.width;
            }
            positionResizer(resizer, cell);
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        table.parentElement.appendChild(resizer);
    });
}

function positionResizer(resizer, cell) {
    const rect = cell.getBoundingClientRect();
    const tableRect = cell.closest('table').getBoundingClientRect();
    resizer.style.left = (rect.right - tableRect.left - 3) + 'px';
    resizer.style.top = (rect.top - tableRect.top) + 'px';
}


function insertTable(rows, cols) {
    const table = document.createElement('table');
    table.className = 'editor-table';
    table.style.borderCollapse = 'collapse';

    for (let r = 0; r < rows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const td = document.createElement('td');
            td.innerHTML = '<br>';
            td.style.border = '1px solid #999';
            td.style.padding = '4px';
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    insertNodeAtCursor(table);
    addTableResizers(table); // <— add handles
}

// Insert link button — creates a link and ensures it opens in a new tab
document.getElementById('insertLinkBtn').addEventListener('click', () => {
    const url = prompt("Enter the URL", "https://");
    if (!url) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        // Wrap current selection with a link
        document.execCommand('createLink', false, url);

        // Try to find the newly created anchor and set attributes
        const a = getAnchorInSelection();
        if (a) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        }
    } else {
        // No selection -> ask for link text and insert an <a>
        const text = prompt("Enter the text for the link", "Click here");
        if (!text) return;
        const a = document.createElement('a');
        a.href = url;
        a.textContent = text;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        insertNodeAtCursor(a);
    }
});

// helper to find an <a> element from the current selection
function getAnchorInSelection() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    let node = sel.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    return node && node.closest ? node.closest('a') : null;
}





function updateFormattingButtons() {
    const buttons = ['boldBtn', 'italicBtn', 'underlineBtn', 'strikethroughBtn', 'insertLinkBtn'];
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        const command = btnId.replace('Btn', '');
        btn.classList.toggle('active', document.queryCommandState(command));
    });
}

// Ensure pasted/dragged links get target=_blank and rel set
function ensureLinksAttributes() {
    editor.querySelectorAll('a').forEach(a => {
        if (a.target !== '_blank') a.target = '_blank';
        // ensure rel contains noopener noreferrer
        const rel = (a.getAttribute('rel') || '');
        if (!/noopener/i.test(rel) || !/noreferrer/i.test(rel)) {
            a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
    });
}
// run once now
ensureLinksAttributes();
// watch for changes (paste, insert, etc.)
const mo = new MutationObserver(() => ensureLinksAttributes());
mo.observe(editor, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });

document.getElementById('insertYoutubeBtn').addEventListener('click', () => {
    const url = prompt("Paste YouTube URL (e.g. https://youtu.be/VIDEO_ID):");
    if (!url) return;

    // Extract the video ID from typical YouTube URLs
    const match = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (!match) {
        alert("Invalid YouTube link");
        return;
    }
    const videoId = match[1];

    // Ask for custom size
    const width = prompt("Width in pixels:", "560") || "560";
    const height = prompt("Height in pixels:", "315") || "315";

    // Create a container div that is draggable & resizable
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    wrapper.contentEditable = "false"; // prevents caret inside
    wrapper.draggable = true;

    wrapper.innerHTML = `
      <iframe width="${width}" height="${height}"
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
      <div class="resize-handle"></div>
    `;

    insertNodeAtCursor(wrapper);
    enableDrag(wrapper);
    enableResize(wrapper);
});

// --- drag support inside contenteditable ---
function enableDrag(el) {
    el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/html', el.outerHTML);
        el.classList.add('dragging');
    });
    el.addEventListener('dragend', e => {
        el.classList.remove('dragging');
    });
}

// Optional helper to insert HTML at caret
function insertNodeAtCursor(node) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
}

// --- simple resize with mouse ---
function enableResize(wrapper) {
    const handle = wrapper.querySelector('.resize-handle');
    let startX, startY, startW, startH;

    handle.addEventListener('mousedown', e => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        const iframe = wrapper.querySelector('iframe');
        startW = parseInt(document.defaultView.getComputedStyle(iframe).width, 10);
        startH = parseInt(document.defaultView.getComputedStyle(iframe).height, 10);

        function doDrag(e) {
            const iframe = wrapper.querySelector('iframe');
            iframe.style.width = (startW + e.clientX - startX) + 'px';
            iframe.style.height = (startH + e.clientY - startY) + 'px';
        }

        function stopDrag() {
            document.documentElement.removeEventListener('mousemove', doDrag);
            document.documentElement.removeEventListener('mouseup', stopDrag);
        }

        document.documentElement.addEventListener('mousemove', doDrag);
        document.documentElement.addEventListener('mouseup', stopDrag);
    });
}


const toggleBtn = document.getElementById('toggleSourceBtn');
let showingSource = false;

toggleBtn.addEventListener('click', () => {
    if (!showingSource) {
        // Switch to source view
        const html = editor.innerHTML;
        // Store and show as plain text inside a <pre><code> block or textarea
        editor.textContent = html;       // shows raw HTML
        editor.classList.add('source-view');
        toggleBtn.classList.add('active');
        showingSource = true;
    } else {
        // Back to WYSIWYG
        const code = editor.textContent;
        editor.innerHTML = code;
        editor.classList.remove('source-view');
        toggleBtn.classList.remove('active');
        showingSource = false;
    }
});

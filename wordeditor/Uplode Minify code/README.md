# Word Editor - Microsoft Word-like Web Application

A modern, feature-rich web-based text editor that mimics Microsoft Word's functionality with a beautiful and intuitive interface.

## 🚀 Features

### 📝 Text Editing
- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Text Alignment**: Left, center, right, and justify alignment
- **Font Controls**: Multiple font families and sizes
- **Color Options**: Text color and highlight color pickers
- **Lists**: Bullet points and numbered lists
- **Indentation**: Increase and decrease text indentation

### 📁 File Operations
- **New Document**: Start fresh with a new document
- **Open Files**: Load existing text files (.txt, .html)
- **Save Documents**: Export as HTML, plain text, or Word-like format
- **Auto-save**: Automatic saving every 30 seconds
- **Print Support**: Print documents directly from the browser

### 🎯 Advanced Features
- **Undo/Redo**: Full undo and redo functionality
- **Copy/Paste**: Standard clipboard operations
- **Keyboard Shortcuts**: Full keyboard support
- **Zoom Controls**: Zoom in/out for better readability
- **Word Count**: Real-time word counting
- **Cursor Position**: Track cursor location
- **Drag & Drop**: Drop text files directly into the editor

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Microsoft Office-like Interface**: Familiar toolbar and layout
- **Dark/Light Theme Support**: Professional color scheme
- **Smooth Animations**: Polished user experience
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start editing immediately!

### File Structure
```
word-editor-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and layout
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save document |
| `Ctrl/Cmd + O` | Open file |
| `Ctrl/Cmd + N` | New document |
| `Ctrl/Cmd + P` | Print document |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + C` | Copy |
| `Ctrl/Cmd + V` | Paste |
| `Ctrl/Cmd + X` | Cut |
| `Tab` | Increase indent |
| `Shift + Tab` | Decrease indent |
| `Enter` | New paragraph |
| `Shift + Enter` | Line break |

## 🎯 Usage Guide

### Getting Started
1. **Open the Application**: Double-click `index.html` or open it in your browser
2. **Start Typing**: Click in the editor area and begin typing
3. **Format Text**: Use the toolbar buttons to format your text
4. **Save Your Work**: Use Ctrl+S or click the save button

### Text Formatting
- **Bold**: Click the bold button or use `Ctrl+B`
- **Italic**: Click the italic button or use `Ctrl+I`
- **Underline**: Click the underline button or use `Ctrl+U`
- **Font Size**: Select from the dropdown menu
- **Font Family**: Choose from available fonts
- **Text Color**: Click the color picker to change text color
- **Highlight**: Use the highlight color picker

### File Management
- **New Document**: File → New or Ctrl+N
- **Open File**: File → Open or Ctrl+O
- **Save**: File → Save or Ctrl+S
- **Save As**: File → Save As
- **Print**: File → Print or Ctrl+P

### Advanced Features
- **Zoom**: Use the zoom controls to adjust view size
- **Word Count**: View real-time word count in the header
- **Auto-save**: Your work is automatically saved every 30 seconds
- **Drag & Drop**: Drop text files directly into the editor

## 🔧 Customization

### Adding New Fonts
Edit the `fontFamily` select element in `index.html`:
```html
<option value="Your Font">Your Font</option>
```

### Changing Colors
Modify the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #0078d4;
    --secondary-color: #106ebe;
    --background-color: #f5f5f5;
}
```

### Adding Features
The modular JavaScript structure makes it easy to add new features:
1. Add HTML elements for new controls
2. Add event listeners in `setupEventListeners()`
3. Implement functionality in separate functions
4. Update the UI as needed

## 🌟 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance Features

- **Efficient Rendering**: Optimized for smooth typing experience
- **Memory Management**: Automatic cleanup of undo/redo stacks
- **Local Storage**: Auto-save to browser storage
- **Responsive Design**: Optimized for all screen sizes

## 🔒 Privacy & Security

- **Client-side Only**: No data sent to external servers
- **Local Storage**: All data stored locally in your browser
- **No Tracking**: No analytics or tracking code
- **Open Source**: Transparent code for security review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern browser APIs for functionality
- Microsoft Office for UI inspiration

## 📞 Support

If you encounter any issues or have suggestions:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Try refreshing the page
4. Clear browser cache if needed

---

**Enjoy your Microsoft Word-like editing experience!** 🎉 
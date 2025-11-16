# explore-new-techs
Explore new programming languages and build innovative stuff

## Selfie to US Passport Photo Converter

A web-based tool that converts any selfie into a professional 4x6" sheet with 6 US passport-sized photos ready for printing. **Features AI-powered automatic background removal!**

### Features

- **🤖 AI Background Removal**: Automatically removes any background and replaces it with pure white
- **Easy Upload**: Drag and drop or click to upload any selfie
- **Interactive Editor**: Adjust zoom, position, and rotation to perfectly frame your photo
- **Professional Enhancement**: Brightness and contrast controls for optimal photo quality
- **US Passport Compliant**: Generates 2x2 inch passport photos following US requirements
- **High Quality**: 300 DPI resolution for professional printing
- **4x6 Sheet Layout**: 6 photos (2 columns x 3 rows) on a standard 4x6" photo paper
- **Instant Download**: Download as high-quality JPEG (95% quality)
- **Pure White Background**: AI ensures clean, professional passport photos with perfect white background

### How to Use

1. Open `index.html` in your web browser
2. Upload **any** selfie (JPEG or PNG, max 10MB) - background will be automatically removed!
3. Wait 10-30 seconds while AI removes the background (first use takes longer as AI models download)
   - **Optional**: Click "Skip AI Processing" to use your original image without AI background removal
4. Adjust the photo using the sliders:
   - **Zoom**: Scale your photo to fit perfectly
   - **Position X/Y**: Move your photo horizontally and vertically
   - **Rotation**: Straighten your photo if needed
   - **Brightness**: Enhance lighting for a professional look (default: 1.1)
   - **Contrast**: Improve photo clarity and definition (default: 1.1)
5. Click "Generate 4x6 Sheet" to create the passport photo sheet
6. Click "Download High-Quality JPEG" to save the file
7. Print on 4x6" photo paper for perfect passport photos!

### US Passport Photo Requirements

✅ **White Background** - Automatically handled by AI!

You just need to ensure:
- Face directly towards camera
- Neutral expression with eyes open
- No glasses, hats, or headphones
- Clear, well-lit photo
- Photo taken within last 6 months

### Technical Specifications

- **Output Size**: 1200 x 1800 pixels (4x6 inches at 300 DPI)
- **Passport Photo Size**: 600 x 600 pixels (2x2 inches at 300 DPI)
- **Layout**: 2 columns x 3 rows = 6 photos per sheet
- **Format**: JPEG with 95% quality
- **Resolution**: 300 DPI (print-ready)

### Technologies Used

- **@imgly/background-removal** - AI-powered background removal library
- **HTML5 Canvas API** - Image processing and manipulation
- **Vanilla JavaScript** - Core application logic
- **Responsive CSS** - Modern, mobile-friendly design
- **Client-side processing** - No server required, all processing happens in your browser
- **Machine Learning** - WASM-based AI models for accurate background removal

### Browser Support

Works on all modern browsers that support HTML5 Canvas and WebAssembly:
- Chrome/Edge (recommended for best performance)
- Firefox
- Safari (version 11.1+)
- Opera

**Note**: First-time use will download AI models (~5-10MB). Subsequent uses will be faster thanks to browser caching.

### Troubleshooting

**Q: AI processing is taking too long (over 30 seconds)**
- Click "Skip AI Processing" button to use your original image
- Make sure your photo already has a white/light background
- Try using a smaller image file
- Refresh the page and try again

**Q: AI processing failed**
- The app will automatically load your original image
- Ensure your photo has a white background for best results
- Check your internet connection (AI models need to download on first use)
- Try a different browser (Chrome/Edge recommended)

**Q: Background removal quality is not good**
- Use a photo with clear subject separation from background
- Ensure good lighting and focus
- If needed, click "Skip" and use a photo with white background instead

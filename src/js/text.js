const textInput = document.getElementById("text-input");

if (textInput) {
    // Set fixed height for the container
    const containerHeight = window.innerHeight*0.16; // Half the window height
    textInput.style.height = `${containerHeight}px`;
   
    

    function adjustFontSize() {
        const maxWidth = textInput.clientWidth;
        const maxHeight = containerHeight; // Fixed height for the container

        let fontSize = containerHeight; // Start large
        textInput.style.fontSize = `${fontSize}px`;
        textInput.style.overflow = "scroll"; // Hide overflow text

        // Adjust font size until it fits within the fixed height
        while (
            (textInput.scrollWidth > maxWidth|| textInput.scrollHeight > maxHeight) &&
            fontSize > 10
        ) {
            fontSize -= 1;
            textInput.style.fontSize = `${fontSize}px`;
        }
        textInput.style.overflow = "hidden";
    }

    textInput.addEventListener("input", () => {
        adjustFontSize(); // Adjust font size on input
    });

    window.addEventListener("resize", () => {
        // Recalculate the fixed height on window resize
        textInput.style.height = `${containerHeight}px`;
        adjustFontSize();
    });

    adjustFontSize(); // Initial adjustment
} else {
    console.error("Element with id 'text-input' not found.");
}

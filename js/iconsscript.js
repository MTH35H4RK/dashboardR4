function setActiveIcon(selectedIcon) {
    // Remove 'active' class from all icons and revert their images
    document.querySelectorAll('.icon').forEach(icon => {
        icon.classList.remove('active');
        const img = icon.querySelector('img');
        if (img) {
            if (img.name === "1") img.src = img.src.replace('assets/images/left-arrowactive.png', 'assets/images/left-arrow.png');
            else if (img.name === "2") img.src = img.src.replace('assets/images/car-batteryactive.png', 'assets/images/car-battery.png');
            else if (img.name === "3") img.src = img.src.replace('assets/images/brightnessactive.png', 'assets/images/brightness.png');
            else if (img.name === "4") img.src = img.src.replace('assets/images/headlightactive.png', 'assets/images/headlight.png');
            else if (img.name === "5") img.src = img.src.replace('assets/images/right-arrowactive.png', 'assets/images/right-arrow.png');

            // Revert the image source to the non-active version
            
        }
    });

    // Add 'active' class to the selected icon and update its image
    selectedIcon.classList.add('active');
    const selectedImg = selectedIcon.querySelector('img');
    if (selectedImg) {
        // Change the image source to the active version by appending 'active' to the base name
        if (selectedImg.name === "1") selectedImg.src = selectedImg.src.replace('assets/images/left-arrow.png', 'assets/images/left-arrowactive.png');
        else if (selectedImg.name === "2") selectedImg.src = selectedImg.src.replace('assets/images/car-battery.png', 'assets/images/car-batteryactive.png');
        else if (selectedImg.name === "3") selectedImg.src = selectedImg.src.replace('assets/images/brightness.png', 'assets/images/brightnessactive.png');
        else if (selectedImg.name === "4") selectedImg.src = selectedImg.src.replace('assets/images/headlight.png', 'assets/images/headlightactive.png');
        else if (selectedImg.name === "5") selectedImg.src = selectedImg.src.replace('assets/images/right-arrow.png', 'assets/images/right-arrowactive.png');
    }
}



function setActiveGear(selectedGear) {
    document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
    selectedGear.classList.add('active');
}
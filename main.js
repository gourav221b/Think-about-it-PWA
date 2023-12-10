if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        // .register('./sw-cached-site.js')
        .then(reg => console.log("registered service worker"))
        .catch(err => console.log("error registering service worker,", err))
}
else
    console.log("service worker unavailable")

function showInstallPromotion() {
    if (!sessionStorage.getItem("downloadPrompt")) {
        document.querySelector(".downloadPrompt").style.display = "flex";
        document.querySelector(".downloadPrompt").style.bottom = 0;
    }
}
function hideInstallPromotion() {
    document.querySelector(".downloadPrompt").style.bottom = "-200px";
    setTimeout(() => {
        document.querySelector(".downloadPrompt").style.display = "none";
    }, 300);
    sessionStorage.setItem("downloadPrompt", "false")

}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
});

document.getElementById("buttonHide").addEventListener('click', (e) => {
    // Hide the app provided install promotion
    hideInstallPromotion();
})
document.getElementById("buttonInstall").addEventListener('click', (e) => {
    // Hide the app provided install promotion
    hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
    })
});


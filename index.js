
// document.addEventListener('DOMContentLoaded', function() {
// const loadEl = document.querySelector('#load');
// console.log('The js is connected')
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.firestore().doc('/foo/bar').get().then(() => { });
// firebase.functions().httpsCallable('yourFunction')().then(() => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
// firebase.analytics(); // call to activate
// firebase.analytics().logEvent('tutorial_completed');
// firebase.performance(); // call to activate
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// try {
//     let app = firebase.app();
//     let features = [
//     'auth', 
//     'database', 
//     'firestore',
//     'functions',
//     'messaging', 
//     'storage', 
//     'analytics', 
//     'remoteConfig',
//     'performance',
//     ].filter(feature => typeof app[feature] === 'function');
//     loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
// } catch (e) {
//     console.error(e);
//     loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
// }
// );



// Opening Task section JavaScript

function showSection(section){
    // add css id, remove the id from the other tab
    const tabs = document.getElementsByClassName('single-tab')
    console.log(tabs)
    const clickedId = event.target.id;
    const selectedButton = document.getElementById(clickedId)
    console.log(selectedButton.innerHTML)
    selectedButton.setAttribute('id', 'clicked-tab')
    
    for (tab in tabs){
        if (tab != selectedButton){
            console.log(tab)
        }
    }

    // if (section == 'Daily'){
        

    // }
    // else if (section == 'Tasks'){

    // }
}


function resetDailyTasks(){
    
}


// Closing Task section JavaScript
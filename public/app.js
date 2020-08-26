const auth = firebase.auth();
const db = firebase.firestore();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

const createThing = document.getElementById('createThings');
const thingList = document.getElementById('thingsList');


let thingsRef;
let unsubscribe;


signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user) {
        // user signed in 
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>hello ${user.displayName}</h3> <p>User ID: ${user.uid}</p>`;
        
        thingsRef = db.collection('things');

        createThing.onclick = () => {
            
            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: 'Max',
                createdAt: serverTimestamp()
            })

        }
    
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {

                const items = querySnapshot.docs.map(doc => {
                    return `<li>${ doc.data().name }</li>`
                });
                thingList.innerHTML = items.join('');
            });
    
    } else {
        unsubscribe && unsubscribe();

    }
});





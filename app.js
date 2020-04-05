const modalAddClose = document.querySelector('#modalAddClose')
const modalBgAdd = document.querySelector('#modalBgAdd')
const cName = document.getElementById('contactName')
const cNumber = document.getElementById('contactNumber')
const cEmail = document.getElementById('contactEmail')
const cAddress = document.getElementById('contactAddress')
const cNotes = document.getElementById('contactNotes')

//Opens add modal
const addBtn = document.querySelector('.addBtn')
addBtn.addEventListener('click', () => { 
    modalBgAdd.style.display = 'block'
})

//Closes add modal
modalAddClose.addEventListener('click', () => {
    modalBgAdd.style.display = 'none'
    //Clear form
    document.getElementById('form').reset()
})

//Displays the contacts(if there are any) when the page has loaded
if(localStorage.getItem('contacts') != null)
document.addEventListener('load', displayContacts())

//Storing the unique ID to localstorage so that it will not 
//reset to zero when the page is refreshed
let contactID = localStorage.getItem('ID')
if(!contactID)
    contactID = 0



//Listen to form submit
document.getElementById('form').addEventListener('submit', function(e){
    e.preventDefault()
    localStorage.setItem('ID', ++contactID)
    addContact(contactID)
    console.log(contactID)
})

// Function addContact adds the contact information to an object
// and saves it to local storage
function addContact(id){
    //Contact Object
    const contact = {
        id: id,
        name: cName.value,
        number: cNumber.value,
        email: cEmail.value,
        address: cAddress.value,
        notes: cNotes.value
    }

    //Check if local storage is empty
    if(localStorage.getItem('contacts') === null){
        //Initialize array where contacts will be stored
        const contacts = []
        //Add contact object to contacts array
        contacts.push(contact)
        //Set to local storage
        localStorage.setItem('contacts', JSON.stringify(contacts))
    } else { //local storage is not empty
        //Fetch the array from local storage
        const contacts = JSON.parse(localStorage.getItem('contacts'))
        //Add contact object to contacts array
        contacts.push(contact)
        //Put back to local storage
        localStorage.setItem('contacts', JSON.stringify(contacts))
    }

    //Clear form
    document.getElementById('form').reset()

    //Close modal
    document.getElementById('modalBgAdd').style.display = 'none'

    //Display contacts
    displayContacts()
}

//Function displayContacts displays the contacts in the contactsContainer div
function displayContacts(){
    //Fetch contacts from local storage
    const contacts = JSON.parse(localStorage.getItem('contacts'))

    //Get container ID
    const cContainer = document.getElementById('contactsContainer')

    //Build output
    cContainer.innerHTML = ''
    for(let contact of contacts){
        let name = contact.name
        let number = contact.number
        let email = contact.email
        let id = contact.id

        cContainer.innerHTML += `<div class="contact">
                                    <div onclick="viewContact(${id})" class="contact-info">
                                        <h2 class="main-info">${name}</h2>
                                        <h4 class="sub-info">${number}</h4>
                                    </div>
                                    <button onclick="confirmDel(${id})" class="deleteBtn">X</button>
                                </div>`
        
    }

    //Show number of contacts
    if(contacts.length == 1)
        document.getElementById('numContacts').innerHTML = '1 contact'
    else
        document.getElementById('numContacts').innerHTML = `${contacts.length} contacts`
}

//Confirmation message before deleting a contact
function confirmDel(id){
    const modalBgConfirm = document.getElementById('modalBgConfirm')
    const yesBtn = document.getElementById('yesBtn')
    const noBtn = document.getElementById('noBtn')
    const confirmMsg = document.getElementById('confirmMsg')
    
    //Fetch contacts from local storage
    const contacts = JSON.parse(localStorage.getItem('contacts'))
    //Show confirmation message
    modalBgConfirm.style.display = 'block'
    
    //Loop through contacts
    for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == id){
            confirmMsg.innerHTML = `Are you sure you want to delete ${contacts[i].name} from your contacts?`
        }
    }
    yesBtn.addEventListener('click', () => {
        deleteContact(id)
        modalBgConfirm.style.display = 'none'
    })
    noBtn.addEventListener('click', () => {
        modalBgConfirm.style.display = 'none'
    })

}

//Function deleteContact deletes a contact object from the contacts array
function deleteContact(id){
    //Fetch contacts from local storage
    const contacts = JSON.parse(localStorage.getItem('contacts'))

    //Loop through contacts
    for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == id){
            //remove from array
            contacts.splice(i, 1)
        }
    }

    //Put back to local storage
    localStorage.setItem('contacts', JSON.stringify(contacts))

    //Display contacts
    displayContacts()
}
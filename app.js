// AddContact modal
const cName = document.getElementById('contactName')
const cNumber = document.getElementById('contactNumber')
const cEmail = document.getElementById('contactEmail')
const cAddress = document.getElementById('contactAddress')
const cNotes = document.getElementById('contactNotes')
const modalAddClose = document.querySelector('#modalAddClose')
const modalBgAdd = document.querySelector('#modalBgAdd')
//ViewEditContact Modal
const veName = document.getElementById('veName')
const veNumber = document.getElementById('veNumber')
const veEmail = document.getElementById('veEmail')
const veAddress = document.getElementById('veAddress')
const veNotes = document.getElementById('veNotes')
const modalBgViewEdit = document.querySelector('#modalBgViewEdit')
const inputFields = document.getElementsByClassName('formInput-ve')

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

    //Sort contacts alphabetically by name
    contacts.sort((a,b) => {
        if(a.name < b.name) return -1
        else if(a.name > b.name) return 1
        else return 0
    })

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
                                    <div onclick="viewEditContact(${id})" class="contact-info">
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

//Function viewEditContact allows the user to see and update the contact details
function viewEditContact(id){
    const updateBtn = document.querySelector('.updateBtn')
    const cancelBtn = document.querySelector('.cancelBtn')
    const editBtn = document.querySelector('.editBtn')
    const modalViewEditClose = document.querySelector('#modalViewEditClose')
    const viewEditForm = document.querySelector('#viewEditForm')
    
    //Display modal
    modalBgViewEdit.style.display = 'block'

    //Make the form look uneditable
    for(let field of inputFields){
        field.style.borderBottom = 'none'
    }

    //Make the form uneditable
    for(let field of inputFields){
        field.setAttribute('readonly',1)
    }

    //Fetch contacts from local storage
    const contacts = JSON.parse(localStorage.getItem('contacts'))
    //Loop through contacts
    for(let contact of contacts){
        if(contact.id == id){
            veName.value = contact.name
            veNumber.value = contact.number
            veEmail.value = contact.email
            veAddress.value = contact.address
            veNotes.value = contact.notes
            //Sets a placeholder when there's no value
                if(contact.email == '')
                veEmail.placeholder = "No information available"
                if(contact.address == '')
                veAddress.placeholder = "No information available"
                if(contact.notes == '')
                veNotes.placeholder = "No information available"
        }
    }

    //Event listener for When the edit button is clicked
    editBtn.addEventListener('click', (e) => {
        e.preventDefault()

        //Make the field look editable
        for(let field of inputFields){
        field.style.borderBottom = '1px solid gray'
        }

        //Make the field editable
        for(let field of inputFields){
        field.removeAttribute('readonly')
        }

        //Hides the edit button and displays the update and cancel button
        editBtn.style.display = 'none'
        updateBtn.style.display = 'block'
        cancelBtn.style.display = 'block'

    })


    //Event listener for when the cancel button is clicked
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault()

        //Displays the edit button and hides the update and cancel button
        editBtn.style.display = 'block'
        updateBtn.style.display = 'none'
        cancelBtn.style.display = 'none'
        
        //Make the form look uneditable
        for(let field of inputFields){
            field.style.borderBottom = 'none'
        }

        //Make the form uneditable
        for(let field of inputFields){
            field.setAttribute('readonly',1)
        }
    })


    //Close modal
    modalViewEditClose.addEventListener('click', () => {
        modalBgViewEdit.style.display = 'none'
        
        //Displays the edit button and hides the update and cancel button
        editBtn.style.display = 'block'
        updateBtn.style.display = 'none'
        cancelBtn.style.display = 'none'

        //Make the form uneditable
        for(let field of inputFields){
            field.setAttribute('readonly',1)
        }
    })


    //Event listener for when the form is submitted
    viewEditForm.addEventListener('submit', (e) => {
        //Displays the edit button and hides the update and cancel button
        editBtn.style.display = 'block'
        updateBtn.style.display = 'none'
        cancelBtn.style.display = 'none'

        //Make the form look uneditable
        for(let field of inputFields){
            field.style.borderBottom = 'none'
        }

        //Make the form uneditable
        for(let field of inputFields){
            field.setAttribute('readonly',1)
        }

        //Updates the contact
        for(let contact of contacts){
            if(contact.id == id){
                e.preventDefault()
                updateContact(contact,contacts)
            }
        }

        localStorage.setItem('contacts', JSON.stringify(contacts))
    })

}


//Function updateContact updates the contact object
function updateContact(contact,contacts){
    //Updates the contact
    contact.name = veName.value
    contact.number = veNumber.value
    contact.email = veEmail.value
    contact.address = veAddress.value
    contact.notes = veNotes.value
            
    //Put back to local storage
    localStorage.setItem('contacts', JSON.stringify(contacts))

    displayContacts()
 }

 //Filter search function
const searchBar = document.getElementById('searchBar')
searchBar.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase()
    const cContainer = document.getElementById('contactsContainer')
    const contacts = cContainer.querySelectorAll('.contact')
    
    Array.from(contacts).forEach((contact) => {
        const cName = contact.firstElementChild.querySelector('h2').textContent
        const cNumber = contact.firstElementChild.querySelector('h4').textContent

        if(cName.toLowerCase().substr(0, term.length) == term || cNumber.toLowerCase().indexOf(term) != -1){
            contact.style.display = 'flex'
        } else {
            contact.style.display = 'none'
        }
    })
 })
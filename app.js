class Book {
    constructor (Title,Author,ISBM){
        this.Title=Title
        this.Author = Author
        this.ISBM=ISBM
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create an element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML=
        `<td>${book.Title}</td>
        <td>${book.Author}</td>    
        <td>${book.ISBM}</td>
        <td><a href="#" class="delete">X<a></td>`
        list.appendChild(row);
    }
    showAlert(Error_Message,className){
        // create a div
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(Error_Message));
        // get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        //Insert Alert
        container.insertBefore(div,form);

        // time out after 3 secs
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },1000);
    }
    deletebook(target){
        if (target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    clearfields(){
        document.getElementById('title').value ='';
        document.getElementById('author').value ='';
        document.getElementById('isbn').value ='';
    }
}


// Local storage class

class Store{
    static getbooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[]
        }else{
            books= JSON.parse(localStorage.getItem('books'));
        }
        return books
        
    }
    static displaybooks(){
        const books = Store.getbooks();
        books.forEach(function(book) {
            const ui = new UI;
            ui.addBookToList(book);   
        });
    }
    static addbooks(book){
        const books = Store.getbooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removebooks(isbm){
        const books = Store.getbooks();
        books.forEach(function(book, index) {
            if(book.ISBM === isbm){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }    
}

//DOM Load Even
document.addEventListener('DOMContentLoaded',Store.displaybooks());

// Event listners For adding book
document.getElementById('book-form').addEventListener('submit',function(e){   
    // Get form values
    const title = document.getElementById('title').value,
          author=document.getElementById('author').value,
          isbm = document.getElementById('isbn').value

    // Instantiating Book
    const book = new Book(title,author,isbm);

    // Instantiation UI
    const ui = new UI();

    // validate

    if(title === '' || author === '' || isbm===''){
        // error alert
        ui.showAlert('Please Fill in fields','error');

    }else{
        // Add Book to UI
        ui.addBookToList(book);
        //Add To LS
        Store.addbooks(book);

        //show alert
        ui.showAlert('Book Added','success');

        //Clear
        ui.clearfields();
    }

    e.preventDefault();
});

// Event listner for removing book

document.getElementById('book-list').addEventListener('click',function(e){
    // Instantiation UI
    const ui = new UI();
    //Deleting book
    ui.deletebook(e.target);
    Store.removebooks(e.target.parentElement.previousElementSibling.textContent);
    // show alert
    ui.showAlert('Book removed','success');
    e.preventDefault();
});


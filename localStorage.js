window.onload = saveUser("ball1", "Harry");
window.onload = saveUser("ball2", "Potter");
window.onload = updateUsers();


function updateUsers(){
    var users = getUsers();
    console.log(users);
}

function saveUser(ball, user){
    var JSONUser = JSON.stringify(user);
    localStorage.setItem(ball, JSONUser);    
}

function getUsers(){
    if(localStorage.getItem("ball1") == null){
        var user = [];
    }else{
        var user = JSON.parse(localStorage.getItem("ball1"));
    }
    return user;
}